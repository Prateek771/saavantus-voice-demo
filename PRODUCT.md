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
- Current authorization: redesign the local website with a unified premium light design across the homepage, real estate, healthcare and contact. Adapt the supplied Aqua Voice reference's near-white restraint using self-hosted DM Sans, accessible blue actions, an animated blue wave, full-width hero and clear product demonstrations. Preserve Lenis scrolling, the existing workflow and SaaS 4A copy, verified contact footer, local contact intake, both managed Sarvam agents and their browser voice connection. Prepare the GoHighLevel field/appointment handoff for the next integration stage. n8n and GoHighLevel remain disconnected; no public deployment is authorised.

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

The premium light redesign uses a near-white canvas, light DM Sans headlines, blue actions and restrained cool surfaces across the four main pages. Its full-width homepage hero places the copy above an animated blue waveform and a white conversation schematic. It explains the existing SaaS 4A Framework (Assess, Architect, Adjust, Automate), verified against saavantus.com. Pinned Lenis smooths wheel scrolling; native touch, reduced-motion preferences, a visible motion pause, visible-by-default text and offscreen animation cleanup preserve usability. Contact intake saves locally with clear status, not to GoHighLevel. Footer contact details are verified against the existing site; no testimonials or client results have been invented. DESIGN.md records the current visual authority.

A Next.js/TypeScript local preview now implements the three approved pages and deterministic walkthroughs, with sample preferences and appointment/CRM outcomes. Contact/privacy/terms are truthful preview routes. Both Sarvam agents are committed at version 1 and connected through the official browser SDK and a server-only signing proxy. Synthetic streaming checks passed; physical microphone and conversation quality remain unverified. No live scheduling or CRM persistence is implemented. See docs/LOCAL_PREVIEW.md and docs/VERIFICATION.md.

## Future connected direction — still pending

A single GitHub-owned Next.js/TypeScript application, with marketing pages, a shared voice-demo component, and short server-side session/proxy routes. Hostinger Node.js hosting is conditional on the actual account plan. Browser audio connects directly to Sarvam using its documented signed connection flow. n8n receives structured actions and results. The future connected flow saves confirmed contact details and enquiry-specific preferences in GoHighLevel and uses native calendar records for appointments. Public role-play remains separate from live CRM writes.

## Open decisions

Visual/copy direction is approved; the private repository is Prateek771/saavantus-voice-demo. Remaining connected-stage decisions: Hostinger plan, monthly demo budget, source property and clinic information, GoHighLevel sub-account/pipeline/field/calendar mapping, supported handoff destination, qualified clinical reviewer, and approved recording/retention behavior. No customer statistics, certifications or testimonials are established by this product record. Sarvam runtime connectivity is verified; CRM and live calendar operations remain unconnected.

## Product principles

- Let visitors try the two products early.
- Show the concrete result of the conversation.
- Label sample records, simulated bookings, and unconnected features honestly.
- Keep healthcare administrative; route clinical decisions to qualified staff.
- Preserve credentials, existing live operations, and the selected providers.
