import test from "node:test";
import assert from "node:assert/strict";
import { createMotionClock } from "../lib/clarity-clock.mjs";

test("pause, visibility and resume keep one loop without a time jump", () => {
  let next = 0;
  const pending = new Map();
  const frames = [];
  const clock = createMotionClock(
    (t) => frames.push(t),
    (cb) => {
      pending.set(++next, cb);
      return next;
    },
    (id) => pending.delete(id),
    0,
  );
  const step = (t) => {
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach((cb) => cb(t));
  };
  clock.setActive(true);
  clock.setActive(true);
  assert.equal(pending.size, 1);
  step(100);
  step(132);
  assert.equal(frames.at(-1), 0.032);
  clock.setActive(false);
  assert.equal(pending.size, 0);
  clock.setActive(true);
  step(10000);
  assert.equal(frames.at(-1), 0.032);
  step(10032);
  assert.equal(frames.at(-1), 0.064);
  clock.dispose();
  assert.equal(pending.size, 0);
  clock.setActive(true);
  assert.equal(pending.size, 0);
});

test("large frame gaps are bounded and mobile frames are throttled", () => {
  let callback;
  const frames = [];
  const clock = createMotionClock(
    (t) => frames.push(t),
    (cb) => {
      callback = cb;
      return 1;
    },
    () => {},
    33,
  );
  clock.setActive(true);
  callback(0);
  callback(16);
  assert.equal(frames.length, 1);
  callback(34);
  assert.equal(frames.length, 2);
  callback(10000);
  assert.ok(frames.at(-1) < 0.1);
  clock.dispose();
});

test("30fps cadence keeps its fractional remainder on a 60Hz display", () => {
  let callback;
  let draws = 0;
  const clock = createMotionClock(
    () => draws++,
    (cb) => {
      callback = cb;
      return 1;
    },
    () => {},
    1000 / 30,
  );
  clock.setActive(true);
  for (let i = 0; i <= 600; i++) callback((i * 1000) / 60);
  assert.ok(draws >= 300 && draws <= 302, `expected ~301 frames, got ${draws}`);
  clock.dispose();
});

test("desktop is capped at 60fps and resize changes the cap without another loop", () => {
  let callback;
  let draws = 0;
  const clock = createMotionClock(
    () => draws++,
    (cb) => {
      callback = cb;
      return 1;
    },
    () => {},
    1000 / 60,
  );
  clock.setActive(true);
  for (let i = 0; i <= 120; i++) callback((i * 1000) / 120);
  assert.ok(draws >= 60 && draws <= 62);
  draws = 0;
  clock.setInterval(1000 / 30);
  for (let i = 121; i <= 240; i++) callback((i * 1000) / 120);
  assert.ok(draws >= 29 && draws <= 31);
  clock.dispose();
});
