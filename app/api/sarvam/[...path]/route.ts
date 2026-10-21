import {
  admitSession,
  localRequestAllowed,
  readVoiceConfig,
  signSession,
} from "@/lib/server/sarvam";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const headers = { "Cache-Control": "no-store" };
  const fail = (message: string, status: number) =>
    Response.json({ error: message }, { status, headers });
  if (!localRequestAllowed(request.headers))
    return fail("Local preview requests only", 403);
  const { path } = await context.params;
  const config = ["real-estate", "healthcare"]
    .map((industry) => readVoiceConfig(process.env, industry))
    .find(
      (candidate) =>
        candidate &&
        path.join("/") ===
          `orgs/${candidate.orgId}/workspaces/${candidate.workspaceId}/apps/${candidate.appId}/url`,
    );
  if (!config) return fail("Voice agent is not configured", 503);
  const query = new URL(request.url).searchParams;
  if (
    query.get("interaction_type") !== "call" ||
    query.get("version") !== String(config.version) ||
    Array.from(query.keys()).length !== 2
  )
    return fail("Unsupported session request", 400);
  if (!admitSession())
    return fail("Local demo session limit reached. Try later.", 429);
  try {
    return Response.json(await signSession(config), { headers });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Voice session unavailable",
      502,
    );
  }
}
