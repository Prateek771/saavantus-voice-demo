import test from "node:test";
import assert from "node:assert/strict";
import { BrowserAudioInterface } from "../node_modules/sarvam-conv-ai-sdk/dist/interfaces/browser.js";
import { startVoiceAudio } from "../lib/voice-audio.ts";

test("closing while microphone permission is pending releases a late stream even when SDK startup throws", async (t) => {
  const original = globalThis.AudioContext;
  t.after(() => {
    if (original) globalThis.AudioContext = original;
    else delete globalThis.AudioContext;
  });
  globalThis.AudioContext = class {
    createGain() {
      return { gain: { value: 0 }, connect() {}, disconnect() {} };
    }
    createMediaStreamSource() {
      return { disconnect() {} };
    }
    async close() {}
  };
  let release;
  let requested;
  const permission = new Promise((resolve) => {
    release = resolve;
  });
  const micRequested = new Promise((resolve) => {
    requested = resolve;
  });
  const audio = new BrowserAudioInterface();
  t.after(() => audio.stop());
  audio.armUnlockListeners = () => {};
  audio.tryResumeContext = async () => {};
  audio.setupInputWorklet = async () => {};
  audio.getMicStreamWithFallback = () => {
    requested();
    return permission;
  };
  let current = true;
  let trackStops = 0;
  const starting = startVoiceAudio(
    audio,
    () => {},
    () => current,
  ).catch((error) => error);
  await micRequested;
  current = false;
  await audio.stop();
  release({
    getTracks: () => [
      {
        stop() {
          trackStops++;
        },
      },
    ],
  });
  await starting;
  assert.equal(
    trackStops,
    1,
    "late microphone stream must be stopped without another user action",
  );
  assert.equal(audio.mediaStream, undefined);
});

test("a successful current session keeps its audio until explicitly stopped", async () => {
  let recording = false;
  const audio = {
    start: async () => {
      recording = true;
    },
    stop: async () => {
      recording = false;
    },
  };
  await startVoiceAudio(
    audio,
    () => {},
    () => true,
  );
  assert.equal(recording, true);
  await audio.stop();
  assert.equal(recording, false);
});
