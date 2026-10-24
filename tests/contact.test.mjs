import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { CONTACT_HEADERS } from "../lib/contact-sheet.ts";
import {
  validateContact,
  handleContactRequest,
  createContactLimiter,
} from "../lib/server/contact.ts";
const now = Date.parse("2026-10-21T08:00:00Z");
const sample = () => ({
  requestId: randomUUID(),
  name: "Demo Visitor",
  company: "Fictional Business",
  email: "demo@example.com",
  phone: "+91 90000 00000",
  industry: "real-estate",
  requirements: "A fictional enquiry flow for our property team.",
  callbackDate: "2026-10-22",
  callbackTime: "14:30",
  consent: true,
  website: "",
});
const headers = {
  host: "127.0.0.1:3100",
  origin: "http://127.0.0.1:3100",
  "sec-fetch-site": "same-origin",
  "content-type": "application/json",
  "x-saavantus-contact": "1",
};
const request = (payload, overrides = {}) =>
  new Request("http://127.0.0.1:3100/api/contact", {
    method: "POST",
    headers: { ...headers, ...overrides },
    body: JSON.stringify(payload),
  });
test("contact validation requires consent and validates bounded fields", () => {
  assert.equal(validateContact(sample(), now).ok, true);
  for (const change of [
    { consent: false },
    { email: "invalid" },
    { phone: "123" },
    { name: " " },
    { requirements: "x".repeat(2001) },
    { industry: "medical-diagnosis" },
    { website: "spam" },
    { unexpected: "not-allowed" },
  ])
    assert.equal(validateContact({ ...sample(), ...change }, now).ok, false);
});
test("callback preferences require a valid future IST date and time together", () => {
  for (const change of [
    { callbackDate: "2026-02-30" },
    { callbackTime: "" },
    { callbackDate: "2026-10-20" },
    { callbackTime: "26:00" },
    { callbackDate: "2028-10-22" },
  ])
    assert.equal(validateContact({ ...sample(), ...change }, now).ok, false);
  const valid = validateContact(sample(), now);
  assert.equal(valid.value.callbackRequestedAt, "2026-10-22T09:00:00.000Z");
  assert.equal(valid.value.callbackTimezone, "Asia/Kolkata");
  assert.equal(
    validateContact({ ...sample(), callbackDate: "", callbackTime: "" }, now)
      .ok,
    true,
  );
});
test("local intake persists once, returns the same receipt on retry and rejects changed retry", async () => {
  const storePath = await mkdtemp(join(tmpdir(), "saavantus-contact-"));
  const options = { storePath, now: () => now, admit: () => true, googleSave: async (requestId) => ({receiptId:requestId}) };
  const payload = sample();
  try {
    const responses = await Promise.all([
      handleContactRequest(request(payload), options),
      handleContactRequest(request(payload), options),
    ]);
    assert.deepEqual(responses.map((r) => r.status).sort(), [200, 201]);
    const a = await responses[0].json(),
      b = await responses[1].json();
    assert.equal(a.receiptId, b.receiptId);
    assert.equal(a.deliveryStatus, "google-sheets");
    const files = await readdir(storePath);
    assert.equal(files.length, 1);
    const saved = JSON.parse(await readFile(join(storePath, files[0]), "utf8"));
    assert.equal(saved.email, "demo@example.com");
    assert.equal(saved.deliveryStatus, "local-only");
    assert.equal(saved.appointmentStatus, "requested-not-booked");
    assert.equal(saved.source, "website-contact");
    assert.equal(
      (
        await handleContactRequest(
          request({ ...payload, company: "Changed" }),
          options,
        )
      ).status,
      409,
    );
  } finally {
    await rm(storePath, { recursive: true, force: true });
  }
});
test("intake rejects external origins, wrong media type, oversized and malformed requests without saving", async () => {
  const storePath = await mkdtemp(join(tmpdir(), "saavantus-contact-"));
  const options = { storePath, now: () => now, admit: () => true };
  try {
    assert.equal(
      (
        await handleContactRequest(
          request(sample(), { origin: "https://external.example" }),
          options,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await handleContactRequest(
          request(sample(), { "content-type": "text/plain" }),
          options,
        )
      ).status,
      415,
    );
    assert.equal(
      (
        await handleContactRequest(
          request({ ...sample(), requirements: "a".repeat(20000) }),
          options,
        )
      ).status,
      413,
    );
    assert.equal(
      (
        await handleContactRequest(
          new Request("http://127.0.0.1:3100/api/contact", {
            method: "POST",
            headers,
            body: "{broken",
          }),
          options,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await handleContactRequest(
          request({ ...sample(), consent: false }),
          options,
        )
      ).status,
      422,
    );
    assert.equal((await readdir(storePath)).length, 0);
  } finally {
    await rm(storePath, { recursive: true, force: true });
  }
});
test("contact rate limit is bounded and expires", () => {
  const admit = createContactLimiter(2, 1000);
  assert.equal(admit(1), true);
  assert.equal(admit(2), true);
  assert.equal(admit(3), false);
  assert.equal(admit(1002), true);
});

test("contact Sheets mapping and truthful failure preserve same-ID retries",async()=>{
  const storePath=await mkdtemp(join(tmpdir(),"contact-google-test-"));
  const rows=[];let fail=true;
  const options={storePath,now:()=>now,admit:()=>true,googleSave:async(id,hash,row)=>{rows.push({id,hash,row});if(fail)throw Error("private provider failure");return {receiptId:id};}};
  try {
    const payload=sample();
    const failed=await handleContactRequest(request(payload),options);
    assert.equal(failed.status,503);
    const failure=await failed.json();assert.equal(failure.saved,false);assert.equal(failure.localSaved,true);assert.equal(failure.deliveryStatus,"local-only");assert.equal(JSON.stringify(failure).includes("private provider"),false);
    fail=false;
    const retry=await handleContactRequest(request(payload),options);
    assert.equal(retry.status,200);assert.equal((await retry.json()).deliveryStatus,"google-sheets");
    assert.deepEqual(rows[0],rows[1]);assert.equal(rows[0].row.length,CONTACT_HEADERS.length);
    const stored=Object.fromEntries(CONTACT_HEADERS.map((key,i)=>[key,rows[1].row[i]]));
    for(const [column,field] of [["request_id","requestId"],["full_name","name"],["organization","company"],["email","email"],["phone","phone"],["industry","industry"],["requirements","requirements"]]) assert.equal(stored[column],payload[field]);
    assert.equal(stored.callback_requested_at_utc,"2026-10-22T09:00:00.000Z");assert.equal(stored.callback_timezone,"Asia/Kolkata");assert.equal(stored.contact_consent,true);assert.equal(stored.appointment_status,"requested-not-booked");
    assert.equal((await handleContactRequest(request({...payload,requirements:"Changed"}),options)).status,409);assert.equal(rows.length,2);
  }finally{await rm(storePath,{recursive:true,force:true});}
});
