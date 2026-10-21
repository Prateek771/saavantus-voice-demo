"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import {
  initialState,
  transition,
  resultRows,
  slots,
  script,
  fieldOptions,
  type Industry,
} from "@/lib/demo";
import { Icon, Waveform } from "./ui";
import "@/app/demo.css";

export function Demo({ industry }: { industry: Industry }) {
  const [state, dispatch] = useReducer(transition, industry, initialState);
  const [view, setView] = useState<"summary" | "workflow">("summary");
  const transcript = useRef<HTMLDivElement>(null);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const stageKey = `${state.phase}:${state.booking}`;
  const previousStage = useRef(stageKey);
  const [downloaded, setDownloaded] = useState(false);
  const isRE = industry === "real-estate";
  const hi = state.language === "hi";
  const selected = slots.find((slot) => slot.id === state.slot);
  const conversations = script(state);
  useEffect(() => {
    const el = transcript.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.step]);
  useEffect(() => {
    if (previousStage.current !== stageKey) {
      stageHeading.current?.focus();
      previousStage.current = stageKey;
    }
  }, [stageKey]);
  const send = (action: Parameters<typeof transition>[1]) => {
    setDownloaded(false);
    dispatch(action);
  };
  const statuses = {
    idle: "Ready when you are.",
    conversation: hi ? "नमूना बातचीत" : "Sample conversation",
    review: "Check the details. Choose a time.",
    complete:
      state.booking === "cancelled"
        ? "Sample appointment cancelled."
        : "Your sample handoff is ready.",
    ended: "Walkthrough ended.",
    error: "Let’s try that again.",
  };
  const bookingLabel =
    state.booking === "simulated"
      ? "Simulated appointment"
      : state.booking === "cancelled"
        ? "Cancelled · Simulation"
        : "Requested · Not booked";
  function download() {
    const payload = {
      mode: "local-simulation",
      industry,
      language: state.language,
      fields: state.fields,
      appointment: selected
        ? { ...selected, status: state.booking, timeZone: "Asia/Kolkata" }
        : null,
      crmSaved: false,
      realAppointmentBooked: false,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `saavantus-${industry}-sample.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return (
    <section
      id="demo"
      className="demo-section container"
      aria-label={
        isRE ? "Real estate workflow demo" : "Healthcare workflow demo"
      }
    >
      <div className="demo-intro">
        <span className="eyebrow">THE INTERACTIVE WALKTHROUGH</span>
        <span className="local-chip">
          <span className="status-dot" />
          Local simulation · No microphone
        </span>
      </div>
      <div className="demo-grid">
        <div className="conversation-panel">
          <div className="demo-panel-heading">
            <h2
              ref={stageHeading}
              tabIndex={-1}
              aria-describedby={`${industry}-stage-status`}
            >
              {isRE ? "Try the property agent" : "Try the receptionist"}
            </h2>
            <div className="language-picker" aria-label="Script language">
              <button
                aria-pressed={!hi}
                disabled={state.phase !== "idle"}
                onClick={() => send({ type: "language", value: "en" })}
              >
                English
              </button>
              <button
                lang="hi"
                aria-pressed={hi}
                disabled={state.phase !== "idle"}
                onClick={() => send({ type: "language", value: "hi" })}
              >
                हिन्दी
              </button>
            </div>
          </div>
          <p id={`${industry}-stage-status`} className="sr-only">
            {statuses[state.phase]}
          </p>
          <p className="demo-kicker">
            {isRE ? "FICTIONAL PROPERTY ENQUIRY" : "FICTIONAL CLINIC ENQUIRY"}
          </p>
          {state.phase === "idle" && (
            <>
              <Waveform />
              <div className="demo-welcome">
                <h3>{statuses.idle}</h3>
                <p>
                  Explore a scripted conversation, then see the details your
                  team would receive.
                </p>
                <button
                  className="button start-button"
                  onClick={() => send({ type: "start" })}
                >
                  <Icon name="play" />
                  Start walkthrough
                </button>
                <p className="tiny">
                  {hi
                    ? "Hindi script · English interface"
                    : "About 1 minute · No audio or sign-in required"}
                </p>
              </div>
              <details className="scenario-editor">
                <summary>Customise the sample scenario</summary>
                <div className="field-grid">
                  {Object.entries(fieldOptions[industry]).map(
                    ([key, field]) => (
                      <label key={key}>
                        {field.label}
                        <select
                          value={state.fields[key]}
                          onChange={(e) =>
                            send({ type: "field", key, value: e.target.value })
                          }
                        >
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    ),
                  )}
                </div>
              </details>
            </>
          )}
          {state.phase === "conversation" && (
            <>
              <div className="conversation-progress">
                <span>Conversation · {state.step + 1} of 4</span>
                <button
                  className="quiet-button"
                  onClick={() => send({ type: "end" })}
                >
                  End walkthrough
                </button>
              </div>
              <div className="step-track" aria-hidden="true">
                {[0, 1, 2, 3].map((n) => (
                  <i key={n} className={state.step >= n ? "done" : ""} />
                ))}
              </div>
              <div
                className="transcript"
                ref={transcript}
                aria-live="polite"
                aria-relevant="additions"
                lang={hi ? "hi" : "en"}
              >
                {conversations.slice(0, state.step + 1).map((line, i) => (
                  <div className="exchange" key={i}>
                    <div className="bubble agent">
                      <span>Saavantus · Scripted</span>
                      <p>{line.agent}</p>
                    </div>
                    <div className="bubble visitor">
                      <span>Sample visitor</span>
                      <p>{line.visitor}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="button full-width"
                onClick={() => send({ type: "next" })}
              >
                {state.step === 3 ? "Review sample details" : "Next exchange"}
                <Icon />
              </button>
            </>
          )}
          {state.phase === "review" && (
            <div className="review-stage">
              <h3>{statuses.review}</h3>
              <p>
                These fields are fictional. You can change them before creating
                a sample result.
              </p>
              <div className="field-grid">
                {Object.entries(fieldOptions[industry]).map(([key, field]) => (
                  <label key={key}>
                    {field.label}
                    <select
                      value={state.fields[key]}
                      onChange={(e) =>
                        send({ type: "field", key, value: e.target.value })
                      }
                    >
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <fieldset className="slot-picker">
                <legend>
                  Sample {isRE ? "consultant" : "appointment"} times · IST
                </legend>
                <p className="tiny">
                  Fixed fictional dates, not live availability.
                </p>
                <div>
                  {slots.map((slot) => (
                    <label
                      className={
                        slot.id === state.slot ? "slot selected" : "slot"
                      }
                      key={slot.id}
                    >
                      <input
                        type="radio"
                        aria-label={`${slot.label}, ${slot.time} IST`}
                        name={`${industry}-slot`}
                        value={slot.id}
                        checked={slot.id === state.slot}
                        onChange={() => send({ type: "slot", value: slot.id })}
                      />
                      <span>
                        {slot.label}
                        <strong>{slot.time}</strong>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button
                className="button full-width"
                disabled={!selected}
                onClick={() => send({ type: "book" })}
              >
                Create sample appointment <Icon name="calendar" />
              </button>
              <p className="tiny">
                {selected
                  ? `${selected.label} · ${selected.time} IST. This creates no real booking.`
                  : "Select a sample time to continue."}
              </p>
              <details className="failure-case">
                <summary>Explore an unavailable-service state</summary>
                <p>
                  This only changes the local screen. No service is contacted.
                </p>
                <button
                  className="button secondary"
                  onClick={() => send({ type: "fail" })}
                >
                  Simulate an error
                </button>
              </details>
            </div>
          )}
          {state.phase === "error" && (
            <div className="outcome-state" role="alert">
              <div className="outcome-icon">
                <Icon name="reset" size={32} />
              </div>
              <h3>{statuses.error}</h3>
              <p>
                Example failure: availability could not be checked. Your sample
                details are still here. Nothing has been saved or booked.
              </p>
              <button
                className="button"
                onClick={() => send({ type: "retry" })}
              >
                Return to review <Icon name="arrow" />
              </button>
              <button
                className="quiet-button"
                onClick={() => send({ type: "reset" })}
              >
                Start over
              </button>
            </div>
          )}
          {state.phase === "ended" && (
            <div className="outcome-state">
              <Icon name="chat" size={36} />
              <h3>{statuses.ended}</h3>
              <p>
                No record was saved and no appointment was created. Start again
                to explore the full workflow.
              </p>
              <button
                className="button"
                onClick={() => send({ type: "reset" })}
              >
                Try again <Icon name="reset" />
              </button>
            </div>
          )}
          {state.phase === "complete" && (
            <div className="outcome-state">
              <div className="outcome-icon">
                <Icon
                  name={state.booking === "cancelled" ? "calendar" : "check"}
                  size={32}
                />
              </div>
              <span className="eyebrow">WALKTHROUGH COMPLETE</span>
              <h3>{statuses.complete}</h3>
              <p>
                {state.booking === "cancelled"
                  ? "The local example is marked cancelled. Your real calendar is unchanged."
                  : "You’ve seen the journey from enquiry to a structured handoff. This is a simulation; no CRM contact or real appointment exists."}
              </p>
              {selected && (
                <div className="appointment-receipt">
                  <Icon name="calendar" />
                  <div>
                    <strong>{selected.label}</strong>
                    <span>{selected.time} · India time (UTC+05:30)</span>
                    <small>{bookingLabel}</small>
                  </div>
                </div>
              )}
              <div className="outcome-actions">
                <button className="button" onClick={download}>
                  <Icon name="file" />
                  Download sample JSON
                </button>
                {state.booking === "simulated" && (
                  <>
                    <button
                      className="button secondary"
                      onClick={() => send({ type: "reschedule" })}
                    >
                      Change sample time
                    </button>
                    <button
                      className="quiet-button"
                      onClick={() => send({ type: "cancel" })}
                    >
                      Cancel sample appointment
                    </button>
                  </>
                )}
                <button
                  className="quiet-button"
                  onClick={() => send({ type: "reset" })}
                >
                  Reset walkthrough <Icon name="reset" size={15} />
                </button>
              </div>
              <p role="status" className="tiny">
                {downloaded
                  ? "Sample exported to your device. Nothing was sent to a CRM."
                  : ""}
              </p>
            </div>
          )}
          <div className="demo-disclosure">
            <Icon name="shield" size={16} />
            <p>
              Use made-up details.{" "}
              {isRE
                ? "No real viewing is booked."
                : "No real appointment or medical advice. Do not share medical information."}{" "}
              <Link href="/privacy">How this preview uses data</Link>
            </p>
          </div>
        </div>
        <aside className="result-panel" aria-label="Sample result">
          <div className="result-top">
            <span className="eyebrow">
              {state.phase === "idle"
                ? "SAMPLE RESULT"
                : "YOUR LOCAL DEMO RESULT"}
            </span>
            <span className="record-mark">S / {isRE ? "RE" : "HC"}</span>
          </div>
          <h2>
            {isRE ? "What your team receives" : "What reception receives"}
          </h2>
          <div className="result-switch" aria-label="Result view">
            <button
              aria-pressed={view === "summary"}
              onClick={() => setView("summary")}
            >
              Record preview
            </button>
            <button
              aria-pressed={view === "workflow"}
              onClick={() => setView("workflow")}
            >
              Workflow
            </button>
          </div>
          {view === "summary" ? (
            <>
              <dl className="result-table">
                {resultRows(state).map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="result-appointment">
                <Icon name="calendar" />
                <div>
                  <span>
                    {selected
                      ? `${selected.label} · ${selected.time} IST`
                      : "Appointment preference"}
                  </span>
                  <strong>
                    {selected
                      ? bookingLabel
                      : "Choose a sample time during the walkthrough"}
                  </strong>
                </div>
              </div>
              <div className="neutral-badge">
                <span className="neutral-dot" />
                {bookingLabel}
              </div>
            </>
          ) : (
            <ol className="workflow-list">
              {[
                [
                  "Conversation",
                  state.phase === "idle"
                    ? "Waiting for you to start"
                    : "Scripted sample exchanges",
                ],
                [
                  "Capture the essentials",
                  state.phase === "idle"
                    ? "Previewing fictional preferences"
                    : "Sample preferences collected",
                ],
                [
                  isRE ? "Contact + enquiry" : "Reception request",
                  "GoHighLevel-shaped preview only",
                ],
                [
                  "Appointment",
                  selected ? bookingLabel : "Waiting for a sample selection",
                ],
              ].map(([label, value], i) => (
                <li key={label}>
                  <span className="workflow-number">{i + 1}</span>
                  <div>
                    <strong>{label}</strong>
                    <p>{value}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="integration-status">
            <div>
              <strong>GoHighLevel</strong>
              <span>Disconnected</span>
            </div>
            <p>No contact, opportunity or calendar event has been saved.</p>
            <div className="provider-status">
              <span>
                Sarvam <b>Off</b>
              </span>
              <span>
                n8n <b>Off</b>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
