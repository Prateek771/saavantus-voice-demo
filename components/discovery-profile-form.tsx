"use client";
import { useEffect, useRef, useState } from "react";
import { DiscoveryEmailVerification } from "@/components/discovery-email-controls";
import {
  INDUSTRIES,
  ORGANIZATION_SIZES,
  validateProfile,
  type OrganizationProfile,
} from "@/lib/discovery-profile";
export function DiscoveryProfileForm({
  profile,
  onChange,
  onContinue,
  ready,
}: {
  profile: OrganizationProfile;
  onChange: (profile: OrganizationProfile) => void;
  onContinue: () => void;
  ready: boolean | null;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const latestProfile = useRef(profile);
  latestProfile.current = profile;
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const normalizedEmail = profile.businessEmail.trim().toLowerCase();
  const currentEmail = useRef(normalizedEmail);
  currentEmail.current = normalizedEmail;
  useEffect(() => {
    setVerified(false);
  }, [normalizedEmail]);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const fields = [
    ["fullName", "Full name", "text", "name"],
    ["businessEmail", "Business email", "email", "email"],
    ["organization", "Organization", "text", "organization"],
    ["industry", "Industry", "select", ""],
    ["organizationSize", "Organization size", "select", ""],
    ["jobTitle", "Job title", "text", "organization-title"],
    ["country", "Country", "text", "country-name"],
    ["phone", "Phone (optional)", "tel", "tel"],
    ["applicableWorkflows", "Applicable workflows (optional)", "number", ""],
    [
      "aiProductionWorkflows",
      "AI workflows in production (optional)",
      "number",
      "",
    ],
  ] as const;
  return (
    <form
      className="discovery-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const validation = validateProfile(profile);
        if (!validation.ok) {
          setErrors(validation.errors);
          const first = Object.keys(validation.errors)[0];
          document.getElementById(`profile-${first}`)?.focus();
          return;
        }
        if (checking) return;
        const email = validation.value.businessEmail;
        setChecking(true);
        try {
          const response = await fetch(
            `/api/discovery/email-verification?email=${encodeURIComponent(email)}`,
            {
              cache: "no-store",
              headers: { "X-Saavantus-Discovery": "1" },
              signal: AbortSignal.timeout(15000),
            },
          );
          const status = await response.json();
          if (currentEmail.current !== email) return;
          if (!response.ok || status.verified !== true) {
            setVerified(false);
            setErrors({
              businessEmail: "Verify this business email before continuing.",
            });
            return;
          }
          const latest = validateProfile(latestProfile.current);
          if (!latest.ok) {
            setErrors(latest.errors);
            return;
          }
          setErrors({});
          onChange(latest.value);
          onContinue();
        } catch {
          setErrors({
            businessEmail:
              "Email verification could not be confirmed. Please try again.",
          });
        } finally {
          setChecking(false);
        }
      }}
    >
      <h2 ref={heading} tabIndex={-1}>
        Tell us about your organization
      </h2>
      <p>
        Complete your organization profile before the assessment. Required
        fields are marked with an asterisk.
      </p>
      <p className="discovery-note" role="status">
        {ready === null
          ? "Checking assessment saving availability…"
          : ready
            ? "Connected: when you complete the assessment, your profile and responses will be sent to Saavantus Excellence and saved in its connected Google Sheet."
            : "Saving is unavailable. You can still complete the assessment on this page, but your profile and responses will not be saved."}
      </p>
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="discovery-error">
          Please correct the highlighted profile fields.
        </p>
      )}
      <div className="discovery-profile-grid">
        {fields.map(([key, label, type, autoComplete]) => {
          const optional = [
            "phone",
            "applicableWorkflows",
            "aiProductionWorkflows",
          ].includes(key);
          const options = key === "industry" ? INDUSTRIES : ORGANIZATION_SIZES;
          return (
            <div className="discovery-profile-field" key={key}>
              <label htmlFor={`profile-${key}`}>
                {label}
                {!optional ? " *" : ""}
              </label>
              {type === "select" ? (
                <select
                  id={`profile-${key}`}
                  required
                  value={profile[key]}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={
                    errors[key] ? `profile-error-${key}` : undefined
                  }
                  onChange={(e) =>
                    onChange({ ...profile, [key]: e.target.value })
                  }
                >
                  <option value="">Choose {label.toLowerCase()}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`profile-${key}`}
                  type={type}
                  autoComplete={autoComplete || undefined}
                  required={!optional}
                  min={type === "number" ? 0 : undefined}
                  step={type === "number" ? 1 : undefined}
                  value={profile[key]}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={
                    errors[key] ? `profile-error-${key}` : undefined
                  }
                  onChange={(e) =>
                    onChange({ ...profile, [key]: e.target.value })
                  }
                />
              )}{" "}
              {errors[key] && (
                <p
                  id={`profile-error-${key}`}
                  className="discovery-field-error"
                >
                  {errors[key]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <DiscoveryEmailVerification
        email={profile.businessEmail}
        onVerifiedChange={setVerified}
      />
      <p className="discovery-note">
        Workflow counts are optional context. They do not change the assessment
        scores.
      </p>
      <div className="discovery-profile-consents">
        <label>
          <input
            id="profile-dataConsent"
            type="checkbox"
            required
            checked={profile.dataConsent}
            aria-invalid={Boolean(errors.dataConsent)}
            aria-describedby={
              errors.dataConsent ? "profile-error-dataConsent" : undefined
            }
            onChange={(e) =>
              onChange({ ...profile, dataConsent: e.target.checked })
            }
          />
          <span>
            I consent to Saavantus Excellence processing my organization profile
            and assessment responses, including saving them in its connected
            Google Sheet when saving is available. *
          </span>
        </label>
        {errors.dataConsent && (
          <p id="profile-error-dataConsent" className="discovery-field-error">
            {errors.dataConsent}
          </p>
        )}
        <label>
          <input
            type="checkbox"
            checked={profile.marketingConsent}
            onChange={(e) =>
              onChange({ ...profile, marketingConsent: e.target.checked })
            }
          />
          <span>
            I would like to receive marketing updates from Saavantus Excellence.
            (Optional)
          </span>
        </label>
      </div>
      <div className="discovery-actions">
        <button
          type="submit"
          className="button"
          disabled={!verified || checking}
        >
          {checking ? "Checking verification..." : "Continue to assessment"}
        </button>
      </div>
    </form>
  );
}
