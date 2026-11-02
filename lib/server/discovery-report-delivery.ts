import { createHash } from "node:crypto";
import { validateDiscovery } from "./discovery-submission.ts";
import { sameOriginRequest } from "./request-origin.mjs";
import type { OrganizationProfile } from "../discovery-profile.ts";
import type { Answers } from "../discovery.ts";
type Dependencies = {
  generate: (
    profile: OrganizationProfile,
    answers: Answers,
  ) => Promise<Uint8Array>;
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
  const now = deps.now ?? Date.now;
  // ponytail: per-process preview budgets; use a shared limiter for multiple instances.
  let activePdfs = 0;
  let pdfRequests: { email: string; at: number }[] = [];
  return {
    PDF: async (request: Request) => {
      const parsed = await readSubmission(request);
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
  };
}
