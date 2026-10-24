"use client";
import { useEffect, useRef, useState } from "react";
import { DiscoveryVisualReport } from "@/components/discovery-visual-report";
import {
  ReportEmailButton,
  DownloadReportButton,
} from "@/components/discovery-email-controls";
import { DiscoveryProfileForm } from "@/components/discovery-profile-form";
import {
  emptyProfile,
  type OrganizationProfile,
} from "@/lib/discovery-profile";
import { assess, dimensions, practices, type Answers } from "@/lib/discovery";
const choices = [
  { value: 1, label: "1 · Not in place" },
  { value: 2, label: "2 · Early steps" },
  { value: 3, label: "3 · Partly established" },
  { value: 4, label: "4 · Mostly established" },
  { value: 5, label: "5 · Fully established" },
  { value: "unknown", label: "Not sure" },
] as const;
export function AIDiscovery() {
  const [profile, setProfile] = useState<OrganizationProfile>({
    ...emptyProfile,
  });
  const [profileOpen, setProfileOpen] = useState(true);
  const [ready, setReady] = useState<boolean | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "pending" | "saved" | "failed" | "unavailable"
  >("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const requestId = useRef<string | null>(null);
  const saveGeneration = useRef(0);
  const saving = useRef(false);
  useEffect(() => {
    let active = true;
    fetch("/api/discovery", {
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    })
      .then(async (response) => {
        const data = await response.json();
        if (active) setReady(response.ok && data.ready === true);
      })
      .catch(() => {
        if (active) setReady(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) heading.current?.focus();
    else started.current = true;
  }, [step, show, profileOpen]);
  const resetSubmission = () => {
    saveGeneration.current += 1;
    saving.current = false;
    requestId.current = null;
    setSaveState("idle");
    setSaveMessage("");
  };
  const saveAssessment = async () => {
    if (saving.current) return;
    const generation = saveGeneration.current;
    saving.current = true;
    setSaveState("pending");
    setSaveMessage(
      "Checking the connection and saving your completed assessment…",
    );
    try {
      const check = await fetch("/api/discovery", {
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      });
      const connection = await check.json();
      if (generation !== saveGeneration.current) return;
      if (!check.ok || connection.ready !== true) {
        setReady(false);
        setSaveState("unavailable");
        setSaveMessage(
          "Saving is unavailable. No save has been confirmed. Keep this page open to retain your responses.",
        );
        return;
      }
      setReady(true);
      if (!profile.dataConsent) {
        setSaveState("failed");
        setSaveMessage(
          "Data processing consent is required before saving. Review your organization profile.",
        );
        return;
      }
      requestId.current ??= crypto.randomUUID();
      const response = await fetch("/api/discovery", {
        signal: AbortSignal.timeout(30000),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Saavantus-Discovery": "1",
        },
        body: JSON.stringify({
          requestId: requestId.current,
          profile,
          answers,
        }),
      });
      const data = await response.json();
      if (generation !== saveGeneration.current) return;
      if (
        (response.status === 200 || response.status === 201) &&
        data.saved === true &&
        typeof data.receiptId === "string"
      ) {
        setSaveState("saved");
        setSaveMessage(
          `Assessment saved to Saavantus Excellence’s connected Google Sheet. Receipt: ${data.receiptId}`,
        );
      } else {
        setSaveState("failed");
        setSaveMessage(
          typeof data.error === "string"
            ? `Saving was not confirmed: ${data.error}`
            : "The server did not confirm saving. Your assessment has not been marked as saved.",
        );
      }
    } catch {
      if (generation === saveGeneration.current) {
        setSaveState("failed");
        setSaveMessage(
          "Saving could not be confirmed. Keep this page open and retry; the same submission reference will be used.",
        );
      }
    } finally {
      if (generation === saveGeneration.current) saving.current = false;
    }
  };
  const result = assess(answers);
  const current = dimensions[step];
  const count = Object.keys(answers).length;
  const advance = () => {
    const missing = current.questions.findIndex(
      (_, i) => answers[`${current.name}-${i}`] === undefined,
    );
    if (missing !== -1) {
      setError(
        "Choose a response for every statement in this dimension. Select Not sure when you cannot assess it.",
      );
      document.getElementById(`discovery-question-${missing}`)?.focus();
      return;
    }
    setError("");
    if (step < 7) setStep(step + 1);
    else {
      setShow(true);
      void saveAssessment();
    }
  };
  const priority = result.ranked.slice(0, 3);
  const names = (predicate: (score: number) => boolean) =>
    result.dimensions
      .filter((d) => d.score !== null && predicate(d.score))
      .map((d) => d.name)
      .join(", ");
  const governance = result.dimensions.find((d) => d.name === "Governance")!;
  return (
    <div className="discovery container">
      <nav className="discovery-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">AI Discovery</span>
      </nav>
      <header className="discovery-intro">
        <p className="discovery-brand">Saavantus Excellence</p>
        <h1>Discover your AI potential.</h1>
        <p>Understand your starting point and choose practical next steps.</p>
        <p className="discovery-note">
          A transparent self-assessment, not a certification or AI-generated
          analysis. Complete an organization profile first. When saving is
          available and you consent, completing the assessment sends your
          profile and responses to Saavantus Excellence’s connected Google
          Sheet. Otherwise, they remain on this page only. Refreshing or leaving
          clears this page’s copy.
        </p>
      </header>
      <ol className="discovery-journey" aria-label="Assessment stages">
        {["Organization profile", "Your assessment", "Your visual report"].map(
          (label, index) => {
            const active = profileOpen ? 0 : show ? 2 : 1;
            return (
              <li
                key={label}
                data-state={
                  index === active
                    ? "current"
                    : index < active
                      ? "complete"
                      : "pending"
                }
                aria-current={index === active ? "step" : undefined}
              >
                <span>{index + 1}</span>
                {label}
              </li>
            );
          },
        )}
      </ol>
      {profileOpen ? (
        <DiscoveryProfileForm
          profile={profile}
          onChange={setProfile}
          ready={ready}
          onContinue={() => setProfileOpen(false)}
        />
      ) : !show ? (
        <section className="discovery-form" aria-labelledby="discovery-step">
          <div className="discovery-step-head">
            <h2 id="discovery-step" ref={heading} tabIndex={-1}>
              {step + 1} of 8 · {current.name}
            </h2>
            <span>{count}/40 answered</span>
          </div>
          <progress aria-label="Statements answered" value={count} max={40} />
          <p>
            Rate each statement from 1 (not in place) to 5 (fully established).
            Not sure is a separate response and is excluded from scoring.
          </p>
          <p className="discovery-note">
            Known responses: {result.known}/40. You can return to any completed
            dimension to review your answers.
          </p>
          <button
            className="discovery-edit-profile"
            disabled={saveState === "pending"}
            onClick={() => {
              resetSubmission();
              setProfileOpen(true);
            }}
          >
            Edit organization profile
          </button>
          {error && (
            <p id="discovery-error" role="alert" className="discovery-error">
              {error}
            </p>
          )}
          {current.questions.map((q, i) => (
            <fieldset
              key={`${current.name}-${i}`}
              aria-describedby={error ? "discovery-error" : undefined}
            >
              <legend id={`discovery-question-${i}`} tabIndex={-1}>
                {step * 5 + i + 1}. {q}
              </legend>
              <div className="discovery-choices">
                {choices.map((c) => (
                  <label key={c.value}>
                    <input
                      type="radio"
                      name={`${current.name}-${i}`}
                      value={c.value}
                      checked={answers[`${current.name}-${i}`] === c.value}
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [`${current.name}-${i}`]: c.value,
                        }))
                      }
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="discovery-actions">
            <button
              className="button secondary"
              disabled={step === 0}
              onClick={() => {
                setError("");
                setStep(step - 1);
              }}
            >
              Previous
            </button>
            <button className="button" onClick={advance}>
              {step === 7 ? "View assessment" : "Next dimension"}
            </button>
          </div>
        </section>
      ) : (
        <div className="discovery-results">
          <img
            className="discovery-print-watermark"
            src="/saavantus-excellence-warm-charcoal.png"
            alt=""
            aria-hidden="true"
          />
          <div className="discovery-report-tools">
            <DownloadReportButton profile={profile} answers={answers} />
            <button className="button secondary" onClick={() => window.print()}>
              Print / save PDF
            </button>
            <ReportEmailButton profile={profile} answers={answers} />
          </div>
          <h2 ref={heading} tabIndex={-1}>
            {profile.organization} · AI discovery assessment
          </h2>
          <section
            className={`discovery-save-status discovery-save-${saveState}`}
            aria-label="Assessment saving"
          >
            <p role="status" aria-live="polite">
              {saveMessage || "Your completed assessment has not been saved."}
            </p>
            {(saveState === "failed" || saveState === "unavailable") && (
              <button
                className="button secondary"
                onClick={() => void saveAssessment()}
              >
                Retry saving
              </button>
            )}
            <p className="discovery-note">
              {saveState === "saved"
                ? "The saved record is held by Saavantus Excellence. Editing creates a new submission; it does not update the saved record."
                : "Results are available here even if saving fails. Refreshing or leaving clears this page’s profile and answers."}
            </p>
          </section>
          <p>
            {result.known}/40 known responses · {40 - result.known} marked Not
            sure. Findings reflect your self-ratings, with incomplete evidence
            wherever coverage is limited.
          </p>
          <DiscoveryVisualReport result={result} profile={profile} />
          <details className="discovery-method">
            <summary>How your assessment is calculated</summary>
            <p>
              Each known response becomes 0, 25, 50, 75 or 100 for answers 1–5.
              A dimension averages its known responses; Not sure is excluded.
              Each readiness dimension has a fixed 1/6 weight: Strategy, Data,
              Technology, People, Governance and ROI. Automation and AI adoption
              each have a fixed 1/2 weight in the adoption score.
            </p>
            <p>
              A group score is reported only when every dimension has at least
              one known response. Otherwise, the partial estimate averages
              available dimensions and is labelled separately; it is not the
              full fixed-weight score. Even a full group score can have low
              response coverage. Foundational is below 40%; Developing is 40% to
              below 70%; Established is 70% or above. Classification uses
              unrounded dimension scores; displayed percentages are rounded.
            </p>
          </details>
          <section>
            <h2>Your SWOT analysis</h2>
            <div className="discovery-swot">
              {[
                [
                  "Strengths",
                  names((s) => s >= 70) ||
                    "No known dimension meets the 70% strength threshold.",
                ],
                [
                  "Weaknesses",
                  names((s) => s < 40) ||
                    "No known dimension falls below the 40% foundational threshold.",
                ],
                [
                  "Opportunities",
                  priority.length
                    ? `Review ${priority
                        .slice(0, 2)
                        .map((d) => d.name)
                        .join(
                          " and ",
                        )} first: these are your lowest known self-ratings, not a proven business case.`
                    : "Gather evidence and complete the unknown responses before ranking improvement opportunities.",
                ],
                [
                  "Threats",
                  governance.score === null
                    ? "Governance is unknown. Review privacy, fairness and accountability before selecting a pilot."
                    : governance.score < 70
                      ? "Governance self-ratings suggest gaps to review in privacy, fairness and accountability before scaling."
                      : "Maintain oversight as usage scales; strong self-ratings do not eliminate risk.",
                ],
              ].map(([title, body]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <p className="discovery-note">
              Unknown dimensions are never classified as strengths or
              weaknesses. SWOT statements are rule-based prompts for
              investigation.
            </p>
          </section>
          <section>
            <h2>Recommended tools and practices</h2>
            <p>
              Suggestions for your three lowest known dimensions. Ties follow
              questionnaire order. Evaluate security, privacy, integrations and
              cost before choosing a tool.
            </p>
            {priority.length ? (
              priority.map((d) => (
                <p className="discovery-practice" key={d.name}>
                  <strong>{d.name}: </strong>
                  {practices[d.name]}.
                </p>
              ))
            ) : (
              <p>
                Start with evidence gathering: ask dimension owners to review
                the statements and document what is in place.
              </p>
            )}
          </section>
          <section className="discovery-roadmap">
            <h2>30/60/90-day roadmap</h2>
            {[
              [
                "Days 1–30 · Establish the foundation",
                `Assign an owner ${priority[0] ? `for ${priority[0].name}` : "to gather missing assessment evidence"}, document the current baseline, review data permissions and select one low-risk use case.`,
              ],
              [
                "Days 31–60 · Pilot with oversight",
                `${priority[1] ? `Review ${priority[1].name} with its owner. ` : "Resolve unknown responses with the relevant owners. "}Train a small pilot team, define human review and track quality, cost and time saved weekly.`,
              ],
              [
                "Days 61–90 · Review before expanding",
                `${priority[2] ? `Review progress in ${priority[2].name}. ` : ""}Compare pilot outcomes against the baseline and expand only where measurable benefits and risk controls are demonstrated.`,
              ],
            ].map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
            <p className="discovery-note">
              A suggested sequence, not a delivery commitment. Validate
              priorities with your team.
            </p>
          </section>
          <div className="discovery-actions">
            <button
              className="button"
              disabled={saveState === "pending"}
              onClick={() => {
                resetSubmission();
                setStep(0);
                setShow(false);
              }}
            >
              Review answers
            </button>
            <button
              className="button secondary"
              disabled={saveState === "pending"}
              onClick={() => {
                resetSubmission();
                setShow(false);
                setProfileOpen(true);
              }}
            >
              Edit organization profile
            </button>
            <button
              className="button secondary"
              disabled={saveState === "pending"}
              onClick={() => {
                resetSubmission();
                setProfile({ ...emptyProfile });
                setProfileOpen(true);
                setAnswers({});
                setStep(0);
                setError("");
                setShow(false);
              }}
            >
              Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
