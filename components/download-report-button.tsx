"use client";
import { useEffect, useRef, useState } from "react";
import type { OrganizationProfile } from "@/lib/discovery-profile";
import type { Answers } from "@/lib/discovery";

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
    <div className="discovery-report-download" aria-busy={busy}>
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
