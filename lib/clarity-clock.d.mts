export function createMotionClock(
  draw: (seconds: number) => void,
  request: (callback: FrameRequestCallback) => number,
  cancel: (id: number) => void,
  interval?: number,
): {
  setActive(value: boolean): void;
  setInterval(value: number): void;
  dispose(): void;
};
