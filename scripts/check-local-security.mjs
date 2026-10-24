/** Bounded local checks. Never sends mail, signs voice sessions or writes records. */
import assert from "node:assert/strict";

const base = "http://127.0.0.1:3100";
let checks = 0;
for (const path of [
  "/",
  "/services",
  "/contact",
  "/ai-discovery",
  "/real-estate-ai",
  "/healthcare-ai",
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const csp = response.headers.get("content-security-policy") ?? "";
  assert.match(csp, /frame-ancestors 'none'/, path);
  assert.equal(csp.includes("'unsafe-eval'"), false, path);
  assert.equal(response.headers.get("x-frame-options"), "DENY", path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
  await response.arrayBuffer();
  checks++;
}
for (const path of [
  "/.env",
  "/.data/google-mail-oauth.json",
  "/.data/google-discovery-oauth.json",
  "/.git/config",
  "/lib/server/discovery-mail.ts",
  "/package.json",
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 404, path);
  await response.arrayBuffer();
  checks++;
}
for (const path of [
  "/api/contact",
  "/api/discovery",
  "/api/discovery/email-verification",
  "/api/discovery/pdf",
  "/api/discovery/email-report",
]) {
  const response = await fetch(base + path, {
    method: "POST",
    headers: {
      origin: "https://untrusted.example",
      "sec-fetch-site": "cross-site",
      "content-type": "application/json",
      "x-saavantus-contact": "1",
      "x-saavantus-discovery": "1",
    },
    body: "{}",
  });
  assert.equal(response.status, 403, path);
  await response.arrayBuffer();
  checks++;
}
for (const path of [
  "/api/sarvam/status?industry=real-estate",
  "/api/sarvam/not-a-session",
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 403, path);
  await response.arrayBuffer();
  checks++;
}
console.log(
  JSON.stringify({
    passed: checks,
    failed: 0,
    scope: base,
    externalSideEffects: false,
  }),
);
