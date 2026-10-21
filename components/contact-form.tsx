"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/marketing";

type Errors = Record<string, string>;
export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [receipt, setReceipt] = useState("");
  const requestId = useRef("");
  const sending = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) errorSummary.current?.focus();
  }, [error, errors]);
  useEffect(() => {
    if (receipt) success.current?.focus();
  }, [receipt]);
  useEffect(() => () => abort.current?.abort(), []);
  const field = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const note = (name: string) =>
    errors[name] ? (
      <span className="contact-field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    setErrors({});
    const form = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    const values = Object.fromEntries(form.entries());
    abort.current = new AbortController();
    const timeout = setTimeout(() => abort.current?.abort(), 15000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Saavantus-Contact": "1",
        },
        signal: abort.current.signal,
        body: JSON.stringify({
          ...values,
          requestId: requestId.current,
          consent: form.get("consent") === "on",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.fields ?? {});
        setError(
          data.error ?? "We could not save this request. Please try again.",
        );
      } else if (data.saved && data.receiptId) setReceipt(data.receiptId);
      else
        setError(
          "We could not confirm that your request was saved. Please try again.",
        );
    } catch {
      setError(
        "The local server did not respond. Your details are still here. Check that the preview is running, then try again.",
      );
    } finally {
      clearTimeout(timeout);
      sending.current = false;
      setBusy(false);
      abort.current = null;
    }
  }
  if (receipt)
    return (
      <div
        className="contact-success"
        ref={success}
        tabIndex={-1}
        role="status"
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="m12 22 7 7 13-14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <h2>Saved to the local preview.</h2>
        <p>
          Your enquiry is stored privately on this computer for the owner to
          review. It has not been emailed or sent to GoHighLevel.
        </p>
        <p>
          If you chose a callback time, it is a preference only. No appointment
          has been booked.
        </p>
        <p className="contact-receipt">
          Reference <span>{receipt}</span>
        </p>
        <button
          className="button secondary"
          onClick={() => {
            setReceipt("");
            requestId.current = "";
            setError("");
            setErrors({});
          }}
        >
          Create another enquiry
        </button>
      </div>
    );
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      noValidate
      aria-busy={busy}
    >
      <h2 className="contact-form-title">Your enquiry</h2>
      <div className="contact-preview-note">
        <strong>Local preview</strong>
        <p>
          Submissions are saved on this computer only. No email or CRM delivery
          is connected yet. Use fictional details while testing.
        </p>
      </div>
      {error && (
        <div
          className="contact-error-summary"
          ref={errorSummary}
          tabIndex={-1}
          role="alert"
        >
          <strong>{error}</strong>
          {errors.form && <p>{errors.form}</p>}
          {Object.keys(errors).filter(
            (name) => name !== "form" && name !== "website",
          ).length > 0 && (
            <p>
              Review the marked fields below. Your other details have been kept.
            </p>
          )}
        </div>
      )}
      <fieldset disabled={busy}>
        <legend className="sr-only">Your contact details and enquiry</legend>
        <div className="contact-fields">
          <label htmlFor="contact-name">
            Your name
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              {...field("name")}
            />
            {note("name")}
          </label>
          <label htmlFor="contact-company">
            Business name
            <input
              id="contact-company"
              name="company"
              autoComplete="organization"
              required
              maxLength={140}
              {...field("company")}
            />
            {note("company")}
          </label>
          <label htmlFor="contact-email">
            Work email
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              {...field("email")}
            />
            {note("email")}
          </label>
          <label htmlFor="contact-phone">
            <span>
              Phone <span className="contact-optional">Optional</span>
            </span>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={32}
              {...field("phone")}
            />
            {note("phone")}
          </label>
          <label htmlFor="contact-industry" className="contact-field-wide">
            Your industry
            <select
              id="contact-industry"
              name="industry"
              required
              defaultValue=""
              {...field("industry")}
            >
              <option value="" disabled>
                Select an industry
              </option>
              <option value="real-estate">Real estate</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Another industry</option>
            </select>
            {note("industry")}
          </label>
          <label htmlFor="contact-requirements" className="contact-field-wide">
            What should a better conversation do for your business?
            <span className="contact-help" id="requirements-help">
              Tell us about your enquiries, your team and the next step you want
              to improve. Do not include patient records or other sensitive
              information.
            </span>
            <textarea
              id="contact-requirements"
              name="requirements"
              rows={5}
              required
              maxLength={2000}
              {...field("requirements")}
              aria-describedby={`requirements-help${errors.requirements ? " requirements-error" : ""}`}
            />
            {note("requirements")}
          </label>
        </div>
        <div className="contact-callback">
          <h3>A good time to talk?</h3>
          <p>
            Optional. Choose a preferred callback time in India Standard Time
            (IST). This does not reserve an appointment.
          </p>
          <div className="contact-fields">
            <label htmlFor="contact-date">
              Preferred date
              <input
                id="contact-date"
                name="callbackDate"
                type="date"
                {...field("callbackDate")}
              />
              {note("callbackDate")}
            </label>
            <label htmlFor="contact-time">
              Preferred time · IST
              <input
                id="contact-time"
                name="callbackTime"
                type="time"
                {...field("callbackTime")}
              />
              {note("callbackTime")}
            </label>
          </div>
        </div>
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">
            Leave this field empty
            <input
              id="contact-website"
              name="website"
              autoComplete="off"
              tabIndex={-1}
            />
          </label>
        </div>
        <label className="contact-consent" htmlFor="contact-consent">
          <input
            id="contact-consent"
            type="checkbox"
            name="consent"
            required
            {...field("consent")}
          />
          <span>
            I agree that Saavantus may contact me about this enquiry using the
            details above.{" "}
            <Link href="/privacy">Read how this preview handles data.</Link>
          </span>
        </label>
        {note("consent")}
        <div className="contact-submit">
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Saving your enquiry…" : "Save enquiry to preview"}
            <Arrow />
          </button>
          <span>All fields are required unless marked optional.</span>
        </div>
      </fieldset>
    </form>
  );
}
