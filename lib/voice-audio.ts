import type { BrowserAudioInterface } from "sarvam-conv-ai-sdk/browser";

export async function startVoiceAudio(
  audio: Pick<BrowserAudioInterface, "start" | "stop">,
  callback: Parameters<BrowserAudioInterface["start"]>[0],
  isCurrent: () => boolean,
) {
  try {
    await audio.start(callback);
  } finally {
    // Permission may resolve after the SDK's first stop already closed its context.
    if (!isCurrent()) await audio.stop();
  }
}
