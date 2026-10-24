import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createEmailVerificationHandlers,
  requireVerifiedEmail,
  checkVerificationDomain,
} from "../lib/server/discovery-email-verification.ts";
const email = "owner@example.com";
const request = (body, cookie = "", headers = {}) =>
  new Request("http://localhost:3100/api/discovery/email-verification", {
    method: "POST",
    headers: {
      host: "localhost:3100",
      origin: "http://localhost:3100",
      "sec-fetch-site": "same-origin",
      "x-saavantus-discovery": "1",
      "content-type": "application/json",
      cookie,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
async function fixture(t, overrides = {}) {
  const directory = await mkdtemp(
    join(
      process.env.SAAVANTUS_TEST_TEMP_DIR ?? tmpdir(),
      "discovery-email-test-",
    ),
  );
  t.after(() => rm(directory, { recursive: true, force: true }));
  let time = Date.parse("2026-10-23T10:00:00Z");
  const sent = [];
  const deps = {
    directory,
    now: () => time,
    mailReady: async () => true,
    sendCode: async (email, code) => {
      sent.push({ email, code });
    },
    checkDomain: async () => true,
    ...overrides,
  };
  return {
    directory,
    sent,
    handlers: createEmailVerificationHandlers(deps),
    advance: (ms) => {
      time += ms;
    },
    now: () => time,
  };
}
const cookieOf = (response) => response.headers.get("set-cookie").split(";")[0];

test("spoofed forwarding headers cannot bypass the local preview send quota", async (t) => {
  const f = await fixture(t);
  for (let i = 0; i < 20; i++) {
    assert.equal(
      (
        await f.handlers.POST(
          request({ action: "send", email: `owner${i}@example.com` }, "", {
            "x-forwarded-for": `192.0.2.${i}`,
          }),
        )
      ).status,
      200,
    );
  }
  assert.equal(
    (
      await f.handlers.POST(
        request({ action: "send", email: "another@example.com" }, "", {
          "x-forwarded-for": "198.51.100.1",
        }),
      )
    ).status,
    429,
  );
  assert.equal(f.sent.length, 20);
});
test("OTP proof is cookie/email bound, hashed on disk, and expires", async (t) => {
  const f = await fixture(t);
  const send = await f.handlers.POST(
    request({ action: "send", email: " Owner@Example.COM " }),
  );
  assert.equal(send.status, 200);
  assert.match(send.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
  const cookie = cookieOf(send);
  const code = f.sent[0].code;
  assert.match(code, /^\d{6}$/);
  assert.equal(f.sent[0].email, email);
  const state = await readFile(join(f.directory, "state.json"), "utf8");
  assert.equal(state.includes(code), false);
  assert.equal(state.includes(cookie.split("=")[1]), false);
  assert.equal(
    (
      await f.handlers.POST(
        request({ action: "verify", email: "other@example.com", code }, cookie),
      )
    ).status,
    400,
  );
  assert.equal(
    (await f.handlers.POST(request({ action: "verify", email, code }))).status,
    400,
  );
  assert.equal(
    (await f.handlers.POST(request({ action: "verify", email, code }, cookie)))
      .status,
    200,
  );
  assert.equal(
    await requireVerifiedEmail(request({}, cookie), email, {
      directory: f.directory,
      now: f.now,
    }),
    true,
  );
  assert.equal(
    await requireVerifiedEmail(request({}, cookie), "other@example.com", {
      directory: f.directory,
      now: f.now,
    }),
    false,
  );
  f.advance(86400001);
  assert.equal(
    await requireVerifiedEmail(request({}, cookie), email, {
      directory: f.directory,
      now: f.now,
    }),
    false,
  );
  assert.equal((await readdir(f.directory)).includes("writer.lock"), false);
});
test("five wrong attempts and ten minute expiry reject even the correct code", async (t) => {
  const f = await fixture(t);
  let response = await f.handlers.POST(request({ action: "send", email }));
  let cookie = cookieOf(response);
  const wrong = f.sent[0].code === "000000" ? "000001" : "000000";
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await f.handlers.POST(
          request({ action: "verify", email, code: wrong }, cookie),
        )
      ).status,
      400,
    );
  assert.equal(
    (
      await f.handlers.POST(
        request({ action: "verify", email, code: f.sent[0].code }, cookie),
      )
    ).status,
    400,
  );
  f.advance(60001);
  response = await f.handlers.POST(request({ action: "send", email }, cookie));
  cookie = cookieOf(response);
  f.advance(600001);
  assert.equal(
    (
      await f.handlers.POST(
        request({ action: "verify", email, code: f.sent[1].code }, cookie),
      )
    ).status,
    400,
  );
});
test("resend cooldown persists across handler instances and domain/send failures are truthful", async (t) => {
  const f = await fixture(t);
  await f.handlers.POST(request({ action: "send", email }));
  const second = createEmailVerificationHandlers({
    directory: f.directory,
    now: f.now,
    mailReady: async () => true,
    sendCode: async () => {
      throw Error("should not send");
    },
    checkDomain: async () => true,
  });
  assert.equal(
    (await second.POST(request({ action: "send", email }))).status,
    429,
  );
  const invalid = await fixture(t, { checkDomain: async () => false });
  assert.equal(
    (await invalid.handlers.POST(request({ action: "send", email }))).status,
    400,
  );
  assert.equal(invalid.sent.length, 0);
  const unavailable = await fixture(t, {
    checkDomain: async () => {
      throw Error("DNS timeout");
    },
  });
  assert.equal(
    (await unavailable.handlers.POST(request({ action: "send", email })))
      .status,
    503,
  );
  const noMail = await fixture(t, { mailReady: async () => false });
  assert.equal(
    (await noMail.handlers.POST(request({ action: "send", email }))).status,
    503,
  );
});
test("origin, action shape, media type and 4KB boundary reject abuse", async (t) => {
  const f = await fixture(t);
  assert.equal(
    (
      await f.handlers.POST(
        request({ action: "send", email }, "", { origin: "https://evil.test" }),
      )
    ).status,
    403,
  );
  assert.equal(
    (await f.handlers.POST(request({ action: "send", email, verified: true })))
      .status,
    400,
  );
  assert.equal(
    (
      await f.handlers.POST(
        request({ action: "send", email }, "", {
          "content-type": "text/plain",
        }),
      )
    ).status,
    415,
  );
  assert.equal((await f.handlers.POST(request(" ".repeat(4097)))).status, 413);
  assert.equal(f.sent.length, 0);
});
test("domain policy blocks disposable subdomains and null/missing MX; lookup errors remain retryable", async (t) => {
  const f = await fixture(t);
  const denylistPath = join(f.directory, "deny.txt");
  await writeFile(denylistPath, "# local list\ntrash.test\n");
  let calls = 0;
  const lookup = async () => {
    calls++;
    return [{ exchange: "mx.example.com", priority: 10 }];
  };
  assert.equal(
    await checkVerificationDomain("child.trash.test", { denylistPath, lookup }),
    false,
  );
  assert.equal(calls, 0);
  assert.equal(
    await checkVerificationDomain("example.com", { denylistPath, lookup }),
    true,
  );
  assert.equal(
    await checkVerificationDomain("example.com", {
      denylistPath,
      lookup: async () => [{ exchange: ".", priority: 0 }],
    }),
    false,
  );
  assert.equal(
    await checkVerificationDomain("example.com", {
      denylistPath,
      lookup: async () => [],
    }),
    false,
  );
  await assert.rejects(
    checkVerificationDomain("example.com", {
      denylistPath,
      lookup: async () => {
        throw Error("timeout");
      },
    }),
    /timeout/,
  );
});

test("concurrent sends cannot bypass the persistent throttle and GET reports bound proof", async (t) => {
  const f = await fixture(t);
  const responses = await Promise.all([
    f.handlers.POST(request({ action: "send", email })),
    f.handlers.POST(request({ action: "send", email })),
  ]);
  assert.equal(responses.filter((r) => r.status === 200).length, 1);
  assert.equal(f.sent.length, 1);
  assert.equal(
    responses.some((r) => r.status === 503 || r.status === 429),
    true,
  );
  const cookie = cookieOf(responses.find((r) => r.status === 200));
  await f.handlers.POST(
    request({ action: "verify", email, code: f.sent[0].code }, cookie),
  );
  const get = new Request(
    "http://localhost:3100/api/discovery/email-verification?email=" + email,
    {
      headers: {
        host: "localhost:3100",
        "sec-fetch-site": "same-origin",
        "x-saavantus-discovery": "1",
        cookie,
      },
    },
  );
  assert.deepEqual(await (await f.handlers.GET(get)).json(), {
    ready: true,
    verified: true,
  });
  for (let i = 0; i < 4; i++) {
    f.advance(60001);
    assert.equal(
      (await f.handlers.POST(request({ action: "send", email }, cookie)))
        .status,
      200,
    );
  }
  f.advance(60001);
  assert.equal(
    (await f.handlers.POST(request({ action: "send", email }, cookie))).status,
    429,
  );
});
