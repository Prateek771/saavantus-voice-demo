import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createDiscoveryReportHandlers } from "../lib/server/discovery-report-delivery.ts";
import {
  emptyProfile,
  INDUSTRIES,
  ORGANIZATION_SIZES,
} from "../lib/discovery-profile.ts";
import { dimensions } from "../lib/discovery.ts";
const payload = () => ({
  requestId: randomUUID(),
  profile: {
    ...emptyProfile,
    fullName: "Report Owner",
    businessEmail: "owner@example.com",
    organization: "Example",
    industry: INDUSTRIES[0],
    organizationSize: ORGANIZATION_SIZES[0],
    jobTitle: "Director",
    dataConsent: true,
  },
  answers: Object.fromEntries(
    dimensions.flatMap((d) => d.questions.map((_, i) => [`${d.name}-${i}`, 3])),
  ),
});
const request = (data = payload(), headers = {}) =>
  new Request("http://localhost:3100/api/discovery/pdf", {
    method: "POST",
    headers: {
      host: "localhost:3100",
      origin: "http://localhost:3100",
      "sec-fetch-site": "same-origin",
      "x-saavantus-discovery": "1",
      "content-type": "application/json",
      ...headers,
    },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
function fixture() {
  const generated = [];
  return {
    generated,
    handlers: createDiscoveryReportHandlers({
      generate: async (profile, answers) => {
        generated.push({ profile, answers });
        return new TextEncoder().encode("%PDF-fixture");
      },
    }),
  };
}
test("PDF downloads from validated inputs without verification cookies or a mail provider", async () => {
  const f = fixture();
  const data = payload();
  const response = await f.handlers.PDF(request(data));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.match(response.headers.get("content-disposition"), /attachment/);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(await response.text(), "%PDF-fixture");
  assert.deepEqual(f.generated, [
    {
      profile: { ...data.profile, businessEmail: "owner@example.com" },
      answers: data.answers,
    },
  ]);
});
test("PDF boundaries retain origin, media, size, profile, consent and score validation", async () => {
  const f = fixture();
  assert.equal(
    (await f.handlers.PDF(request(payload(), { origin: "https://evil.test" })))
      .status,
    403,
  );
  assert.equal(
    (
      await f.handlers.PDF(
        request(payload(), { "sec-fetch-site": "cross-site" }),
      )
    ).status,
    403,
  );
  assert.equal(
    (await f.handlers.PDF(request(payload(), { "x-saavantus-discovery": "" })))
      .status,
    403,
  );
  assert.equal(
    (await f.handlers.PDF(request(payload(), { "content-type": "text/plain" })))
      .status,
    415,
  );
  assert.equal((await f.handlers.PDF(request(" ".repeat(32769)))).status, 413);
  for (const patch of [
    { to: "other@example.com" },
    { score: 100 },
    { profile: { ...payload().profile, businessEmail: "invalid" } },
    { profile: { ...payload().profile, dataConsent: false } },
  ])
    assert.equal(
      (await f.handlers.PDF(request({ ...payload(), ...patch }))).status,
      400,
    );
  assert.equal((await f.handlers.PDF(request("{"))).status, 400);
  assert.equal(f.generated.length, 0);
});
