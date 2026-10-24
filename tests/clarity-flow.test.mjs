import test from "node:test";
import assert from "node:assert/strict";
import { signalPoint } from "../lib/clarity-flow.mjs";
test("signals converge at the final lens and stay finite throughout motion", () => {
  for (const t of [0, 3, 12, 120])
    for (let i = 0; i < 72; i++) {
      for (const x of [-9, -4.4, 0, 4.4, 8])
        assert.ok(signalPoint(x, i, t, 0, 0).every(Number.isFinite));
      const p = signalPoint(4.4, i, t, 0, 0);
      assert.ok(Math.abs(p[1] - 1.05) < 0.04);
      assert.ok(Math.abs(p[2]) < 0.04);
    }
});
test("strands themselves move over time and mouse response is bounded", () => {
  const a = signalPoint(-5, 9, 0, 0, 0),
    b = signalPoint(-5, 9, 2, 0, 0);
  assert.ok(Math.hypot(a[1] - b[1], a[2] - b[2]) > 0.01);
  const c = signalPoint(-5, 9, 2, -0.65, 0.8);
  assert.ok(Math.hypot(c[1] - b[1], c[2] - b[2]) > 0.01);
  assert.ok(Math.hypot(c[1] - b[1], c[2] - b[2]) < 0.3);
});
