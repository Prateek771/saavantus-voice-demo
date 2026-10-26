import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import config from "../next.config.mjs";
import { createDiscoveryHandlers } from "../lib/server/discovery-submission.ts";
import { createEmailVerificationHandlers } from "../lib/server/discovery-email-verification.ts";
import { createDiscoveryReportHandlers } from "../lib/server/discovery-report-delivery.ts";
import {
  emptyProfile,
  INDUSTRIES,
  ORGANIZATION_SIZES,
} from "../lib/discovery-profile.ts";
import { dimensions } from "../lib/discovery.ts";
import {
  handleContactRequest,
  createContactLimiter,
} from "../lib/server/contact.ts";

const payload = () => ({
  requestId: randomUUID(),
  profile: {
    ...emptyProfile,
    fullName: "Security Fixture",
    businessEmail: "fixture@example.test",
    organization: "Synthetic",
    industry: INDUSTRIES[0],
    organizationSize: ORGANIZATION_SIZES[0],
    jobTitle: "Reviewer",
    dataConsent: true,
  },
  answers: Object.fromEntries(
    dimensions.flatMap((d) => d.questions.map((_, i) => [`${d.name}-${i}`, 3])),
  ),
});
const request = (body = {}, extra = {}) =>
  new Request("http://localhost:3100/api/discovery/pdf", {
    method: "POST",
    headers: {
      host: "localhost:3100",
      origin: "http://localhost:3100",
      "sec-fetch-site": "same-origin",
      "x-saavantus-discovery": "1",
      "content-type": "application/json",
      ...extra,
    },
    body: JSON.stringify(body),
  });

test("rotating caller-supplied forwarding headers cannot reset the assessment limit", async () => {
  const h = createDiscoveryHandlers({
    ready: async () => false,
    save: async () => {
      throw Error("no external writes");
    },
    verifyEmail: async () => true,
  });
  for (let i = 0; i < 10; i++)
    assert.equal(
      (await h.POST(request(payload(), { "x-forwarded-for": "192.0.2.1" })))
        .status,
      503,
    );
  assert.equal(
    (await h.POST(request(payload(), { "x-forwarded-for": "192.0.2.2" })))
      .status,
    429,
  );
});

test("invalid contact requests cannot consume the accepted-submission budget", async (t) => {
  const directory = await mkdtemp(
    join(process.env.SAAVANTUS_TEST_TEMP_DIR ?? tmpdir(), "security-contact-"),
  );
  t.after(() => rm(directory, { recursive: true, force: true }));
  const options = {
    storePath: directory,
    admit: createContactLimiter(2),
    googleSave: async (id) => ({ receiptId: id }),
  };
  const contactRequest = (body) =>
    request(body, { "x-saavantus-contact": "1" });
  for (let i = 0; i < 3; i++)
    assert.equal(
      (await handleContactRequest(contactRequest({}), options)).status,
      422,
    );
  const valid = {
    requestId: randomUUID(),
    name: "Security Fixture",
    company: "Synthetic",
    email: "fixture@example.test",
    phone: "",
    industry: "other",
    requirements: "Synthetic validation test only",
    callbackDate: "",
    callbackTime: "",
    consent: true,
    website: "",
  };
  assert.equal(
    (await handleContactRequest(contactRequest(valid), options)).status,
    201,
  );
});

test("unverified assessments cannot consume the verified-submission budget", async () => {
  const h = createDiscoveryHandlers({
    ready: async () => {
      throw Error("must not check provider");
    },
    save: async () => {
      throw Error("must not save");
    },
    verifyEmail: async () => false,
  });
  for (let i = 0; i < 12; i++)
    assert.equal((await h.POST(request(payload()))).status, 403);
});

test("public readiness checks coalesce concurrent provider calls and expire", async () => {
  let calls = 0,
    time = 100000;
  const h = createDiscoveryHandlers({
    now: () => time,
    ready: async () => {
      calls++;
      return true;
    },
    save: async () => {
      throw Error("no writes");
    },
  });
  const responses = await Promise.all(Array.from({ length: 8 }, () => h.GET()));
  assert.equal(calls, 1);
  for (const r of responses) assert.deepEqual(await r.json(), { ready: true });
  time += 30001;
  await h.GET();
  assert.equal(calls, 2);
});

