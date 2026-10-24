# Google Workspace setup for AI Discovery 360

Approved account: **mukesh.das@saavantus.com**. The chat connector was verified as a different account and was not used to create files. The website needs its own OAuth authorization; a chat connector session is not a server credential. Google delivery remains unverified until setup succeeds. AI Discovery saves only after consent and completion; contact enquiries also require consent and report success only after Google confirms storage.

## Owner setup

Run these steps in the active website checkout:

`C:\Users\prate\.codex\worktrees\saavantus-local-preview\N8N (Saavantus )`

1. Sign in to [Google Cloud Console](https://console.cloud.google.com/) as the approved Workspace account. Select or create an appropriate project. Enable **Google Drive API** and **Google Sheets API**.
2. In **Google Auth Platform**, configure the app's branding and audience. Use Internal only when the project belongs to your Workspace organization and that option is available. Otherwise use Testing and add `mukesh.das@saavantus.com` as a test user. Workspace administration may require approval. External testing refresh tokens can expire; use the appropriate production configuration before public launch.
3. In **Clients**, create an OAuth client of type **Desktop app** for this owner-only loopback setup. Download its JSON and save it as `.data/google-oauth-client.json` inside the checkout above. Keep it out of chat, public folders and Git. Do not use a service-account key with this OAuth flow.
4. From a PowerShell terminal in the checkout, run `npm run google:authorize`. Open the URL it prints, select **mukesh.das@saavantus.com**, and review Google's consent screen. The local callback listens only on `127.0.0.1:3111`, uses a random state and PKCE, verifies the returned email, then stops. A different Google account is rejected. If using a Web application client instead, register the exact redirect URI `http://127.0.0.1:3111/oauth2callback` first.
5. Run `npm run google:setup`. It creates or reuses the app's dedicated folder tree, creates or reuses the shared business spreadsheet with Assessments and Contact Queries tabs, verifies their headers, and writes private local configuration. The authenticated account must own the destination. Optional `DISCOVERY_GOOGLE_PARENT_FOLDER_ID` selects an accessible, owned folder; leave blank for My Drive. With `drive.file` scope, an arbitrary existing folder may require separate app access; the default creates the folder in My Drive without wider Drive access.
6. Restart the local website. Open `/ai-discovery`, confirm Google saving is available, and submit one clearly synthetic test assessment. Confirm the UI receipt and the matching `request_id` row in the sheet before accepting real business information.

No OAuth secrets belong in a `NEXT_PUBLIC_` variable. The `.data/` directory is ignored by Git. Protect it with operating-system permissions restricted to the deployment identity. Do not put these files under `public/`. This local OAuth setup is for the owner, not for website visitors.

## Created destination

```text
Saavantus Excellence - AI Discovery 360/
  Assessment Data/
    AI Discovery 360 - Assessments (native Google Sheet)
      Assessments (tab)
      Contact Queries (tab)
  Generated Reports/
  Report Templates/
  System Logs/
  Archived Reports/
```

The report/template/log/archive folders are initially empty. PDF generation, email delivery and report archival are not implemented by this task. Permissions are inherited from the selected account/folder; the code does not enable public sharing or invite anyone.

## Contact enquiries

The contact form stores a local recovery copy, then attempts Google delivery to Contact Queries in the same spreadsheet under the existing Discovery folder. A confirmed response has `saved: true` and `deliveryStatus: google-sheets`. Google failure reports HTTP 503, `saved: false`, `localSaved: true`, `deliveryStatus: local-only` and the receipt reference. The form retains fields and the request ID for retry; no Google success is claimed from local storage alone. Callback dates/times are requested preferences, never booked appointments. No contact email or CRM delivery is included. Local recovery and Sheet records have no automatic retention schedule; manual deletion requests use the existing owner contact.

## Data and scoring

One row contains request ID, fingerprint, UTC submission time, organization profile, separate data/marketing consent, consent version, forty answers (including unknown), eight dimension scores and coverage, readiness/adoption scores and partial estimates, reported AI-workflow percentage, and model version. Scores are recalculated server-side; the browser cannot submit trusted scores. Workflow counts never alter the questionnaire score. Suggestions and SWOT can be reconstructed from the stored answers and model version; no PDF is stored.

Requests require the configured same-origin website, JSON and an application header. Inputs are bounded and validated, consent is mandatory, and the Google append uses **RAW** values so user-supplied strings cannot become spreadsheet formulas. No form contents, Google tokens or provider response bodies are logged.

## Retries and deployment limits

Local `.data/discovery-receipts` files contain only request fingerprints and save state, not profiles or answers. A filesystem lock serializes writes across processes sharing that directory; matching request IDs in Sheets are reconciled before writing. A timed-out or ambiguous append is never blindly repeated. If a retry stays unconfirmed, inspect Sheets by request ID first. After a server crash, remove `writer.lock` only once you have verified no writer is running. Do not delete pending receipts just to make a retry pass.

The current writer is for a single persistent deployment filesystem. Before multiple instances/serverless deployment, replace local locking/receipts and process rate limiting with a shared transactional store. Automated retention, deletion workflows and report generation are not configured. Set access and retention rules before a public launch. The sheet has an intentional 100,000-submission ceiling; migrate/archive deliberately rather than silently losing duplicate detection.

## Authorization design and references

The official `google-auth-library` handles tokens. Requested scopes are OpenID identity/email and `drive.file`, which limits access to files the app creates or is explicitly allowed to use. The adapter independently checks the authenticated account, spreadsheet ownership/edit permission, and exact headers. Local scripts provision files through the app's own authorization, rather than exporting connector tokens.

- [Google OAuth for installed apps and loopback redirects](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Google Drive file scope](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Google Drive folders](https://developers.google.com/workspace/drive/api/guides/folder)
- [Google Sheets append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)

Current authorization is blocked by `redirect_uri_mismatch`. The owner must add the exact authorized redirect URI `http://127.0.0.1:3111/oauth2callback` to the selected Web application OAuth client, then rerun authorization with the approved account. Folder provisioning and live saving remain unverified until that succeeds. Local tests with injected Google responses do not establish live Google access.
