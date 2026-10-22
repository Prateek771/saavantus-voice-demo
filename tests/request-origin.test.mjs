import test from "node:test";
import assert from "node:assert/strict";
import { sameOriginRequest } from "../lib/server/request-origin.mjs";

test("temporary preview grants only its exact HTTPS host and same origin", () => {
  const origin = "https://preview.example";
  const headers = (host, value) => new Headers({host, ...(value ? {origin: value} : {})});
  assert.equal(sameOriginRequest(headers("preview.example", origin), true, origin), true);
  assert.equal(sameOriginRequest(headers("preview.example"), false, origin), true);
  assert.equal(sameOriginRequest(headers("preview.example"), true, origin), false);
  for (const value of ["http://preview.example", "https://evil.example", "null"])
    assert.equal(sameOriginRequest(headers("preview.example", value), false, origin), false);
  for (const host of ["evil.example", "preview.example.evil.example"])
    assert.equal(sameOriginRequest(headers(host, origin), true, origin), false);
  for (const config of ["", "http://preview.example", `${origin}/path`, "https://user:pass@preview.example", "invalid"])
    assert.equal(sameOriginRequest(headers("preview.example", origin), true, config), false);
  assert.equal(sameOriginRequest(headers("127.0.0.1:3100", "http://127.0.0.1:3100"), true, ""), true);
});
