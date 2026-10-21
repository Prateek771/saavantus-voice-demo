/**
 * Narrow local fixes for the inspected sarvam-conv-ai-sdk 0.0.42 distribution.
 * No network requests. Refuse changed upstream sources instead of guessing.
 * Run after install; optional --root PATH supports testing a temporary package.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.length && !(args.length === 2 && args[0] === "--root")) {
  throw new Error("Usage: node scripts/patch-sarvam-sdk.mjs [--root SDK_DIRECTORY]");
}
const root = args.length ? resolve(args[1]) : resolve(appRoot, "node_modules/sarvam-conv-ai-sdk");
const metadata = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
if (metadata.name !== "sarvam-conv-ai-sdk" || metadata.version !== "0.0.42") {
  throw new Error("Sarvam patch requires exactly sarvam-conv-ai-sdk 0.0.42. Review before upgrading.");
}
const sha = (text) => createHash("sha256").update(text).digest("hex");
function replace(source, before, after, count = 1) {
  if (source.split(before).length - 1 !== count) {
    throw new Error("Sarvam patch source mismatch; no files were written.");
  }
  return source.split(before).join(after);
}
const marker = "// Saavantus audited SDK patch v2\n";
const previousMarker = "// Saavantus audited SDK patch v1\n";
const transforms = [
  {
    path: "dist/modules/socket-manager.js",
    original: "b2ab183347193322c0a7413fdd9aa3974d288922712c9dc65433fc00ae62a987",
    previous: "494fa4465f0d2be68b0279ebd96e597046c24cf846a65ba6c501bbcc747f0c3f",
    transform(source) {
      // Every console statement in this pinned file is one line. Do not leak
      // signed URLs, identifiers, raw transcripts or provider error objects.
      source = source.replace(/^\s*console\.(?:log|warn|error)\([^\n]*\);\n/gm, "");
      source = replace(source, "    shouldStop = false;", "    shouldStop = false;\n    flushInterval;\n    endNotified = false;\n    audioReady = false;\n    interactionAcknowledged = false;\n    readinessNotified = false;");
      source = replace(source, "    async start() {", "    async start() {\n        this.audioReady = false;\n        this.interactionAcknowledged = false;\n        this.readinessNotified = false;");
      source = replace(source, "        return !this.isWsClosed();", "        return !this.shouldStop && this.ws?.readyState === 1 && this.audioReady && this.interactionAcknowledged;");
      source = replace(source, "        this.reference_id = referenceId;", "        if (this.shouldStop) return;\n        this.reference_id = referenceId;");
      source = replace(source, "        this.runWebSocketLoop(wsUrl);", `        void this.runWebSocketLoop(wsUrl).catch(async () => {
            if (this.shouldStop) return;
            this.sessionEndInitiator = "error";
            this.setState(AgentState.ERROR);
            await this.stop();
        }).catch(() => { /* Cleanup failure must not become an unhandled rejection. */ });`);
      const stopStart = source.indexOf("    async stop() {");
      const stopEnd = source.indexOf("    /**\n     * Hook for subclasses to perform cleanup on stop", stopStart);
      if (stopStart < 0 || stopEnd < 0) throw new Error("Sarvam stop method mismatch");
      source = source.slice(0, stopStart) + `    clearFlushInterval() {
        if (this.flushInterval !== undefined) clearInterval(this.flushInterval);
        this.flushInterval = undefined;
    }
    async stop() {
        // Mark before awaits: callbacks may call stop again.
        if (this.shouldStop) return;
        this.shouldStop = true;
        this.audioReady = false;
        this.interactionAcknowledged = false;
        if (!this.sessionEndInitiator) this.sessionEndInitiator = "user";
        this.stopNetworkMonitoring();
        this.clearFlushInterval();
        try {
            await this.onStop();
        } finally {
            if (!this.isWsClosed() && this.ws) this.ws.close();
            this.disconnectedEvent?.resolve();
            this.setState(AgentState.IDLE);
            if (!this.endNotified) {
                this.endNotified = true;
                if (this.endCallback) await this.endCallback();
            }
        }
    }
