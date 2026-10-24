const random = (n) => {
  const value = Math.sin(n * 127.1) * 43758.5453;
  return value - Math.floor(value);
};
const seeds = Array.from({ length: 72 }, (_, i) => [
  random(i + 1) * 2 - 1,
  random(i + 91) * 2 - 1,
  random(i + 211),
]);
/** Real moving paths in scene coordinates; optional output avoids frame allocations. */
export function signalPoint(
  x,
  index,
  time,
  hoverX = 0,
  hoverY = 0,
  out = [0, 0, 0],
) {
  const [a, b, phase] = seeds[index % 72];
  const envelope = Math.pow(Math.max(0, Math.min(1, (4.7 - x) / 13.7)), 1.6);
  const center =
    1.55 - (x + 4.4) * (0.5 / 8.8) + Math.pow(Math.max(0, x - 4.4), 1.7) * 0.11;
  const local = Math.exp(-Math.pow((x - hoverX * 8) / 2.1, 2)) * envelope;
  out[0] = x;
  out[1] =
    center +
    envelope *
      (a * 1.45 + Math.sin(x * 0.43 + phase * 6.28 - time * 0.38) * 0.17) +
    hoverY * 0.2 * local;
  out[2] =
    envelope *
      (b * 1.05 + Math.cos(x * 0.37 + phase * 6.28 - time * 0.31) * 0.14) +
    hoverX * 0.14 * local;
  return out;
}
