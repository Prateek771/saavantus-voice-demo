import test from "node:test";
import assert from "node:assert/strict";
import {
  createDiscoveryHandlers,
  validateDiscovery,
} from "../lib/server/discovery-submission.ts";
import {
  emptyProfile,
  INDUSTRIES,
  ORGANIZATION_SIZES,
  validateProfile,
} from "../lib/discovery-profile.ts";
import { DISCOVERY_HEADERS } from "../lib/discovery-sheet.ts";
import { dimensions } from "../lib/discovery.ts";
const profile = {
  ...emptyProfile,
  fullName: "Owner",
  businessEmail: "OWNER@example.com",
  organization: "Example",
  industry: INDUSTRIES[0],
  organizationSize: ORGANIZATION_SIZES[0],
  jobTitle: "Director",
  dataConsent: true,
};
const payload = () => ({
  requestId: "3136a165-c099-4083-89eb-a45cd192477d",
  profile: { ...profile },
  answers: Object.fromEntries(
    dimensions.flatMap((d) => d.questions.map((_, i) => [`${d.name}-${i}`, 5])),
  ),
});
const request = (body = payload(), headers = {}) =>
  new Request("http://localhost:3100/api/discovery", {
    method: "POST",
    headers: {
      host: "localhost:3100",
      origin: "http://localhost:3100",
      "sec-fetch-site": "same-origin",
      "x-saavantus-discovery": "1",
      "content-type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
test("profile rejects consent, text, counts and unsupported fields", () => {
  for (const patch of [
    { dataConsent: false },
    { marketingConsent: "yes" },
    { phone: "123" },
    { country: "" },
    { applicableWorkflows: "2", aiProductionWorkflows: "3" },
    { applicableWorkflows: "-1" },
    { applicableWorkflows: "1e3" },
    { applicableWorkflows: "10000001" },
    { fullName: "x\n" },
    { score: 100 },
  ])
    assert.equal(validateProfile({ ...profile, ...patch }).ok, false);
  assert.equal(validateProfile(profile).ok, true);
});
test("submission requires exactly forty valid answers and rejects forged scores", () => {
  const data = payload();
  delete data.answers["Strategy-0"];
  assert.equal(validateDiscovery(data).ok, false);
  assert.equal(
    validateDiscovery({ ...payload(), scores: { readiness: 100 } }).ok,
    false,
  );
  const invalid = payload();
  invalid.answers["Strategy-0"] = 6;
  assert.equal(validateDiscovery(invalid).ok, false);
});

test("unverified email and missing verifier fail closed before storage", async () => {
  let calls = 0;
  const base = {
    ready: async () => true,
    save: async () => {
      calls++;
      return { receiptId: "must-not-save" };
    },
  };
  for (const deps of [base, { ...base, verifyEmail: async () => false }]) {
    const response = await createDiscoveryHandlers(deps).POST(request());
    assert.equal(response.status, 403);
  }
  assert.equal(calls, 0);
});
test("request boundary, JSON and body size fail before storage", async () => {
  let calls = 0;
  const h = createDiscoveryHandlers({
    verifyEmail: async () => true,
    ready: async () => true,
    save: async () => {
      calls++;
      return { receiptId: "receipt" };
    },
  });
  assert.equal(
    (await h.POST(request(payload(), { origin: "https://other.test" }))).status,
    403,
  );
  assert.equal(
    (await h.POST(request(payload(), { "sec-fetch-site": "cross-site" })))
      .status,
    403,
  );
  assert.equal(
    (await h.POST(request(payload(), { "x-saavantus-discovery": "" }))).status,
    403,
  );
  assert.equal(
    (await h.POST(request(payload(), { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal((await h.POST(request("{"))).status, 400);
  assert.equal((await h.POST(request(" ".repeat(32769)))).status, 413);
  assert.equal(calls, 0);
});
test("server scores, schema order, unknowns and stable retry fingerprints", async () => {
  const rows = [];
  const h = createDiscoveryHandlers({
    verifyEmail: async () => true,
    ready: async () => true,
    save: async (id, hash, row) => {
      rows.push({ id, hash, row });
      return { receiptId: "receipt" };
    },
  });
  const data = payload();
  data.profile.applicableWorkflows = "10";
  data.profile.aiProductionWorkflows = "2";
  assert.equal((await (await h.POST(request(data))).json()).saved, true);
  assert.equal((await h.POST(request(data))).status, 200);
  assert.equal(rows[0].hash, rows[1].hash);
  assert.equal(rows[0].row.length, DISCOVERY_HEADERS.length);
  const stored = Object.fromEntries(
    DISCOVERY_HEADERS.map((key, i) => [key, rows[0].row[i]]),
  );
  assert.equal(stored.request_id, data.requestId);
  assert.equal(stored.readiness_score, 100);
  assert.equal(stored.workflow_ai_percentage, 20);
  assert.equal(stored.business_email, "owner@example.com");
  for (const key in data.answers) data.answers[key] = "unknown";
  await h.POST(request(data));
  assert.equal(rows[2].row[DISCOVERY_HEADERS.indexOf("readiness_score")], "");
});
test("unconfigured or failed storage is truthful, and throttling is enforced", async () => {
  const h = createDiscoveryHandlers({
    verifyEmail: async () => true,
    ready: async () => false,
    save: async () => {
      throw Error("must not save");
    },
  });
  assert.deepEqual(await (await h.GET()).json(), { ready: false });
  assert.equal((await h.POST(request())).status, 503);
  for (let i = 1; i < 10; i++) await h.POST(request());
  assert.equal((await h.POST(request())).status, 429);
  const failed = createDiscoveryHandlers({
    verifyEmail: async () => true,
    ready: async () => true,
    save: async () => {
      throw Error("private details");
    },
  });
  const response = await failed.POST(request());
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes("private details"), false);
});