` + source.slice(stopEnd);
      source = replace(source, "                        await this.sendInteractionStart();", "                        if (this.shouldStop) { ws.close(); return; }\n                        await this.sendInteractionStart();", 2);
      source = replace(source, "                        await this.onWebSocketOpen();", `                        await this.onWebSocketOpen();
                        // Stop may have happened while microphone permission was pending.
                        if (this.shouldStop) {
                            await this.onStop();
                            ws.close();
                            return;
                        }
                        this.audioReady = true;
                        this.notifyReady();`, 2);
      source = replace(source, "                        setInterval(() => this.flushSendQueue(), 100);", "                        this.clearFlushInterval();\n                        this.flushInterval = setInterval(() => this.flushSendQueue(), 100);", 2);
      source = replace(source, `                    this.sessionEndInitiator = undefined;
                    this.ws = undefined;
                    this.shouldStop = true;
                    if (this.disconnectedEvent) {
                        this.disconnectedEvent.resolve();
                    }`, `                    this.ws = undefined;
                    this.clearFlushInterval();
                    void this.stop().catch(() => {}).finally(() => {
                        this.disconnectedEvent?.resolve();
                    });`, 2);
      source = replace(source, `        // Transition to IDLE state
        this.setState(AgentState.IDLE);
        if (this.endCallback) {
            await this.endCallback();
        }
    }
    /**
     * Handle ping`, `        await this.stop();
    }
    /**
     * Handle ping`);
      const ackStart = source.indexOf("    async handleInteractionStartAcknowledgement(event) {");
      const ackEnd = source.indexOf("    /**\n     * Handle interaction end message", ackStart);
      if (ackStart < 0 || ackEnd < 0) throw new Error("Sarvam acknowledgement method mismatch");
      source = source.slice(0, ackStart) + `    notifyReady() {
        if (!this.isConnected() || this.readinessNotified) return;
        this.readinessNotified = true;
        this.setState(AgentState.CONNECTED);
        this.setState(AgentState.LISTENING);
        this.connectedEvent?.resolve();
    }
    async handleInteractionStartAcknowledgement(event) {
        if (this.shouldStop) return;
        this.interactionId = event.interaction_id;
        this.interactionAcknowledged = true;
        this.emitTelemetry("interaction_connected", { interactionId: event.interaction_id });
        this.notifyReady();
    }
` + source.slice(ackEnd);
      return marker + source;
    },
  },
  {
    path: "dist/utils/message.js",
    original: "da9d78973da78e1eb14ecf1d75bcc7f16058edc7fdc2156e6ab389ad0b94c7c1",
    previous: "ae98e4c0ecf83b7a0e74d942fa7c7fc1bc36771292cdaef989068a5403fa340e",
    transform(source) {
      source = source.replace(/^\s*console\.(?:log|warn|error)\([^\n]*\);\n/gm, "");
      source = replace(source, "        case ServerMsgType.TEXT_CHUNK:", "        case ServerMsgType.TRANSCRIPTION:\n        case ServerMsgType.TEXT_CHUNK:");
      return marker + source;
    },
  },
];

// Store the original alongside patched output so re-running can recompute and
// verify the exact expected output, rather than trusting a marker alone.
const pending = [];
for (const entry of transforms) {
  const path = resolve(root, entry.path);
  const current = await readFile(path, "utf8");
  const backup = `${path}.saavantus-original`;
  const alreadyPatched = current.startsWith(marker) || current.startsWith(previousMarker);
  const original = alreadyPatched ? await readFile(backup, "utf8") : current;
  if (sha(original) !== entry.original) throw new Error(`Unrecognised SDK source: ${entry.path}`);
  const expected = entry.transform(original);
  if (current.startsWith(marker)) {
    if (current !== expected) throw new Error(`Modified SDK patch: ${entry.path}`);
  } else {
    if (alreadyPatched && sha(current) !== entry.previous) throw new Error(`Modified previous SDK patch: ${entry.path}`);
    pending.push({ path, backup, original, expected });
  }
}
// Validate every input before making any writes.
for (const entry of pending) {
  await writeFile(entry.backup, entry.original, "utf8");
  await writeFile(entry.path, entry.expected, "utf8");
}
console.log(`Sarvam SDK 0.0.42 patch verified (${pending.length} files updated).`);
