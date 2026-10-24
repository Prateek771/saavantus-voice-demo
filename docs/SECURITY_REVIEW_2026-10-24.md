# Saavantus Excellence security review — 24 October 2026

## Outcome and limits

Four implementation weaknesses and a browser-framing protection gap were fixed. Eight new security regression tests reproduce the relevant pre-fix behavior and pass after remediation. The complete suite passes 66/66 tests, and the production build passes.

**This is a bounded defensive review, not a completed Strix penetration test or a claim that the website cannot be hacked.** Strix 1.7.0 was invoked against a separate credential-free source snapshot with a Docker sandbox, full-tree scope, a reported-usage budget cap and connected MCP tools disabled. Its configured subscription model rejected the automated cybersecurity request before the first agent response. The recorded run `scan-source_3385` has `status: failed`, zero analyzed requests/tokens and reported cost $0. No clean Strix result exists, and no Strix retest is claimed. The restriction was not bypassed by switching providers or altering the prompt to evade it.

The failure record and the sanitized snapshot are under the original workspace's ignored `work/security-2026-10-24/` directory. Actual remediation verification below used direct source checks, synthetic dependency-injected tests, local HTTP checks and browser behavior.

## Scope

- Reviewed the local Next.js marketing app, Contact intake, Discovery assessment, email-code/session binding, report PDF/email handlers, Google Sheets persistence boundary, Sarvam session-signing boundary and security headers.
- Exercised handlers with synthetic data, temporary directories and mocked external providers. No live email, paid voice session, production spreadsheet write or destructive operation was performed during this review.
- Live HTTP checks were limited to the owner's `http://127.0.0.1:3100` app and early-rejection paths. Private runtime files and credentials were excluded from the Strix snapshot.
- Hostinger production, the old public website, infrastructure/WAF configuration, Google/Sarvam/n8n/GoHighLevel services, account security and Git history were not penetration-tested. No new public tunnel or deployment was created.

## Fixed implementation weaknesses

### 1. Forwarded-header rate-limit bypass — medium, verified in handler fixture

The assessment POST handler used caller-controlled `X-Forwarded-For` as its rate-limit key without a configured trusted proxy. A new address string obtained a fresh quota.

Before-fix check: after exhausting one bucket, changing only that header still reached validation (HTTP 400 rather than the intended 429). The final regression uses valid, verified synthetic assessments and proves that changing the header cannot reset the budget.

Fix: `lib/server/discovery-submission.ts:116` uses the existing preview's shared bucket and ignores caller-provided IP headers. The accepted-submission budget is ten verified assessments per minute per process. Public deployment needs trusted edge/client rate limiting; a shared preview bucket is not per-visitor protection.

### 2. PDF generation had no resource budget — medium, requires verified mailbox

The PDF route required correct mailbox proof but allowed unlimited repeated generation and concurrent work after verification. This could consume CPU and memory. No load flood was performed.

Before-fix checks: the eleventh synthetic request still generated a PDF, and three gated jobs could enter generation concurrently. The generator was mocked to count admission safely; these checks do not claim a measured production outage.

Fix: `lib/server/discovery-report-delivery.ts:94` permits at most two concurrent PDF jobs, ten requests per verified address per hour and sixty requests per process per hour. Rejected work returns 429 before generation. Capacity is released even when generation fails. Existing verified-recipient checks, email limits and duplicate-send receipts remain in force. Counters are bounded and process-local.

### 3. Public status requests amplified provider calls — medium, verified with mock providers

The Discovery readiness GET and email-verification status GET started a fresh provider readiness operation per request. Eight concurrent synthetic reads produced eight provider checks. In the real adapters those checks can perform Google authorization/API requests.

Fix: `lib/server/cached-check.ts:2` coalesces concurrent work and caches only a public readiness boolean for thirty seconds. `discovery-submission.ts` and `discovery-email-verification.ts` use it for GET status checks. Verification proof remains cookie/address-specific and is checked on every request. Sending mail and saving assessment records still use fresh authorization/destination checks. No identity, report content or verified status is cached across visitors.

### 4. Invalid input consumed legitimate submission quotas — medium, verified in synthetic fixtures

Contact intake consumed its shared acceptance budget before validating fields. The assessment handler consumed its budget before validating the profile and mailbox proof. Repeated invalid requests could lock out legitimate submissions.

Before-fix checks: with a two-entry contact fixture budget, a third empty request returned 429 rather than validation failure; unverified assessments also exhausted their acceptance bucket.

