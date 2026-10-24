/** One scheduler owns motion. Inactive time never advances the scene. */
export function createMotionClock(draw, request, cancel, interval = 0) {
  let active = false,
    disposed = false,
    frame = null,
    previous = null,
    lastDraw = null,
    elapsed = 0;
  function tick(now) {
    frame = null;
    if (!active || disposed) return;
    if (previous !== null)
      elapsed += Math.min(Math.max(now - previous, 0), 50) / 1000;
    previous = now;
    if (lastDraw === null || now - lastDraw + 0.0001 >= interval) {
      draw(elapsed);
      lastDraw =
        lastDraw === null || interval === 0
          ? now
          : lastDraw +
            Math.floor((now - lastDraw + 0.0001) / interval) * interval;
    }
    if (active && !disposed) frame = request(tick);
  }
  function setActive(value) {
    if (disposed || value === active) return;
    active = value;
    previous = null;
    lastDraw = null;
    if (frame !== null) cancel(frame);
    frame = active ? request(tick) : null;
  }
  return {
    setActive,
    setInterval(value) {
      interval = Math.max(0, value);
      lastDraw = null;
    },
    dispose() {
      setActive(false);
      disposed = true;
    },
  };
}
