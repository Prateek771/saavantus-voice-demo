# Saavantus local preview

## Try it

Run `npm ci`, then `npm run dev`, and open http://127.0.0.1:3100.

For the production preview: `npm run build`, then `npm start`. Only one server may use port 3100 at a time. Both commands bind to the local loopback interface; this is not a public deployment.

Routes: `/`, `/real-estate-ai`, `/healthcare-ai`, `/contact`, `/privacy`, `/terms`.

On either industry page:

1. Choose English or Hindi and optionally customise the fictional scenario.
2. Start the walkthrough. Use Next exchange to move through four scripted exchanges.
3. Review/change the sample preferences and choose a fictional time in IST.
4. Create a sample appointment, inspect the record/workflow panels, change or cancel the sample time, or download the example JSON.
5. Reset to clear the scenario. In review, the unavailable-service disclosure lets you test error recovery.

The healthcare walkthrough demonstrates appointment requests only. The broader clinic-information and staff-handoff concepts remain explanatory copy for future implementation.

## Boundaries

No provider SDK, API route, AI call, audio capture, outbound message, CRM write, live calendar, analytics, database or browser persistence is implemented. Browser media permissions are disabled; the Content Security Policy restricts connections to this app. Fonts and generated architectural images are served locally. State is held in React memory; JSON export is an explicit local download.

The interface is English; the Hindi option switches the scripted dialogue. User-selected fixture values such as locations remain in their supplied form. No quality claim about live Hindi/English voice is made.

Keep real secrets out of this preview. The worktree `.env` is a blank template with local mode and telemetry disabled. The original filled `.env` is preserved in the planning checkout and is not copied or committed. Future credentials have server-only placeholder names in `.env.example`; no current application code reads them. Setting a credential does not enable an integration.

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

Future implementation requires separate permission and verified provider contracts. Retain Sarvam for voice, n8n Cloud for actions, GoHighLevel for CRM/native calendars, and Hostinger for the eventual deployment. Do not enable live operations from this preview's sample controls.
