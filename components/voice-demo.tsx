"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ConversationAgent,
  InteractionConfig,
} from "sarvam-conv-ai-sdk/browser";
import type { Industry } from "@/lib/demo";
import "@/app/demo.css";

type Setup = {
  ready: boolean;
  message?: string;
  maxSeconds?: number;
  config?: Pick<
    InteractionConfig,
    "org_id" | "workspace_id" | "app_id" | "version"
  >;
};
type Line = { role: string; content: string };
export function VoiceDemo({ industry }: { industry: Industry }) {
  const [setup, setSetup] = useState<Setup>();
  const [consent, setConsent] = useState(false);
  const [language, setLanguage] = useState<"English" | "Hindi">("English");
  const [status, setStatus] = useState("Checking voice setup…");
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState("");
  const agent = useRef<ConversationAgent | null>(null);
  const busy = useRef(false);
  const failure = useRef("");
  const audioReady = useRef(false);
  const generation = useRef(0);
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const end = useCallback(async (message = "Conversation ended.") => {
    generation.current++;
    busy.current = false;
    const current = agent.current;
    agent.current = null;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    audioReady.current = false;
    if (mounted.current) {
      setActive(false);
      setMuted(false);
      setStatus(failure.current ? "Voice session interrupted." : message);
      if (failure.current) setError(failure.current);
    }
    try {
      await current?.stop();
    } catch {
      /* UI already ended; SDK cleanup is idempotent. */
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    fetch(`/api/sarvam/status?industry=${industry}`, {
      headers: { "X-Saavantus-Demo": "1" },
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<Setup>;
      })
      .then((data) => {
        if (!mounted.current) return;
        setSetup(data);
        setStatus(data.ready ? "Ready to talk." : "Voice setup pending.");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setSetup({
            ready: false,
            message: "Could not check voice setup. Reload to try again.",
          });
          setStatus("Voice unavailable.");
        }
      });
    return () => {
      mounted.current = false;
      controller.abort();
      void end();
    };
  }, [industry, end]);
  useEffect(() => {
    transcript.current?.scrollTo({ top: transcript.current.scrollHeight });
  }, [lines]);
  async function start() {
    if (busy.current || !consent || !setup?.ready || !setup.config) return;
    busy.current = true;
    failure.current = "";
    audioReady.current = false;
    const attempt = ++generation.current;
    setActive(true);
    setError("");
    setLines([]);
    setStatus("Connecting…");
    try {
      const sdk = await import("sarvam-conv-ai-sdk/browser");
      if (attempt !== generation.current) return;
      const audio = new sdk.BrowserAudioInterface();
      const current = new sdk.ConversationAgent({
        apiKey: "",
        baseUrl: "/api/sarvam/",
        customHeaders: { "X-Saavantus-Demo": "1" },
        config: {
          ...setup.config,
          interaction_type: sdk.InteractionType.CALL,
          user_identifier: `demo-${crypto.randomUUID()}`,
          user_identifier_type: "custom",
          input_sample_rate: 16000,
          output_sample_rate: 16000,
          initial_language_name:
            language as InteractionConfig["initial_language_name"],
        },
        audioInterface: {
          start: async (callback) => {
            try {
              await audio.start(callback);
            } catch (reason) {
              if (attempt === generation.current) {
                const name = reason instanceof Error ? reason.name : "";
                failure.current =
                  name === "NotAllowedError"
                    ? "Microphone permission was denied. Allow it in your browser and try again."
                    : name === "NotFoundError"
                      ? "No microphone was found. Connect one and try again."
                      : "Microphone audio could not start. Check your browser permissions and audio device.";
                setError(failure.current);
              }
              throw reason;
            }
          },
          stop: () => audio.stop(),
          output: (data, rate) => audio.output(data, rate),
          interrupt: () => audio.interrupt(),
        },
        transcriptCallback: async (message) => {
          if (attempt === generation.current && mounted.current)
            setLines((previous) => [
              ...previous.slice(-99),
              {
                role: message.role === "user" ? "You" : "Agent",
                content: message.content,
              },
            ]);
        },
        stateCallback: (next) => {
          if (attempt === generation.current && mounted.current) {
            if (next === "error") {
              failure.current ||=
                "The voice connection was interrupted. End this session and try again.";
              setError(failure.current);
            }
            setStatus(
              failure.current
                ? "Voice session interrupted."
                : !audioReady.current
                  ? "Connecting audio…"
                  : next === "listening"
                    ? "Listening…"
                    : next === "speaking"
                      ? "Agent speaking…"
                      : next === "connected"
                        ? "Connected."
                        : "Conversation ended.",
            );
          }
        },
        endCallback: async () => {
          if (attempt === generation.current) await end();
        },
      });
      agent.current = current;
      timer.current = setTimeout(
        () => void end("Three-minute demo ended."),
        180000,
      );
      await current.start();
      if (attempt !== generation.current) {
        await current.stop();
        return;
      }
      if (!(await current.waitForConnect(15))) throw new Error("connect");
      if (attempt !== generation.current) {
        await current.stop();
        return;
      }
      audioReady.current = true;
      setStatus("Connected. You can speak now.");
      void current.waitForDisconnect().then(() => {
        if (attempt === generation.current)
          void end("Connection closed. Start a new conversation to try again.");
      });
    } catch (reason) {
      if (attempt !== generation.current) return;
      await end("Could not start voice.");
      const name = reason instanceof Error ? reason.name : "";
      setError(
        name === "NotAllowedError"
          ? "Microphone permission was denied. Allow it in your browser and try again."
          : name === "NotFoundError"
            ? "No microphone was found. Connect one and try again."
            : "The voice session could not connect. Check microphone access and the Sarvam workspace configuration, then try again.",
      );
    }
  }
  return (
    <section
      id="voice-demo"
      className="demo-section voice-demo-section container"
      aria-labelledby={`${industry}-voice-heading`}
    >
      <div className="demo-intro">
        <span className="demo-surface-label">Live voice demo</span>
        <span className="local-chip">
          {setup?.ready ? "Sarvam voice · Demo only" : "Awaiting Sarvam setup"}
        </span>
      </div>
      <div className="conversation-panel voice-panel">
        <h2 id={`${industry}-voice-heading`}>
          {industry === "real-estate"
            ? "Tell us what you’re looking for."
            : "Meet your clinic receptionist."}
        </h2>
        <p>
          Speak in English or Hindi. Use fictional details for this
          demonstration. CRM updates and real appointments are not connected.
        </p>
        <div className="voice-workspace">
          <div className="voice-setup">
            <label className="voice-language">
              Starting language{" "}
              <select
                value={language}
                disabled={active}
                onChange={(event) =>
                  setLanguage(event.target.value as "English" | "Hindi")
                }
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </label>
            <p className="voice-disclosure">
              When you start, your microphone audio is sent to Sarvam for AI
              processing. Sarvam may retain recordings and transcripts under
              your workspace settings. This page keeps the displayed transcript
              in memory only.
            </p>
            <label className="voice-consent">
              <input
                type="checkbox"
                checked={consent}
                disabled={active}
                onChange={(event) => setConsent(event.target.checked)}
              />{" "}
              I understand and want to start a voice demo using fictional
              information.
            </label>
            {!setup?.ready && setup?.message && (
              <p role="status">{setup.message}</p>
            )}
            <div className="voice-controls">
              <button
                className="button primary"
                disabled={!setup?.ready || !consent || active}
                onClick={() => void start()}
              >
                Start voice demo
              </button>
              <button
                className="button secondary"
                disabled={!active}
                onClick={() => void end()}
              >
                End conversation
              </button>
              <button
                className="button secondary"
                disabled={!active || !agent.current}
                aria-pressed={muted}
                onClick={() => {
                  const current = agent.current;
                  if (!current) return;
                  if (current.isMuted()) current.unmute();
                  else current.mute();
                  setMuted(current.isMuted());
                }}
              >
                {muted ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>
          <div className="voice-session">
            <div className="voice-session-heading">
              <span>Conversation transcript</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
              </svg>
            </div>
            <p className="voice-session-status" role="status">
              {muted ? "Microphone muted." : status}
            </p>
            {error && <p role="alert">{error}</p>}
            <div
              className="voice-transcript"
              ref={transcript}
              role="log"
              aria-live="polite"
              aria-label="Live voice transcript"
            >
              {lines.length ? (
                lines.map((line, index) => (
                  <p key={index}>
                    <strong>{line.role}:</strong> {line.content}
                  </p>
                ))
              ) : (
                <p>Your conversation transcript will appear here.</p>
              )}
            </div>
          </div>
        </div>
        <p className="voice-disclosure voice-session-limit">
          Up to three minutes per demo. No booking, CRM save or human transfer
          occurs. Healthcare demo: appointment administration only.
        </p>
      </div>
    </section>
  );
}
