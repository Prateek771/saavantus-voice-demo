# N8N (Saavantus )

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
