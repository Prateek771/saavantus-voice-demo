import test from "node:test";
import assert from "node:assert/strict";
import { dimensions, assess, level } from "../lib/discovery.ts";
const filled = (value) =>
  Object.fromEntries(
    dimensions.flatMap((d) =>
      d.questions.map((_, i) => [`${d.name}-${i}`, value]),
    ),
  );
test("exactly eight dimensions and forty statements", () => {
  assert.equal(dimensions.length, 8);
  assert.equal(
    dimensions.reduce((n, d) => n + d.questions.length, 0),
    40,
  );
});
test("scale extremes and midpoint normalize without changing weights", () => {
  for (const [answer, score] of [
    [1, 0],
    [3, 50],
    [5, 100],
  ]) {
    const result = assess(filled(answer));
    assert.equal(result.readiness.score, score);
    assert.equal(result.adoption.score, score);
    assert.equal(result.known, 40);
  }
});
test("unknown is excluded, zero is a real score, and missing data is explicit", () => {
  const result = assess({
    ...filled("unknown"),
    "Strategy-0": 1,
    "Strategy-1": 5,
  });
  assert.equal(result.dimensions[0].score, 50);
  assert.equal(result.dimensions[0].known, 2);
  assert.equal(result.readiness.score, null);
  assert.equal(result.readiness.partial, 50);
  assert.equal(result.adoption.score, null);
  assert.equal(result.adoption.partial, null);
  assert.equal(result.ranked.length, 1);
  assert.equal(assess(filled("unknown")).known, 0);
});
test("groups give each dimension equal fixed weight regardless of known answer count", () => {
  const answers = filled(1);
  for (let i = 0; i < 5; i++) answers[`Strategy-${i}`] = "unknown";
  answers["Strategy-0"] = 5;
  assert.equal(assess(answers).readiness.score, 100 / 6);
});
test("threshold boundaries use unrounded scores", () => {
  assert.equal(level(null), "Insufficient data");
  assert.equal(level(39.99), "Foundational");
  assert.equal(level(40), "Developing");
  assert.equal(level(69.99), "Developing");
  assert.equal(level(70), "Established");
});

test("group classification keeps values below 40 and 70 below their thresholds", () => {
  for (const [baseline, strategy, expected] of [
    [[2, 2, 3, 3, 3], [2, 3, "unknown", "unknown", "unknown"], "Foundational"],
    [[3, 4, 4, 4, 4], [3, 4, 4, 4, "unknown"], "Developing"],
  ]) {
    const answers = Object.fromEntries(
      dimensions.flatMap((d) =>
        (d.name === "Strategy" ? strategy : baseline).map((value, i) => [
          `${d.name}-${i}`,
          value,
        ]),
      ),
    );
    const score = assess(answers).readiness.score;
    assert.equal(level(score), expected);
    assert.ok(score < (expected === "Foundational" ? 40 : 70));
    assert.equal(Math.round(score), expected === "Foundational" ? 40 : 70);
  }
});
