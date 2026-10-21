# Saavantus local preview

## Try it

Run `npm ci`, then `npm run dev`, and open http://127.0.0.1:3100.

For the production preview: `npm run build`, then `npm start`. Only one server may use port 3100 at a time. Both commands bind to the local loopback interface; this is not a public deployment.

Routes: `/`, `/real-estate-ai`, `/healthcare-ai`, `/contact`, `/privacy`, `/terms`.

For live voice on either industry page, choose English or Hindi in the voice panel, read and check the fictional-data consent, select Start voice demo, and allow the microphone in your browser. End demo stops the session; the maximum is three minutes. Sarvam processes audio and may retain recordings/transcripts. Use fictional information. No CRM or calendar is connected.

For the separate scripted walkthrough:

1. Choose English or Hindi and optionally customise the fictional scenario.
2. Start the walkthrough. Use Next exchange to move through four scripted exchanges.
3. Review/change the sample preferences and choose a fictional time in IST.
4. Create a sample appointment, inspect the record/workflow panels, change or cancel the sample time, or download the example JSON.
5. Reset to clear the scenario. In review, the unavailable-service disclosure lets you test error recovery.

The healthcare walkthrough demonstrates appointment requests only. The broader clinic-information and staff-handoff concepts remain explanatory copy for future implementation.

## Boundaries

The official Sarvam browser SDK connects through a server-only signing proxy. Microphone access is requested only on Start after consent. The key remains in the ignored server environment; CSP permits only the configured Sarvam socket origin. No n8n workflow, CRM write, live calendar or database persistence is connected. Scripted walkthrough state stays in React memory, and JSON export is an explicit local download. Live audio/transcripts are handled by Sarvam under its account settings.

The interface is English. Both live agents support English/Hindi; the separate walkthrough language switches its scripted dialogue. Real microphone conversation quality is not yet verified. Bounded synthetic streaming checks passed for both agents.

The original filled `.env` is preserved. The worktree `.env` contains the separate managed Voice Agents key and pinned IDs/version. It is ignored by Git. `.env.example` is a credential-free template; follow docs/SARVAM_INTEGRATION.md before enabling voice in another checkout.

## Repository

Private GitHub: https://github.com/Prateek771/saavantus-voice-demo

`main` preserves the approved planning baseline. The implementation lives on `feat/local-demo` in the Codex-managed worktree. A worktree is a local branch checkout, not a folder hosted by GitHub. No branch merge or Hostinger deployment has occurred.

## Structure

- `app/`: routes, local fonts, metadata, global/marketing/demo styles.
- `components/`: header/footer, marketing sections, local walkthrough and worksheet.
- `lib/demo.ts`: deterministic fixture data and guarded transitions.
- `tests/demo.test.mjs`: meaningful state and data-boundary tests.
- `public/images/`: two generated fictional architectural images.
- `design/`: approved static design references and generation prompts.
- `docs/`: current operation and verification records.

## Checks

`npm test` runs the workflow tests. `npm run typecheck` checks TypeScript. `npm run build` creates production output. The framework setup follows the current official Next.js installation documentation: https://nextjs.org/docs/app/getting-started/installation.

Connecting n8n/GoHighLevel or deploying publicly requires separate authorization and verified provider contracts. Retain Sarvam for voice, n8n Cloud for actions, GoHighLevel for CRM/native calendars, and Hostinger for the eventual deployment. Do not enable live operations from this preview's sample controls.
