# Saavantus voice demos — product record

<!-- impeccable:product-schema 1 -->

## Platform
web

## Confirmed direction
- Build a new Saavantus website; keep its source in the owner's GitHub repository.
- Use Hostinger for hosting/deployment, not as the website authoring environment.
- Existing brand/site: https://saavantus.com/.
- Reference sites: https://www.techifyai.xyz/ and https://www.futureflowai.co.uk/.
- Two agents: real estate lead qualification and healthcare front desk reception.
- Provider choices: Sarvam AI for managed voice agents; n8n Cloud for business workflows.
- GoHighLevel is the selected CRM. Its native calendars are proposed for appointment availability and booking; no account connection exists.
- Initial market: India. Initial voice languages: English and Hindi.
- Visitors should be able to speak to the agents directly in the browser.
- Copy should be concise, specific, and sufficiently detailed to explain the product.
- Current authorization: build the approved website locally with an app-like simulated workflow; create a private GitHub repository and isolated worktree. Keep Sarvam, n8n and GoHighLevel disconnected. No live integration or deployment is authorised.

## Users and intended outcome
Prospective business customers evaluate the agents by role-playing a property enquiry or clinic appointment request. The proposed demo shows both the conversation and the structured result a business team would receive. Public demonstrations and real customer operations are separate environments.

## Evidence on hand
- Two user-supplied workflow diagrams, covering real estate lead qualification and the healthcare patient journey.
- Live browser inspection of the current homepage and both industry pages, and both reference homepages on October 21, 2026.
- Earlier read-only HTTP 200 checks for the supplied n8n workflow-list key and Sarvam Model API voice-library key.
- Official documentation for Sarvam managed Voice Agents, web SDK, HTTP tools and MCP; official Hostinger deployment guidance.
- Official HighLevel contact/opportunity/calendar documentation; authentic bounded REA static Evidence for selected shipped bundles from both reference sites.
- Three desktop visual concepts, a mobile layout study and authoritative page copy in WEBSITE_DESIGN_AND_COPY.md; GoHighLevel field/booking design in GOHIGHLEVEL_PLAN.md.

## Current implementation

A Next.js/TypeScript local preview now implements the three approved pages and deterministic walkthroughs, with sample preferences and appointment/CRM outcomes. Contact/privacy/terms are truthful preview routes. No voice provider, microphone, live scheduling or persistence is implemented. See docs/LOCAL_PREVIEW.md and docs/VERIFICATION.md.

## Future connected direction — still pending
A single GitHub-owned Next.js/TypeScript application, with marketing pages, a shared voice-demo component, and short server-side session/proxy routes. Hostinger Node.js hosting is conditional on the actual account plan. Browser audio connects directly to Sarvam using its documented signed connection flow. n8n receives structured actions and results. The future connected flow saves confirmed contact details and enquiry-specific preferences in GoHighLevel and uses native calendar records for appointments. Public role-play remains separate from live CRM writes.

## Open decisions
Visual/copy direction is approved; the private repository is Prateek771/saavantus-voice-demo. Remaining connected-stage decisions: Hostinger plan, managed Agents workspace/authentication, selected voices, monthly demo budget, source property and clinic information, GoHighLevel sub-account/pipeline/field/calendar mapping, supported handoff destination, qualified clinical reviewer, and approved recording/retention behavior. No customer statistics, certifications, testimonials or working integrations are established by this product record.

## Product principles
- Let visitors try the two products early.
- Show the concrete result of the conversation.
- Label sample records, simulated bookings, and unconnected features honestly.
- Keep healthcare administrative; route clinical decisions to qualified staff.
- Preserve credentials, existing live operations, and the selected providers.
