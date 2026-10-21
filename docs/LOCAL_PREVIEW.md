# Saavantus local preview

## Try it

Run `npm ci`, then `npm run dev`, and open http://127.0.0.1:3100.

For the production preview: `npm run build`, then `npm start`. Only one server may use port 3100 at a time. Both commands bind to the local loopback interface; this is not a public deployment.

Routes: `/`, `/real-estate-ai`, `/healthcare-ai`, `/contact`, `/privacy`, `/terms`.

## Homepage and motion

The homepage presents one full-width voice visual with overlaid copy and a concrete enquiry-to-next-step sequence. The waveform is illustrative, not a live microphone visualizer. The SaaS 4A delivery section follows the existing framework: Assess, Architect, Adjust, Automate. Published email/phone details are centralized in `lib/site-contact.ts`; verification evidence is in `docs/REDESIGN_CONTENT.md`.

Lenis enhances wheel scrolling while keeping touch native. The homepage's Pause motion control disables smooth scrolling and decorative motion for the current session; Resume motion restores it. OS/browser reduced-motion preference takes priority. Inputs and transcript scrolling are excluded from smoothing. Animation is an enhancement: content remains readable without it.

## Live voice and walkthroughs

For live voice on either industry page, choose English or Hindi in the voice panel, read and check the fictional-data consent, select Start voice demo, and allow the microphone in your browser. End demo stops the session; the maximum is three minutes. Sarvam processes audio and may retain recordings/transcripts. Use fictional information. No CRM or calendar is connected.

For the separate scripted walkthrough:

1. Choose English or Hindi and optionally customise the fictional scenario.
2. Start the walkthrough. Use Next exchange to move through four scripted exchanges.
3. Review/change the sample preferences and choose a fictional time in IST.
4. Create a sample appointment, inspect the record/workflow panels, change or cancel the sample time, or download the example JSON.
5. Reset to clear the scenario. In review, the unavailable-service disclosure lets you test error recovery.

The healthcare walkthrough demonstrates appointment requests only. The broader clinic-information and staff-handoff concepts remain explanatory copy for future implementation.

## Contact form

Open `/contact` from Contact us in the navigation or footer. Enter a fictional name, business, email, industry and requirements; phone is optional. You can request a callback date and time in India Standard Time. Explicit contact consent is required. Do not include patient records or sensitive information.

Select **Save enquiry to preview**. A successful response says **Saved to the local preview** and shows a receipt. The server stores one JSON file per request under the ignored `.data/contact-requests/` directory for the owner to review locally. No email or GoHighLevel delivery occurs. A callback time is a preference, not a booking. Reloading the page does not delete a saved request.

Validation errors keep the entered details. Identical retries return the same receipt rather than creating another record. See [contact intake details](CONTACT_INTAKE.md) for access, retention, validation and future field mapping. There is no public enquiry-list endpoint; do not paste saved contact records into chat, logs or Git.

## Boundaries

The official Sarvam browser SDK connects through a server-only signing proxy. Microphone access is requested only on Start after consent. The key remains in the ignored server environment; CSP permits only the configured Sarvam socket origin. No n8n workflow, CRM write, live calendar or production database is connected. The contact form does persist its own submitted fields to private local files. Scripted walkthrough state stays in React memory, and JSON export is an explicit local download. Live audio/transcripts are handled by Sarvam under its account settings.

The interface is English. Both live agents support English/Hindi; the separate walkthrough language switches its scripted dialogue. Real microphone conversation quality is not yet verified. Bounded synthetic streaming checks passed for both agents.

The original filled `.env` is preserved. The worktree `.env` contains the separate managed Voice Agents key and pinned IDs/version. It is ignored by Git. `.env.example` is a credential-free template; follow docs/SARVAM_INTEGRATION.md before enabling voice in another checkout.

## Repository

Private GitHub: https://github.com/Prateek771/saavantus-voice-demo

`main` preserves the approved planning baseline. The implementation lives on `feat/local-demo` in the Codex-managed worktree. A worktree is a local branch checkout, not a folder hosted by GitHub. No branch merge or Hostinger deployment has occurred.

## Structure

- `app/`: routes, local fonts, metadata, global/marketing/demo styles.
- `components/`: header/footer, animated voice scene, motion provider, contact form and local walkthrough.
- `lib/demo.ts`: deterministic fixture data and guarded transitions.
- `lib/server/contact.ts`: validated local enquiry storage and duplicate protection.
- `tests/demo.test.mjs`: meaningful walkthrough state and data-boundary tests.
- `tests/contact.test.mjs`: contact validation, persistence, duplicate, request-boundary and rate-limit checks.
- `.data/contact-requests/`: private local enquiry files, ignored by Git.
- `public/images/`: two generated fictional architectural images.
- `design/`: approved static design references and generation prompts.
- `docs/`: current operation and verification records.

## Checks

`npm test` runs the walkthrough, Sarvam and contact intake tests. `npm run typecheck` checks TypeScript. `npm run build` creates production output. The framework setup follows the current official Next.js installation documentation: https://nextjs.org/docs/app/getting-started/installation.

Connecting n8n/GoHighLevel or deploying publicly requires separate authorization and verified provider contracts. Retain Sarvam for voice, n8n Cloud for actions, GoHighLevel for CRM/native calendars, and Hostinger for the eventual deployment. Do not enable live operations from this preview's sample controls.
