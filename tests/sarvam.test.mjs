import test from "node:test";
import assert from "node:assert/strict";
import {
  readVoiceConfig,
  signSession,
  localRequestAllowed,
  createLimiter,
} from "../lib/server/sarvam.ts";

const env = {
  SARVAM_AGENTS_API_KEY: "private-test-key",
  SARVAM_ORG_ID: "org",
  SARVAM_WORKSPACE_ID: "workspace",
  SARVAM_REAL_ESTATE_AGENT_ID: "property",
  SARVAM_REAL_ESTATE_VERSION: "1",
  SARVAM_HEALTHCARE_AGENT_ID: "clinic",
  SARVAM_HEALTHCARE_VERSION: "2",
  SARVAM_WS_ORIGIN: "wss://voice.sarvam.ai",
  SARVAM_VOICE_ENABLED: "true",
};
const config = () => readVoiceConfig(env, "real-estate");
test("voice stays unavailable until explicit enable and complete managed-agent configuration", () => {
  assert.equal(readVoiceConfig({}, "real-estate"), null);
  assert.equal(
    readVoiceConfig({ ...env, SARVAM_AGENTS_API_KEY: "" }, "real-estate"),
    null,
  );
  assert.equal(
    readVoiceConfig(
      { ...env, SARVAM_REAL_ESTATE_VERSION: "latest" },
      "real-estate",
    ),
    null,
  );
  assert.equal(readVoiceConfig(env, "other"), null);
  assert.equal(config().appId, "property");
});
test("only a local same-origin browser request may sign a voice session", () => {
  const headers = {
    host: "127.0.0.1:3100",
    "sec-fetch-site": "same-origin",
    "x-saavantus-demo": "1",
  };
  assert.equal(localRequestAllowed(new Headers(headers)), true);
  assert.equal(
    localRequestAllowed(
      new Headers({ ...headers, origin: "https://evil.example" }),
    ),
    false,
  );
  assert.equal(
    localRequestAllowed(new Headers({ ...headers, host: "evil.example" })),
    false,
  );
  assert.equal(
    localRequestAllowed(
      new Headers({ ...headers, "sec-fetch-site": "cross-site" }),
    ),
    false,
  );
  assert.equal(localRequestAllowed(new Headers()), false);
});
test("session proxy fixes upstream identity/version and only returns a validated signed URL", async () => {
  let request;
  const result = await signSession(config(), async (url, init) => {
    request = { url, init };
    return Response.json({
      url: "wss://voice.sarvam.ai/session?token=fake",
      reference_id: "reference",
      secret: "not-returned",
    });
  });
  assert.match(
    request.url,
    /orgs\/org\/workspaces\/workspace\/apps\/property\/url\?interaction_type=call&version=1$/,
  );
  assert.equal(request.init.headers["X-API-Key"], "private-test-key");
  assert.deepEqual(Object.keys(result).sort(), ["reference_id", "url"]);
});
test("proxy rejects untrusted socket destinations and suppresses provider error details", async () => {
  await assert.rejects(
    signSession(config(), async () =>
      Response.json({ url: "wss://evil.example/session", reference_id: "x" }),
    ),
    /Invalid session response/,
  );
  await assert.rejects(
    signSession(
      config(),
      async () => new Response("private-test-key", { status: 401 }),
    ),
    /Sarvam authentication failed/,
  );
});
test("session rate limit is bounded and recovers after the window", () => {
  const admit = createLimiter(2, 1000);
  assert.equal(admit(0), true);
  assert.equal(admit(1), true);
  assert.equal(admit(2), false);
  assert.equal(admit(1001), true);
});
