import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  transition,
  slots,
  resultRows,
  fieldOptions,
} from "../lib/demo.ts";
function review(industry = "real-estate") {
  let s = transition(initialState(industry), { type: "start" });
  for (let i = 0; i < 4; i++) s = transition(s, { type: "next" });
  return s;
}
test("booking requires review and an allowed slot", () => {
  const idle = initialState("real-estate");
  assert.deepEqual(transition(idle, { type: "book" }), idle);
  const s = review();
  assert.equal(s.phase, "review");
  assert.equal(transition(s, { type: "book" }).phase, "review");
  assert.equal(transition(s, { type: "slot", value: "invented" }).slot, null);
});
test("edited preferences reach a single simulated record and reset clears it", () => {
  let s = transition(review(), {
    type: "field",
    key: "location",
    value: "Indiranagar, Bengaluru",
  });
  s = transition(transition(s, { type: "slot", value: slots[0].id }), {
    type: "book",
  });
  assert.equal(s.phase, "complete");
  assert.equal(s.booking, "simulated");
  assert.ok(resultRows(s).some((row) => row[1] === "Indiranagar, Bengaluru"));
  assert.deepEqual(transition(s, { type: "book" }), s);
  assert.deepEqual(
    transition(s, { type: "reset" }),
    initialState("real-estate"),
  );
});
test("failure recovery preserves preferences and requires confirmation", () => {
  let s = transition(
    transition(review(), { type: "slot", value: slots[1].id }),
    { type: "fail" },
  );
  assert.equal(s.phase, "error");
  assert.equal(s.booking, "none");
  s = transition(s, { type: "retry" });
  assert.equal(s.phase, "review");
  assert.equal(s.slot, slots[1].id);
});
test("reschedule and cancellation affect only a simulated appointment", () => {
  let s = transition(
    transition(review(), { type: "slot", value: slots[0].id }),
    { type: "book" },
  );
  s = transition(s, { type: "reschedule" });
  assert.equal(s.phase, "review");
  assert.equal(s.slot, null);
  s = transition(transition(s, { type: "slot", value: slots[1].id }), {
    type: "book",
  });
  s = transition(s, { type: "cancel" });
  assert.equal(s.booking, "cancelled");
});
test("healthcare only accepts administrative fields", () => {
  const s = initialState("healthcare");
  assert.equal(
    transition(s, { type: "field", key: "symptoms", value: "private" }),
    s,
  );
  assert.equal(
    transition(s, { type: "field", key: "budget", value: "100" }),
    s,
  );
  assert.ok(resultRows(s).some((row) => row[0] === "Request"));
});
test("language is locked during walkthrough and ending never books", () => {
  let s = transition(initialState("healthcare"), {
    type: "language",
    value: "hi",
  });
  s = transition(s, { type: "start" });
  assert.equal(transition(s, { type: "language", value: "en" }).language, "hi");
  s = transition(s, { type: "end" });
  assert.equal(s.phase, "ended");
  assert.equal(s.booking, "none");
});
test("appointment-only clinic walkthrough offers appointment requests only", () => {
  assert.ok(
    !fieldOptions.healthcare.service.options.includes("Clinic information"),
  );
});