test("email status checks share readiness only, never verified-address status", async () => {
  let calls = 0;
  const h = createEmailVerificationHandlers({
    mailReady: async () => {
      calls++;
      return true;
    },
    sendCode: async () => {
      throw Error("no email");
    },
  });
  const responses = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      h.GET(
        new Request(
          `http://localhost:3100/api/discovery/email-verification?email=fixture${i}@example.test`,
          {
            headers: {
              host: "localhost:3100",
              "sec-fetch-site": "same-origin",
              "x-saavantus-discovery": "1",
            },
          },
        ),
      ),
    ),
  );
  assert.equal(calls, 1);
  for (const r of responses)
    assert.deepEqual(await r.json(), { ready: true, verified: false });
});

test("verified PDF requests have a bounded per-address budget and recover", async () => {
  let generated = 0,
    time = 100000;
  const h = createDiscoveryReportHandlers({
    now: () => time,
    verify: async () => true,
    generate: async () => {
      generated++;
      return new TextEncoder().encode("%PDF-fixture");
    },
    send: async () => {
      throw Error("no email");
    },
  });
  for (let i = 0; i < 10; i++)
    assert.equal((await h.PDF(request(payload()))).status, 200);
  const denied = await h.PDF(
    request(payload(), { "x-forwarded-for": "198.51.100.2" }),
  );
  assert.equal(denied.status, 429);
  assert.equal(generated, 10);
  time += 3600001;
  assert.equal((await h.PDF(request(payload()))).status, 200);
});

test("PDF concurrency is bounded and generation failures release capacity", async () => {
  let active = 0,
    resolveStarted,
    release;
  const started = new Promise((resolve) => {
    resolveStarted = resolve;
  });
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const h = createDiscoveryReportHandlers({
    verify: async () => true,
    generate: async () => {
      if (++active === 2) resolveStarted();
      await gate;
      active--;
      return new TextEncoder().encode("%PDF-fixture");
    },
    send: async () => {
      throw Error("no email");
    },
  });
  const first = h.PDF(request(payload())),
    second = h.PDF(request(payload()));
  await started;
  const third = h.PDF(request(payload()));
  let timer;
  try {
    const bounded = await Promise.race([
      third,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(null), 250);
      }),
    ]);
    assert.equal(bounded?.status, 429);
  } finally {
    clearTimeout(timer);
    release();
  }
  assert.equal((await first).status, 200);
  assert.equal((await second).status, 200);
  assert.equal(active, 0);
  let fail = true;
  const failures = createDiscoveryReportHandlers({
    verify: async () => true,
    generate: async () => {
      if (fail) throw Error("fixture");
      return new Uint8Array([1]);
    },
    send: async () => {
      throw Error("no email");
    },
  });
  for (let i = 0; i < 3; i++)
    assert.equal((await failures.PDF(request(payload()))).status, 503);
  fail = false;
  assert.equal((await failures.PDF(request(payload()))).status, 200);
});

test("production pages prevent framing and do not permit dynamic code evaluation", async () => {
  const routes = await config.headers();
  for (const route of routes.filter((r) =>
    r.headers.some((h) => h.key.toLowerCase() === "content-security-policy"),
  )) {
    const policy = route.headers.find(
      (h) => h.key.toLowerCase() === "content-security-policy",
    ).value;
    assert.match(policy, /(?:^|;)\s*frame-ancestors 'none'(?:;|$)/);
    assert.equal(policy.includes("'unsafe-eval'"), false);
    const frameSources = policy
      .match(/(?:^|;)\s*frame-src\s+([^;]+)/)?.[1]
      .split(/\s+/);
    assert.deepEqual(frameSources, [
      "https://www.google.com/maps",
      "https://www.google.com/maps/",
      "https://calendly.com",
    ]);
  }
  assert.equal(
    routes.some((r) =>
      r.headers.some(
        (h) => h.key.toLowerCase() === "x-frame-options" && h.value === "DENY",
      ),
    ),
    true,
  );
});
