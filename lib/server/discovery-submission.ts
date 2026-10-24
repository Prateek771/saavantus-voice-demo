import { createHash } from "node:crypto";
import { assess, dimensions, type Answers } from "../discovery.ts";
import { validateProfile, CONSENT_VERSION } from "../discovery-profile.ts";
import { MODEL_VERSION } from "../discovery-sheet.ts";
import { sameOriginRequest } from "./request-origin.mjs";
import { cachedCheck } from "./cached-check.ts";

type Dependencies = {
  ready: () => Promise<boolean>;
  verifyEmail?: (request: Request, email: string) => Promise<boolean>;
  save: (
    requestId: string,
    fingerprint: string,
    row: (string | number | boolean)[],
  ) => Promise<{ receiptId: string }>;
  now?: () => number;
};
const answerKeys = dimensions.flatMap((d) =>
  d.questions.map((_, i) => `${d.name}-${i}`),
);
export function validateDiscovery(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { ok: false as const, errors: { _form: "Invalid assessment." } };
  const data = input as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (
    Object.keys(data).some(
      (k) => !["requestId", "profile", "answers"].includes(k),
    )
  )
    errors._form = "Unsupported submission field.";
  if (
    typeof data.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      data.requestId,
    )
  )
    errors._form = "Invalid request identifier.";
  const profile = validateProfile(data.profile);
  if (!profile.ok) Object.assign(errors, profile.errors);
  const answers: Answers = {};
  const raw = data.answers;
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    errors.answers = "Complete all 40 responses.";
  else {
    const entries = raw as Record<string, unknown>;
    if (
      Object.keys(entries).length !== 40 ||
      Object.keys(entries).some((k) => !answerKeys.includes(k))
    )
      errors.answers = "Submit exactly the 40 assessment responses.";
    for (const key of answerKeys) {
      const value = entries[key];
      if (
        value !== "unknown" &&
        !(
          typeof value === "number" &&
          Number.isInteger(value) &&
          value >= 1 &&
          value <= 5
        )
      )
        errors.answers = "Choose a valid response to every statement.";
      else answers[key] = value as number | "unknown";
    }
  }
  if (Object.keys(errors).length || !profile.ok)
    return { ok: false as const, errors };
  return {
    ok: true as const,
    value: {
      requestId: data.requestId as string,
      profile: profile.value,
      answers,
    },
  };
}

// ponytail: process-local throttle; use a shared limiter before multi-instance public deployment.
export function createDiscoveryHandlers(deps: Dependencies) {
  const attempts = new Map<string, { start: number; count: number }>();
  const now = deps.now ?? Date.now;
  const ready = cachedCheck(deps.ready, now);
  const json = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  return {
    GET: async () => {
      try {
        return json({ ready: await ready() });
      } catch {
        return json({ ready: false });
      }
    },
    POST: async (request: Request) => {
      if (
        !sameOriginRequest(request.headers) ||
        request.headers.get("sec-fetch-site") !== "same-origin" ||
        request.headers.get("x-saavantus-discovery") !== "1"
      )
        return json(
          {
            saved: false,
            error: "This assessment must be submitted from this website.",
          },
          403,
        );
      if (
        request.headers
          .get("content-type")
          ?.split(";")[0]
          .trim()
          .toLowerCase() !== "application/json"
      )
        return json({ saved: false, error: "Use a JSON assessment." }, 415);
      // No trusted proxy is configured; caller-supplied forwarding headers are not identities.
      const key = "shared-local-preview";
      const time = now();
      let input: unknown;
      try {
        if (Number(request.headers.get("content-length")) > 32_768)
          return json({ saved: false, error: "Assessment is too large." }, 413);
        const reader = request.body?.getReader();
        if (!reader)
          return json({ saved: false, error: "Assessment is empty." }, 400);
        const chunks: Uint8Array[] = [];
        let bytes = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          bytes += part.value.byteLength;
          if (bytes > 32_768) {
            await reader.cancel();
            return json(
              { saved: false, error: "Assessment is too large." },
              413,
            );
          }
          chunks.push(part.value);
        }
        input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        return json(
          { saved: false, error: "Assessment must contain valid JSON." },
          400,
        );
      }
      const checked = validateDiscovery(input);
      if (!checked.ok)
        return json(
          {
            saved: false,
            error: "Review the highlighted fields.",
            fields: checked.errors,
            errors: checked.errors,
          },
          400,
        );
      const { requestId, profile: p, answers } = checked.value;
      if (
        !deps.verifyEmail ||
        !(await deps.verifyEmail(request, p.businessEmail))
      )
        return json(
          {
            saved: false,
            error: "Verify your business email before submitting.",
          },
          403,
        );
      // Reserve the accepted-submission budget for valid, verified assessments.
      for (const [k, v] of attempts)
        if (time - v.start >= 60_000) attempts.delete(k);
      const bucket = attempts.get(key) ?? { start: time, count: 0 };
      attempts.set(key, bucket);
      if (++bucket.count > 10 || attempts.size > 10_000)
        return json(
          {
            saved: false,
            error: "Too many attempts. Wait a minute and retry.",
          },
          429,
        );
      const fingerprint = createHash("sha256")
        .update(JSON.stringify({ profile: p, answers }))
        .digest("hex");
      const result = assess(answers);
      const workflowPercent =
        p.applicableWorkflows &&
        p.aiProductionWorkflows &&
        Number(p.applicableWorkflows) > 0
          ? (Number(p.aiProductionWorkflows) / Number(p.applicableWorkflows)) *
            100
          : "";
      const row: (string | number | boolean)[] = [
        requestId,
        fingerprint,
        new Date(time).toISOString(),
        p.fullName,
        p.businessEmail,
        p.organization,
        p.industry,
        p.organizationSize,
        p.jobTitle,
        p.country,
        p.phone,
        p.applicableWorkflows,
        p.aiProductionWorkflows,
        p.dataConsent,
        p.marketingConsent,
        CONSENT_VERSION,
        ...answerKeys.map((k) => answers[k]),
        ...result.dimensions.flatMap((d) => [d.score ?? "", d.known]),
        result.readiness.score ?? "",
        result.readiness.partial ?? "",
        result.readiness.known,
        result.adoption.score ?? "",
        result.adoption.partial ?? "",
        result.adoption.known,
        workflowPercent,
        MODEL_VERSION,
      ];
      try {
        if (!(await deps.ready()))
          return json(
            {
              saved: false,
              error:
                "Google Sheets storage is not configured. Your assessment has not been stored.",
            },
            503,
          );
        const receipt = await deps.save(requestId, fingerprint, row);
        return json({ ok: true, saved: true, receiptId: receipt.receiptId });
      } catch {
        return json(
          {
            saved: false,
            error:
              "Storage could not be confirmed. Retry with the same request; do not assume it was stored.",
          },
          503,
        );
      }
    },
  };
}
