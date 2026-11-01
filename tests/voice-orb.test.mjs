import test from "node:test";
import assert from "node:assert/strict";
import { createOrbParticles, projectOrbParticles } from "../lib/voice-orb.ts";

test("particle ribbons form a bounded, deterministic 3D volume", () => {
  const particles = createOrbParticles();
  assert.deepEqual(particles, createOrbParticles());
  assert.ok(particles.length >= 1000 && particles.length <= 5000);
  for (const p of particles) {
    assert.ok([p.x, p.y, p.z, p.radius].every(Number.isFinite));
    assert.ok(Math.hypot(p.x, p.y, p.z) < 1.3);
    assert.ok(p.radius > 0);
  }
  for (const axis of ["x", "y", "z"])
    assert.ok(
      particles.some((p) => p[axis] < -0.7) &&
        particles.some((p) => p[axis] > 0.7),
    );
});

test("rotation and voice activity preserve finite, depth-sorted drawable particles", () => {
  const particles = createOrbParticles();
  const still = projectOrbParticles(particles, 0, 0);
  assert.deepEqual(still, projectOrbParticles(particles, 0, 0));
  for (const [time, activity] of [
    [5, 0],
    [5, 1],
    [100000, 1],
  ]) {
    const frame = projectOrbParticles(particles, time, activity);
    assert.equal(frame.length, particles.length);
    assert.notDeepEqual(frame, still);
    for (let i = 0; i < frame.length; i++) {
      const p = frame[i];
      assert.ok([p.x, p.y, p.depth, p.radius].every(Number.isFinite));
      assert.ok(Math.abs(p.x) < 1.8 && Math.abs(p.y) < 1.8 && p.radius > 0);
      if (i) assert.ok(frame[i - 1].depth <= p.depth);
    }
  }
});
