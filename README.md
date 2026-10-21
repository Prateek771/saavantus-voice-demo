# N8N (Saavantus )

## Running local preview — current status

The approved design is now a working Next.js/TypeScript local application. Start with [the local preview guide](docs/LOCAL_PREVIEW.md). Run `npm ci` then `npm run dev`; open http://127.0.0.1:3100.

Homepage and both industry pages include responsive navigation, English/Hindi scripted walkthroughs, configurable fictional preferences, sample appointment selection, simulated CRM records, reschedule/cancel/reset, error recovery and local JSON export. Contact, privacy and terms preview routes are present.

**Sarvam voice is enabled in this local preview. n8n and GoHighLevel remain disconnected; no real bookings or CRM saves occur.** Both industry pages offer a consent-gated voice panel in addition to the separate scripted walkthrough. The managed-agent key stays in the ignored server environment. All fonts/images are local.

Repository: https://github.com/Prateek771/saavantus-voice-demo (private). Implementation branch: `feat/local-demo`; `main` preserves the approved planning baseline. See [verification](docs/VERIFICATION.md) and [implementation scope](IMPLEMENTATION.md).

The sections below are the retained historical planning snapshot; the current status above supersedes their earlier “not built” statements.

## Intended outcome

A website where visitors can try Sarvam AI voice agents for real estate and healthcare, with n8n Cloud handling the supporting workflows.

## Current status

Credentials were validated on October 21, 2026 using read-only authenticated requests:

- n8n Cloud: `GET /api/v1/workflows?limit=1` returned HTTP 200 with the expected data structure.
- Sarvam Model APIs: `GET /voices?limit=1` returned HTTP 200 with the expected success and voices structure.

These checks confirm access to those endpoints. Managed Voice Agents platform access, speech streaming, credit balance, SDK compatibility, and the website integration have not been tested. No agents were created, workflows changed or executed, or website built or published.

Reference documentation:

- https://docs.n8n.io/api/authentication/
- https://docs.sarvam.ai/api-reference/voice-cloning/list-voices

## Credentials

Paste the Sarvam AI API key, n8n Cloud instance URL, and n8n REST API key into the local `.env` file. Keep credentials out of chat, source control, logs, and browser code. The `.env` file is ignored by Git; this does not encrypt it.

## Confirmed direction — October 21, 2026

- Create a new Saavantus website with source code in the owner's GitHub repository.
- Use Hostinger for hosting and deployment only, not as the authoring environment.
- Target India, with English and Hindi for the initial voice demos.
- Provide real estate lead qualification and healthcare front desk demonstrations using Sarvam and n8n Cloud.
- The plan direction is approved; this stage is website design/copy and revised integration planning only. No product repository, agent, workflow, CRM connection or deployment has been created.
- GoHighLevel is the chosen CRM, with native calendars proposed for future appointments.

## Planning deliverables

- [START HERE: homepage, both agent pages, mobile visuals and exact copy](WEBSITE_DESIGN_AND_COPY.md)
- [GoHighLevel CRM data mapping and native appointment plan](GOHIGHLEVEL_PLAN.md)
- [Completed REA analysis of both reference sites](REA_REFERENCE_ANALYSIS.md)
- [Draft plan, website copy, workflow mapping and acceptance checks](SAAVANTUS_PLAN.md)
- [Website research, provider evidence and REA skill installation review](RESEARCH_AND_SKILL_REVIEW.md)
- [Confirmed product context](PRODUCT.md)

The requested REA instruction skill was installed at pinned revision `f5410bdc4c86de564ddb24f24df86c41cfdd8bec`; all seven files matched the reviewed snapshot. In the subsequent design review, version-pinned REA 6.7.0 was installed in the task's work directory with lifecycle scripts disabled and used for bounded static analysis of public bundles from both references. No global install, MCP registration or website JavaScript execution occurred. Both corrected runs exited 0 with zero parse failures; coverage remains partial. See the completed investigation above.

## Next decisions

- Review the proposed website visuals and exact copy.
- Confirm GitHub repository/visibility and the exact Hostinger plan.
- Verify managed Sarvam Voice Agents workspace access and the exact secure SDK session route.
- Agree on sample property/clinic data, voices, retention and demo budget.
- Inspect the selected GoHighLevel location/calendars, notification policies and staff destinations only for the later approved connected pilot.

## Proposed technical boundary

The official Sarvam browser SDK is documented and proposed, but has not been implemented or tested here. Private provider and n8n API credentials remain on the server. The planned audio path is browser-to-Sarvam; n8n handles structured business actions. Hostinger account compatibility and managed-agent access still require verification.

## Sarvam integration status

Both managed agents are committed at version 1. The separate Voice Agents key passed session signing (HTTP 200) for both agents. Bounded streaming checks passed connection acknowledgement and non-silent audio using synthetic caller silence, for real estate in English and healthcare in Hindi. Eighteen tests, TypeScript and the production build passed. Physical microphone, speech quality and interruption testing remain for the user. See [integration evidence and limitations](docs/SARVAM_INTEGRATION.md).
