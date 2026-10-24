import type { CSSProperties } from "react";
import { assess, level } from "@/lib/discovery";
import type { OrganizationProfile } from "@/lib/discovery-profile";
import "@/app/ai-discovery/visual-report.css";

type Result = ReturnType<typeof assess>;
type Group = Result["readiness"];
function ScoreRing({
  label,
  group,
  description,
}: {
  label: string;
  group: Group;
  description: string;
}) {
  const score = group.score;
  return (
    <article className="discovery-report-score">
      <div className="discovery-report-ring" aria-hidden="true">
        <svg viewBox="0 0 160 160" focusable="false">
          <circle
            className="discovery-report-ring-track"
            cx="80"
            cy="80"
            r="66"
          />
          {score !== null && (
            <circle
              className="discovery-report-ring-value"
              cx="80"
              cy="80"
              r="66"
              pathLength="100"
              strokeDasharray={`${score} 100`}
              transform="rotate(-90 80 80)"
            />
          )}
        </svg>
        <span className={score === null ? "discovery-report-ring-empty" : ""}>
          {score === null ? "—" : Math.round(score)}
          {score !== null && <small>%</small>}
        </span>
      </div>
      <div className="discovery-report-score-copy">
        <h3>{label}</h3>
        <p className="discovery-report-level">{level(score)}</p>
        <p>
          {score === null
            ? "Full score unavailable"
            : `${Math.round(score)}% overall score`}{" "}
          · {group.known}/{group.questions} known responses
        </p>
        <p className="discovery-report-caption">{description}</p>
        {score === null && group.partial !== null && (
          <p className="discovery-report-caption">
            Partial estimate: {Math.round(group.partial)}% across{" "}
            {group.dimensions}/{group.total} dimensions. This is not the full
            fixed-weight score.
          </p>
        )}
      </div>
    </article>
  );
}
export function DiscoveryVisualReport({
  result,
  profile,
}: {
  result: Result;
  profile: OrganizationProfile;
}) {
  const hasCounts =
    profile.applicableWorkflows !== "" && profile.aiProductionWorkflows !== "";
  const total = Number(profile.applicableWorkflows);
  const production = Number(profile.aiProductionWorkflows);
  const workflowPercent =
    hasCounts &&
    Number.isFinite(total) &&
    Number.isFinite(production) &&
    total > 0 &&
    production >= 0 &&
    production <= total
      ? (production / total) * 100
      : null;
  return (
    <section className="discovery-report" aria-label="Assessment visual report">
      <div className="discovery-report-overview">
        <ScoreRing
          label="AI readiness"
          group={result.readiness}
          description="Strategy, Data, Technology, People, Governance and ROI."
        />
        <ScoreRing
          label="AI adoption"
          group={result.adoption}
          description="Automation and the use of AI in daily work."
        />
      </div>
      <section
        className="discovery-report-comparison"
        aria-labelledby="discovery-comparison-heading"
      >
        <div className="discovery-report-section-head">
          <div>
            <h2 id="discovery-comparison-heading">Where you stand.</h2>
          </div>
          <p>
            Self-ratings on a 0–100 scale.
            <br />
            Coverage shows the evidence behind each score.
          </p>
        </div>
        <div className="discovery-report-axis" aria-hidden="true">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="discovery-report-bars">
          {result.dimensions.map((dimension, index) => (
            <div className="discovery-report-bar-row" key={dimension.name}>
              <div className="discovery-report-bar-label">
                <h3>{dimension.name}</h3>
                <span>{dimension.known}/5 known</span>
              </div>
              <div
                className={`discovery-report-bar-track ${dimension.score === null ? "is-unknown" : ""}`}
                aria-hidden="true"
              >
                {dimension.score !== null && (
                  <span
                    className="discovery-report-bar-fill"
                    style={
                      {
                        "--score-fraction": dimension.score / 100,
                        "--bar-delay": `${index * 45}ms`,
                      } as CSSProperties
                    }
                  />
                )}
              </div>
              <div className="discovery-report-bar-result">
                <strong>
                  {dimension.score === null
                    ? "—"
                    : `${Math.round(dimension.score)}%`}
                </strong>
                <span>{level(dimension.score)}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="discovery-report-caption">
          An empty patterned track means insufficient data. A known score of 0%
          means the capability is rated not in place. Displayed values are
          rounded; classifications use unrounded scores.
        </p>
      </section>
      <div className="discovery-report-context">
        <section
          className="discovery-report-coverage"
          aria-labelledby="discovery-coverage-heading"
        >
          <p className="discovery-report-eyebrow">Response coverage</p>
          <h2 id="discovery-coverage-heading">
            <span>{result.known}</span>
            <small> / 40 known</small>
          </h2>
          <p>
            {40 - result.known} responses marked Not sure. More known responses
            provide a more complete picture.
          </p>
          <div className="discovery-report-coverage-grid" aria-hidden="true">
            {result.dimensions.map((d) => (
              <div key={d.name}>
                {d.questions.map((_, i) => (
                  <span key={i} className={i < d.known ? "is-known" : ""} />
                ))}
              </div>
            ))}
          </div>
          <div className="discovery-report-legend">
            <span>
              <i className="is-known" /> Known response
            </span>
            <span>
              <i /> Not sure
            </span>
          </div>
          <p className="discovery-report-caption">
            Each column represents one dimension; each mark represents one
            response. Marks are grouped by known status, not question order.
          </p>
        </section>
        <section
          className="discovery-report-workflows"
          aria-labelledby="discovery-workflows-heading"
        >
          <p className="discovery-report-eyebrow">Organization context</p>
          <h2 id="discovery-workflows-heading">AI in production.</h2>
          {workflowPercent !== null ? (
            <>
              <p className="discovery-report-workflow-number">
                {Math.round(workflowPercent)}
                <small>%</small>
              </p>
              <p>
                {production.toLocaleString()} of {total.toLocaleString()}{" "}
                applicable workflows use AI in production.
              </p>
              <div
                className="discovery-report-workflow-track"
                aria-hidden="true"
              >
                <span
                  style={
                    {
                      "--score-fraction": workflowPercent / 100,
                    } as CSSProperties
                  }
                />
              </div>
            </>
          ) : (
            <>
              <p className="discovery-report-workflow-empty">
                {hasCounts && total === 0
                  ? "No applicable workflows reported."
                  : "Workflow coverage not available."}
              </p>
              <p>
                {hasCounts && total === 0
                  ? "A percentage cannot be calculated with zero applicable workflows."
                  : "Provide both workflow counts in your organization profile to see the share using AI in production."}
              </p>
            </>
          )}
          <p className="discovery-report-caption">
            Self-reported organization context. This percentage is separate from
            your assessment scores and does not affect them.
          </p>
        </section>
      </div>
      <details className="discovery-report-data">
        <summary>View assessment data as a table</summary>
        <div className="discovery-report-table-wrap">
          <table>
            <caption>Dimension scores and known response coverage</caption>
            <thead>
              <tr>
                <th scope="col">Dimension</th>
                <th scope="col">Score</th>
                <th scope="col">Classification</th>
                <th scope="col">Known responses</th>
              </tr>
            </thead>
            <tbody>
              {result.dimensions.map((d) => (
                <tr key={d.name}>
                  <th scope="row">{d.name}</th>
                  <td>
                    {d.score === null
                      ? "Not available"
                      : `${Math.round(d.score)}%`}
                  </td>
                  <td>{level(d.score)}</td>
                  <td>{d.known} of 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
