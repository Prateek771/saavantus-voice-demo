"use client";
import { useState } from "react";
export function Brief() {
  const [industry, setIndustry] = useState("Real estate");
  const [language, setLanguage] = useState("English + Hindi");
  const [result, setResult] = useState(false);
  return (
    <div className="notice-box">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(true);
        }}
      >
        <div className="brief-fields">
          <label>
            Your industry
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setResult(false);
              }}
            >
              <option>Real estate</option>
              <option>Healthcare</option>
            </select>
          </label>
          <label>
            Voice languages
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setResult(false);
              }}
            >
              <option>English + Hindi</option>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </label>
        </div>
        <button className="button" type="submit">
          Prepare local brief
        </button>
      </form>
      {result && (
        <div className="brief-result" role="status">
          <h2>Your sample brief</h2>
          <p>
            <strong>{industry}</strong> · {language}
          </p>
          <p>
            {industry === "Real estate"
              ? "Capture property intent and preferences, prepare a consultant handoff and offer appointments from an approved calendar."
              : "Answer approved clinic questions, collect administrative appointment preferences and route requests to reception."}
          </p>
          <p>
            Planned systems: Sarvam voice, n8n workflows, GoHighLevel CRM and
            calendars. All disconnected.
          </p>
          <small>Prepared in this page only. Nothing sent.</small>
        </div>
      )}
    </div>
  );
}
