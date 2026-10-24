"use client";
import { useEffect, useRef, useState } from "react";
import type { OrganizationProfile } from "@/lib/discovery-profile";
import type { Answers } from "@/lib/discovery";

const endpoint = "/api/discovery/email-verification";
export function DiscoveryEmailVerification({
  email,
  onVerifiedChange,
}: {
  email: string;
  onVerifiedChange: (verified: boolean) => void;
}) {
  const normalized = email.trim().toLowerCase();
  const current = useRef(normalized);
  current.current = normalized;
  const callback = useRef(onVerifiedChange);
  callback.current = onVerifiedChange;
  const generation = useRef(0);
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const token = ++generation.current;
    const controller = new AbortController();
    setReady(false);
    setVerified(false);
    setCode("");
    setSent(false);
    setBusy(false);
    callback.current(false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setMessage(
        "Enter your business email above to check verification availability.",
      );
      return () => controller.abort();
    }
    setMessage("Checking email verification availability...");
    fetch(`${endpoint}?email=${encodeURIComponent(normalized)}`, {
      cache: "no-store",
      headers: { "X-Saavantus-Discovery": "1" },
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
    })
      .then(async (response) => {
        const data = await response.json();
        if (token !== generation.current || current.current !== normalized)
          return;
        if (!response.ok) throw new Error();
        setReady(data.ready === true);
        setVerified(data.verified === true);
        callback.current(data.verified === true);
        setMessage(
          data.verified === true
            ? "This email is verified."
            : data.ready === true
              ? "Verify this address before continuing. A code is sent only when you request one."
              : "Email verification is unavailable. You cannot continue until the sender is configured.",
        );
      })
      .catch(() => {
        if (
          !controller.signal.aborted &&
          token === generation.current &&
          current.current === normalized
        )
          setMessage(
            "Could not check verification. Check your connection and try again.",
          );
      });
    return () => controller.abort();
  }, [normalized]);
  async function act(action: "send" | "verify") {
    if (busy) return;
    const target = normalized;
    const token = ++generation.current;
    setBusy(true);
    setMessage(
      action === "send"
        ? "Requesting a verification code..."
        : "Checking your code...",
    );
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(60000),
        headers: {
          "Content-Type": "application/json",
          "X-Saavantus-Discovery": "1",
        },
        body: JSON.stringify({
          action,
          email: target,
          ...(action === "verify" ? { code } : {}),
        }),
      });
      const data = await response.json();
      if (token !== generation.current || current.current !== target) return;
      if (!response.ok) {
        setMessage(
          data.error || "The request was not confirmed. Please try again.",
        );
        return;
      }
      if (action === "send") {
        setSent(data.sent === true);
        setMessage(
          data.sent === true
            ? "Verification code sent. Check your inbox and enter it below."
            : "Code delivery was not confirmed. No code has been automatically resent.",
        );
      } else {
        const check = await fetch(
          `${endpoint}?email=${encodeURIComponent(target)}`,
          {
            cache: "no-store",
            headers: { "X-Saavantus-Discovery": "1" },
            signal: AbortSignal.timeout(15000),
          },
        );
        const status = await check.json();
        if (token !== generation.current || current.current !== target) return;
        const confirmed = check.ok && status.verified === true;
        setVerified(confirmed);
        callback.current(confirmed);
        setMessage(
          confirmed
            ? "Email verified. You can continue after completing the profile."
            : "Verification is not confirmed. Check your code and try again.",
        );
      }
    } catch {
      if (token === generation.current && current.current === target)
        setMessage(
          "The request was not confirmed. Check your connection; no automatic retry was made.",
        );
    } finally {
      if (token === generation.current && current.current === target)
        setBusy(false);
    }
  }
  return (
    <section
      className="discovery-email-verification"
      aria-labelledby="email-verification-title"
      aria-busy={busy}
    >
      <h3 id="email-verification-title">Verify your business email</h3>
      <p className="discovery-note" role="status">
        {message}
      </p>
      {!verified && (
        <div className="discovery-email-actions">
          <button
            type="button"
            className="button secondary"
            disabled={!ready || busy}
            onClick={() => act("send")}
          >
            {sent ? "Resend code" : "Send verification code"}
          </button>
          <label htmlFor="discovery-email-code">
            Verification code
            <input
              id="discovery-email-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={12}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled={!ready || busy}
            />
          </label>
          <button
            type="button"
            className="button secondary"
            disabled={!ready || busy || !code.trim()}
            onClick={() => act("verify")}
          >
            Verify code
          </button>
        </div>
      )}
    </section>
  );
}

