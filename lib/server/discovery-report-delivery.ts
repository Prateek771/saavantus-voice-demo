import { createHash } from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { validateDiscovery } from "./discovery-submission.ts";
import { sameOriginRequest } from "./request-origin.mjs";
import { MODEL_VERSION } from "../discovery-sheet.ts";
import type { OrganizationProfile } from "../discovery-profile.ts";
import type { Answers } from "../discovery.ts";

type Dependencies = {
  generate: (
    profile: OrganizationProfile,
    answers: Answers,
  ) => Promise<Uint8Array>;
  verify: (request: Request, email: string) => Promise<boolean>;
  send: (
    to: string,
    subject: string,
    text: string,
    pdf: Uint8Array,
  ) => Promise<unknown>;
  directory?: string;
  now?: () => number;
};
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function readSubmission(request: Request) {
  if (request.method !== "POST")
    return { response: json({ error: "Method not allowed." }, 405) };
  if (
    !sameOriginRequest(request.headers) ||
    request.headers.get("sec-fetch-site") !== "same-origin" ||
    request.headers.get("x-saavantus-discovery") !== "1"
  )
    return {
      response: json(
        { error: "Open the assessment on the configured website." },
        403,
      ),
    };
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return { response: json({ error: "Use a JSON assessment." }, 415) };
  let input: unknown;
  try {
    if (Number(request.headers.get("content-length")) > 32768)
      return { response: json({ error: "Assessment is too large." }, 413) };
    const reader = request.body?.getReader();
    if (!reader)
      return { response: json({ error: "Complete your assessment." }, 400) };
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > 32768) {
        await reader.cancel();
        return { response: json({ error: "Assessment is too large." }, 413) };
      }
      chunks.push(part.value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return { response: json({ error: "Enter a valid assessment." }, 400) };
  }
  const checked = validateDiscovery(input);
  if (!checked.ok)
    return {
      response: json(
        { error: "Review your assessment fields.", fields: checked.errors },
        400,
      ),
    };
  return { value: checked.value };
}
export function createDiscoveryReportHandlers(deps: Dependencies) {
  const directory =
      deps.directory ??
      join(process.cwd(), ".data", "discovery-report-delivery"),
    now = deps.now ?? Date.now;
  // ponytail: per-process preview budgets; use a shared limiter for multiple instances.
  let activePdfs = 0;
  let pdfRequests: { email: string; at: number }[] = [];
  const authorized = async (request: Request) => {
    const parsed = await readSubmission(request);
    if (parsed.response) return parsed;
    try {
      if (!(await deps.verify(request, parsed.value.profile.businessEmail)))
        return {
          response: json(
            {
              error: "Verify this assessment email before requesting a report.",
            },
            403,
          ),
        };
    } catch {
      return {
        response: json(
          { error: "Email verification is unavailable. Retry later." },
          503,
        ),
      };
    }
    return parsed;
  };
  return {
    PDF: async (request: Request) => {
      const parsed = await authorized(request);
      if (parsed.response) return parsed.response;
      const time = now();
      pdfRequests = pdfRequests.filter((entry) => time - entry.at < 3_600_000);
      const email = hash(parsed.value.profile.businessEmail);
      if (
        activePdfs >= 2 ||
        pdfRequests.length >= 60 ||
        pdfRequests.filter((entry) => entry.email === email).length >= 10
      )
        return json(
          {
            error:
              "PDF request limit reached. Please wait before downloading again.",
          },
          429,
        );
      pdfRequests.push({ email, at: time });
      activePdfs++;
      try {
        const pdf = await deps.generate(
          parsed.value.profile,
          parsed.value.answers,
        );
        return new Response(new Uint8Array(pdf).buffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition":
              'attachment; filename="Saavantus-Excellence-AI-Discovery.pdf"',
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      } catch {
        return json(
          {
            error:
              "The PDF could not be generated. Your answers remain in this page.",
          },
          503,
        );
      } finally {
        activePdfs--;
      }
    },
    EMAIL: async (request: Request) => {
      const parsed = await authorized(request);
      if (parsed.response) return parsed.response;
      const { profile, answers } = parsed.value;
      // requestId is deliberately excluded: repeated clicks with a new UUID must not send again.
      const fingerprint = hash(
        JSON.stringify({
          profile,
          answers,
          model: MODEL_VERSION,
          report: "summary-v2",
        }),
      );
      let lock: Awaited<ReturnType<typeof open>> | undefined;
      const lockPath = join(directory, "writer.lock");
      try {
        await mkdir(directory, { recursive: true, mode: 0o700 });
        lock = await open(lockPath, "wx", 0o600);
        const receiptPath = join(
          /* turbopackIgnore: true */ directory,
          fingerprint + ".json",
        );
        let prior: { status: string } | undefined;
        try {
          prior = JSON.parse(await readFile(receiptPath, "utf8"));
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        }
        if (prior?.status === "sent")
          return json({ sent: true, receiptId: fingerprint, duplicate: true });
        if (prior)
          return json(
            {
              sent: false,
              error:
                "A previous email attempt is unconfirmed. Check your inbox; another email will not be sent automatically.",
            },
            409,
          );
        const ratePath = join(directory, "rates.json");
        let rates: Record<string, number[]> = {};
        try {
          rates = JSON.parse(await readFile(ratePath, "utf8"));
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        }
        const time = now();
        for (const [email, times] of Object.entries(rates)) {
          rates[email] = times.filter((t) => time - t < 3600000);
          if (!rates[email].length) delete rates[email];
        }
        const emailHash = hash(profile.businessEmail),
          attempts = rates[emailHash] ?? [];
        if (attempts.length >= 3)
          return json(
            {
              sent: false,
              error: "Report email limit reached. Please wait an hour.",
            },
            429,
          );
        if (Object.keys(rates).length > 10000)
          return json(
            { sent: false, error: "Report delivery is busy. Retry later." },
            503,
          );
        const pdf = await deps.generate(profile, answers);
        attempts.push(time);
        rates[emailHash] = attempts;
        const rateFile = await open(
          join(directory, "rates.pending"),
          "w",
          0o600,
        );
        try {
          await rateFile.writeFile(JSON.stringify(rates));
          await rateFile.sync();
        } finally {
          await rateFile.close();
        }
        await rename(join(directory, "rates.pending"), ratePath);
        const receipt = await open(receiptPath, "wx", 0o600);
        try {
          await receipt.writeFile(
            JSON.stringify({
              fingerprint,
              emailHash,
              status: "pending",
              createdAt: time,
            }),
          );
          await receipt.sync();
        } finally {
          await receipt.close();
        }
        await deps.send(
          profile.businessEmail,
          "Your AI Discovery report - Saavantus Excellence",
          "Attached is your AI Discovery self-assessment report. It reflects the answers you provided and is not an independent audit or certification. Review evidence and priorities with your team before making decisions.",
          pdf,
        );
        await writeFile(
          receiptPath,
          JSON.stringify({
            fingerprint,
            emailHash,
            status: "sent",
            createdAt: time,
          }),
          { mode: 0o600 },
        );
        return json({ sent: true, receiptId: fingerprint });
      } catch {
        return json(
          {
            sent: false,
            error:
              "Email delivery could not be confirmed. Check your inbox before retrying. An unconfirmed attempt will not be automatically resent.",
          },
          503,
        );
      } finally {
        if (lock) {
          await lock.close();
          await unlink(lockPath).catch(() => {});
        }
      }
    },
  };
}
