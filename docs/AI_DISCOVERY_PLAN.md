# AI Discovery implementation brief

Approved scope: replace the homepage Our Approach / SaaS 4A Framework section with an invitation to a dedicated `/ai-discovery` page. Retain the warm ivory/coral theme, self-hosted fonts, particle hero and unrelated homepage sections. Use Saavantus Excellence in user-facing branding.

## Purpose and flow

Help visitors understand their self-reported AI readiness and adoption, identify priorities and review a practical 30/60/90-day roadmap. The homepage CTA is **Start AI Discovery**. The dedicated assessment contains 40 questions across Strategy, Data, Technology, Automation, AI adoption, People, Governance and ROI (five questions each).

## Interpretation and transparency

This is a transparent, rule-based self-assessment. It does not call an AI model, perform an independent audit, certify readiness or establish compliance. Scores and recommendations reflect the answers provided. Show the scoring method and distinguish readiness foundations from current adoption. Avoid suggesting measured business outcomes or guaranteed ROI.

Offer an explicit **Not sure** response for every question. Unknown answers indicate missing evidence, not a confirmed low capability or established strength. Report answer coverage and unknowns alongside results and direct visitors to validate gaps before making decisions. Preserve a useful, honest outcome when answers are partial or entirely unknown; do not present missing evidence as a definitive readiness score.

## Profile, consent and conditional persistence

The updated approved scope adds a mandatory organization profile: name, business email, organization, industry, organization size, job title and country. Phone number and workflow counts are optional. Required assessment-data consent and optional marketing consent must be distinct.

Show actual connection status before the visitor starts. Disconnected preview mode retains the profile and answers in page-session memory only and does not submit or persist them. Do not use browser storage for this draft. On connected completion, submit the profile, all 40 answers, calculated scores, coverage, consent choices and submission metadata through the app server to the owner's Google Sheet. Do not submit incomplete assessments or send the answers to an AI model. Contact intake remains a separate existing local-file flow.

Google OAuth application/client setup is pending. The authorized destination account is `mukesh.das@saavantus.com`; the chat-connected Google account is not the authorized destination. Do not claim readiness until the application connection is configured and verified. Keep credentials server-side and out of logs/source.

Confirm success only after a successful storage response. A failed or missing network response may leave persistence uncertain; do not tell the visitor that a record definitely was not saved. Clearing local state cannot delete an already-saved Sheet record. No automatic retention schedule is configured; questions and manual deletion requests go to the existing owner contact. Marketing is optional, and consent to assessment review/follow-up does not authorize marketing. No generated PDF or automatic email delivery system is included in the approved scope.

## Acceptance

- The complete framework section is replaced; its unused constants and styles are removed.
- The homepage links to `/ai-discovery` and describes the question count, dimensions, separate scores, priorities and roadmap.
- The assessment supports all 40 questions, revisiting answers, Not sure, understandable progress and accessible keyboard controls.
- Results explain scoring, coverage, self-report limitations, priorities and a rule-based roadmap without fabricated certainty.
- Meaningful type/build and browser checks cover complete, mixed and unknown answers; desktop/mobile review preserves the approved visual system. Integration verification belongs to the coordinating agent.

## Earlier local-only verification on 23 October 2026

These results predate the organization-profile and Google Sheets scope above. They do not verify the new persistence flow.

- Production build and TypeScript passed. Project test suite: 30/30 passed, including six discovery tests.
- Independent review caught premature group-score rounding; fixed with raw-score classification and regressions around 40 and 70 percent.
- Browser walkthrough: missing-answer validation, all eight steps, mixed unknown/known results, review preserving choices, all known results, restart clearing choices, all-unknown insufficient-data result and reload clearing state passed.
- Known midpoint scenario: readiness 50%, adoption 50%. Unknown Strategy scenario: readiness withheld with a separately labelled 50% partial estimate across five of six dimensions. All unknown: both scores withheld.
- Logo loaded in header/footer; desktop and mobile reviewed. No horizontal overflow at 1440, 820, 390 or 320 pixels. Mobile navigation and homepage assessment link worked.
- Homepage, discovery, Services, both agent pages and contact returned HTTP 200 with Saavantus Excellence titles. Browser console errors/warnings: none observed.
- Local preview: http://127.0.0.1:3100/ai-discovery. No CRM connection, public deployment or live voice call was performed during this change.