export function ReportEmailButton({
  profile,
  answers,
}: {
  profile: OrganizationProfile;
  answers: Answers;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  const current = useRef("");
  const fingerprint = JSON.stringify({ profile, answers });
  current.current = fingerprint;
  const sending = useRef(false);
  useEffect(() => {
    setSent(false);
    setMessage("");
  }, [fingerprint]);
  async function send() {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setMessage("Requesting report email...");
    const target = fingerprint;
    if (request.current?.fingerprint !== target)
      request.current = { fingerprint: target, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/discovery/email-report", {
        method: "POST",
        signal: AbortSignal.timeout(60000),
        headers: {
          "Content-Type": "application/json",
          "X-Saavantus-Discovery": "1",
        },
        body: JSON.stringify({
          profile,
          answers,
          requestId: request.current.id,
        }),
      });
      const data = await response.json();
      if (current.current !== target) return;
      if (response.ok && data.sent === true) {
        setSent(true);
        setMessage(`Report email sent to ${profile.businessEmail}.`);
      } else
        setMessage(
          data.error ||
            "Report email delivery is not confirmed. No automatic retry was made.",
        );
    } catch {
      if (current.current === target)
        setMessage(
          "Report email delivery is unconfirmed. Check your inbox before retrying; no automatic retry was made.",
        );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="discovery-report-email" aria-busy={busy}>
      <button
        type="button"
        className="button secondary"
        disabled={busy || sent}
        onClick={send}
      >
        {busy
          ? "Sending report..."
          : sent
            ? "Report email sent"
            : "Email my report"}
      </button>
      <p className="discovery-note">Destination: {profile.businessEmail}</p>
      {message && (
        <p className="discovery-note" role="status">
          {message}
        </p>
      )}
    </div>
  );
}

export function DownloadReportButton({
  profile,
  answers,
}: {
  profile: OrganizationProfile;
  answers: Answers;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const sending = useRef(false);
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  const fingerprint = JSON.stringify({ profile, answers });
  const current = useRef(fingerprint);
  current.current = fingerprint;
  useEffect(() => {
    setMessage("");
  }, [fingerprint]);
  async function download() {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setMessage("Preparing your PDF...");
    const target = fingerprint;
    if (request.current?.fingerprint !== target)
      request.current = { fingerprint: target, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/discovery/pdf", {
        method: "POST",
        signal: AbortSignal.timeout(60000),
        headers: {
          "Content-Type": "application/json",
          "X-Saavantus-Discovery": "1",
        },
        body: JSON.stringify({
          requestId: request.current.id,
          profile,
          answers,
        }),
      });
      if (
        !response.ok ||
        !response.headers.get("Content-Type")?.includes("application/pdf")
      ) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || "The PDF could not be prepared. Please try again.",
        );
      }
      const blob = await response.blob();
      if (current.current !== target) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Saavantus-Excellence-AI-Discovery.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("PDF download requested. Check your browser's downloads.");
    } catch (error) {
      if (current.current === target)
        setMessage(
          error instanceof Error && error.name !== "TimeoutError"
            ? error.message
            : "PDF preparation timed out. No automatic retry was made.",
        );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="discovery-report-email" aria-busy={busy}>
      <button
        type="button"
        className="button secondary"
        disabled={busy}
        onClick={download}
      >
        {busy ? "Preparing PDF..." : "Download PDF"}
      </button>
      {message && (
        <p className="discovery-note" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
