// Server use only. Never import this module from a client component.
export type VoiceConfig = {
  key: string;
  orgId: string;
  workspaceId: string;
  appId: string;
  version: number;
  socketOrigin: string;
};
export function readVoiceConfig(
  env: Record<string, string | undefined>,
  industry: string,
): VoiceConfig | null {
  if (
    env.SARVAM_VOICE_ENABLED !== "true" ||
    !["real-estate", "healthcare"].includes(industry)
  )
    return null;
  const prefix =
    industry === "real-estate" ? "SARVAM_REAL_ESTATE" : "SARVAM_HEALTHCARE";
  const key = env.SARVAM_AGENTS_API_KEY?.trim();
  const orgId = env.SARVAM_ORG_ID?.trim();
  const workspaceId = env.SARVAM_WORKSPACE_ID?.trim();
  const appId = env[`${prefix}_AGENT_ID`]?.trim();
  const version = Number(env[`${prefix}_VERSION`]);
  if (
    !key ||
    !orgId ||
    !workspaceId ||
    !appId ||
    !Number.isInteger(version) ||
    version < 1
  )
    return null;
  if (
    ![orgId, workspaceId, appId].every((value) => /^[\w-]{1,160}$/.test(value))
  )
    return null;
  try {
    const socket = new URL(env.SARVAM_WS_ORIGIN ?? "");
    if (
      socket.protocol !== "wss:" ||
      socket.username ||
      socket.password ||
      socket.pathname !== "/" ||
      socket.search ||
      socket.hash
    )
      return null;
    // Actual hostname is copied from an authenticated Sarvam signing response.
    return {
      key,
      orgId,
      workspaceId,
      appId,
      version,
      socketOrigin: socket.origin,
    };
  } catch {
    return null;
  }
}
export function publicVoiceConfig(config: VoiceConfig) {
  return {
    org_id: config.orgId,
    workspace_id: config.workspaceId,
    app_id: config.appId,
    version: config.version,
  };
}
export function localRequestAllowed(headers: Headers) {
  const host = headers.get("host");
  if (!["127.0.0.1:3100", "localhost:3100"].includes(host ?? "")) return false;
  if (
    headers.get("sec-fetch-site") !== "same-origin" ||
    headers.get("x-saavantus-demo") !== "1"
  )
    return false;
  const origin = headers.get("origin");
  return !origin || origin === `http://${host}`;
}
export function createLimiter(max: number, windowMs: number) {
  let starts: number[] = [];
  return (now = Date.now()) => {
    starts = starts.filter((time) => now - time < windowMs);
    if (starts.length >= max) return false;
    starts.push(now);
    return true;
  };
}
export const admitSession = createLimiter(20, 60 * 60 * 1000);
export async function signSession(
  config: VoiceConfig,
  send: typeof fetch = fetch,
) {
  const url = `https://apps.sarvam.ai/api/app-runtime/orgs/${config.orgId}/workspaces/${config.workspaceId}/apps/${config.appId}/url?interaction_type=call&version=${config.version}`;
  let response: Response;
  try {
    response = await send(url, {
      headers: { "X-API-Key": config.key },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error("Sarvam could not be reached");
  }
  if (!response.ok)
    throw new Error(
      response.status === 401 || response.status === 403
        ? "Sarvam authentication failed"
        : "Sarvam session unavailable",
    );
  const text = await response.text();
  if (text.length > 20000) throw new Error("Invalid session response");
  try {
    const data = JSON.parse(text);
    const socket = new URL(data.url);
    if (
      socket.protocol !== "wss:" ||
      socket.origin !== config.socketOrigin ||
      socket.username ||
      socket.password ||
      typeof data.reference_id !== "string" ||
      !data.reference_id
    )
      throw new Error();
    return { url: socket.href, reference_id: data.reference_id };
  } catch {
    throw new Error("Invalid session response");
  }
}