Fix: `lib/server/contact.ts:271` and `lib/server/discovery-submission.ts:170` charge the acceptance budget after validation, and after mailbox proof for assessments. Body-size and origin/media checks still precede parsing. Tests confirm invalid contacts and unverified assessments cannot consume that budget; valid requests remain limited. This addresses this specific quota-exhaustion path, not volumetric denial of service or all valid-looking spam.

## Browser hardening applied

- Added `Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY` in `next.config.ts` to prevent another origin embedding the app. A temporary page on localhost:3112 attempted to frame Contact on localhost:3100; the browser refused the frame after the fix. It was a controlled local check, not a demonstrated account compromise.
- Removed production `script-src 'unsafe-eval'`; retained it only for development tooling. This is defense in depth, not evidence of a previously demonstrated XSS vulnerability.
- Preserved the existing Google Maps frame allowlist. Normal homepage-to-Contact navigation, form display and embedded map loading were checked after hardening with no captured console errors.
- Inline-script permission remains for the current static Next.js rendering setup. A nonce/hash policy would require a separately designed rendering/CSP change; this review did not prove an injection path.

## Verification evidence

1. The original six security regression checks failed before their corresponding fixes; two later quota-exhaustion checks also failed before remediation. Final targeted result: 8/8 pass.
2. Complete automated suite: 66/66 pass, including OTP expiry/attempt limits and cookie/address binding, email recipient restrictions, duplicate/uncertain delivery, body limits, origin checks, spreadsheet RAW writes, PDF watermarks and Sarvam destination checks. Provider interactions are mocked in these tests.
3. `npm run build`: passes, including TypeScript compilation.
4. `node scripts/check-local-security.mjs`: 19 local HTTP checks pass. Six marketing pages return 200 with framing/no-eval/nosniff headers; six private paths return 404; five cross-site POST requests return 403; two untrusted Sarvam GET requests return 403. No external service mutation is exercised by this script.
5. Private paths checked: `/.env`, `/.data/google-mail-oauth.json`, `/.data/google-discovery-oauth.json`, `/.git/config`, `/lib/server/discovery-mail.ts`, `/package.json`. This does not substitute for Git-history or full secret scanning.
6. Browser proof of framing refusal is saved at `C:/Users/prate/Documents/Codex/saavantus-framing-protection-check.png`. Normal Contact form and Google Map remained available.
7. Compared known project API/OAuth secrets locally against 18 public JavaScript/JSON/HTML/map build files: zero matches. Server output-file traces contained zero `.data` or `.env` entries. Only counts were printed; no secret values were logged. This check is limited to known current secrets and is not a Git-history or general-purpose secret scan.

Reproduce locally with `npm test`, `npm run build`, start the app, then `node scripts/check-local-security.mjs`. The synthetic tests do not require real provider credentials.

## Dependency advisory still open

Both initial and final `npm audit --json` runs report two high-severity package entries but **one underlying advisory**: `speaker@0.5.5`, included as an optional native-audio dependency of `sarvam-conv-ai-sdk@0.0.42`. Advisory: https://github.com/advisories/GHSA-w5fc-gj3h-26rx. npm reports no automatic fix.

The website imports `sarvam-conv-ai-sdk/browser`, the vendor's browser-specific entry point. The native `speaker` package was absent from the inspected server output-file traces. Its exploitability through this website was not demonstrated. The dependency warning is still open; do not describe the dependency audit as clean. No provider replacement, suppressed audit result or unreviewed vendor fork was introduced. Keep native Node audio out of the deployment and review an upstream fix or browser-only distribution before introducing that adapter.

Final audit metadata is in the preview's ignored `work/security-final-dependencies.json`.

## Remaining release work

- A completed Strix assessment and Strix verification pass remain pending approved security-testing access for the configured model. Do not treat the failed run's zero findings as assurance.
- Before public hosting, configure HTTPS/TLS and hosting-layer request limits/bot protection; review HSTS for the actual public domain. Test that deployment separately. Shared preview quotas, file locks and in-memory budgets are not distributed/serverless safeguards. An attacker can still consume global budgets with valid-looking requests; external edge controls are needed for that threat.
- Review the native-audio advisory above. The browser integration currently avoids that adapter, but the installed dependency graph still contains it.
- Rotate the Google OAuth client secret previously pasted into chat before public release, update the private configuration and reauthorize the approved account as needed. No secret value is included in this report; credentials were not rotated during this review because that would affect the working integrations.
- Establish production retention, backups and access controls for collected enquiries/assessments and local verification files. Account takeover of Google/hosting/GitHub and data at rest were outside this test.

Current result: the identified local weaknesses are remediated and their checks pass. Production security and the requested autonomous Strix scan are not certified by this work.
