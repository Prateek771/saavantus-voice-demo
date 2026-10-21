# Saavantus website and voice-agent plan

**Direction approved; design review in progress • October 21, 2026 • No product implementation**

**Revision 2:** Added GoHighLevel as the selected CRM and proposed native appointment scheduler. The owner requested visual designs and copy before building or connecting anything. Review [the three page designs and exact copy](WEBSITE_DESIGN_AND_COPY.md), [the GoHighLevel data/booking plan](GOHIGHLEVEL_PLAN.md), and [the completed REA investigation](REA_REFERENCE_ANALYSIS.md). These companion documents supersede the earlier generic CRM choice and abbreviated copy below.

**Goal:** Build a new, original Saavantus website where Indian real estate and healthcare businesses can try two English/Hindi voice agents and see the operational result of each conversation.

**Ownership and deployment:** Source code in your GitHub repository. Hostinger hosts the application. Sarvam runs the voice conversations. n8n Cloud handles structured business actions. GoHighLevel is the chosen CRM, with native calendars proposed for the later connected appointment flow. Hostinger's website builder is not the authoring workflow.

This draft incorporates your two diagrams and the clarification about GitHub/Hostinger. Recommendations below are proposed choices, not claims that the capabilities already exist. No website, agents, workflows, or deployments were implemented during this planning work. The separately requested REA skill installation is complete; details are in [the research report](RESEARCH_AND_SKILL_REVIEW.md).

## 1. Recommended first release

Build a focused product demonstration site with two complete browser experiences:

1. **Real estate lead qualification:** understand the enquiry, collect relevant property requirements, answer from an approved sample catalog, apply explicit qualification rules, offer a demonstration viewing request, and produce a consultant-ready summary.
2. **Healthcare front desk receptionist:** answer approved administrative questions, collect a minimal appointment request, check demonstration doctor schedules, identify when staff must take over, and produce a reception-ready summary.

Visitors role-play a buyer, tenant, seller, or patient using clearly labelled fictional data. The business buyer sees what the agent asks, how it responds, and what staff receive. Real bookings, patient records, outbound calling and follow-up messages belong to a later connected pilot.

**Main tradeoff:** the healthcare diagram describes a broad hospital platform, not one receptionist. Trying to deliver its entire 25-step journey in the first demo would slow the launch and create misleading promises about systems we have not connected. Preserve the complete roadmap, while making the first reception journey work convincingly from start to finish.

## 2. What the three websites teach us

| Site | Observed strengths | What Saavantus should do with them |
|---|---|---|
| [Current Saavantus](https://saavantus.com/) | Recognizable brand, existing industry routes, red/cream identity, clear service categories. Industry pages already surface voice-agent buttons. | Build a new site around the two demos. Retain useful brand material and URL continuity. Move the broad service catalog behind the primary product journey. |
| [Techify](https://www.techifyai.xyz/) | Strong typographic contrast, distinctive animated hero, concrete case narratives, detailed explanation of delivery and ownership. | Adopt specific problem → action → outcome storytelling and a memorable visual identity. Use our own conversation/result interaction as the signature. |
| [FutureFlow](https://www.futureflowai.co.uk/) | Immediate voice-agent positioning, short navigation, clear feature grouping, a three-step process, visible voice-call entry. | Adopt the low-friction route into a demo. Make the actual industry task and resulting handoff much more specific. |

Do not reproduce their code, artwork, copy, customer logos, financial guarantees, or published performance claims. The references guide structure and communication; Saavantus needs an original identity and evidence of its own.

The current Saavantus homepage asks people to consider generic automation before experiencing either product. Its published performance metrics and testimonials need owner-provided substantiation before reuse. The healthcare page describes triage, insurance checks, EMR integration and compliance-related capability; these have not been verified in this project. Footer privacy/terms links currently lead to Contact. These are content and trust issues to resolve in the new site, not proof that the underlying services are absent. [Observed pages](https://saavantus.com/healthcare-ai).

## 3. Proposed website structure and visual direction

### Pages

| Route | Job |
|---|---|
| `/` | Explain the two products and get visitors into the appropriate demo. |
| `/real-estate-ai` | Show the qualification conversation, enquiry summary and viewing-request flow. |
| `/healthcare-ai` | Show the reception conversation, appointment request and staff handoff. |
| `/contact` | Request a deployment discussion for the visitor's business. |
| `/privacy` and `/terms` | Explain the actual demo data handling and applicable service terms, reviewed before launch. |

Use an on-page demo section on each industry page, reachable directly from the homepage. Avoid a separate account dashboard, user registration, CMS, or additional demo route unless a real requirement appears. Inventory all current URLs before replacement; retain useful existing pages or prepare explicit redirects for retired content.

### Homepage sequence

1. **Clear offer and two demo choices.** The first screen says what the agents do, who they serve, and how to try one.
2. **Try a conversation.** Each card includes an example scenario, language choice and clear start action.
3. **See the result.** Show the sample lead or appointment request produced by the demo, rather than a decorative analytics chart.
4. **What each agent handles.** Three concrete capabilities per industry, with links to the detail pages.
5. **How deployment works.** Agree the workflow → connect selected systems → test with staff → launch and review.
6. **Boundaries and trust.** Explain human handoff, data handling, supported languages, and which integrations need configuration.
7. **Business enquiry.** A secondary action to discuss a deployment; do not block the browser demo behind a sales form.

### Visual proposal

Create an original, polished Saavantus identity: warm light backgrounds, ink-coloured typography, restrained brand red, strong spacing, and editorial headings. Use the demo itself as the visual centre: a conversation panel beside a compact result panel, with subtle state-driven waveform motion. Industry imagery should be relevant and licensed, not generic robot illustrations.

On mobile, stack the conversation and result, keep mute/end-call controls reachable, and reveal the completed summary after the conversation. Support reduced motion, keyboard navigation, visible focus, text labels for every audio state, and readable contrast. The desktop reference review is complete; physical-phone and mobile-layout acceptance happens during the future build.

### Demo interaction

Choose industry → choose English/Hindi → read the demo/data notice → click Start and grant microphone permission → talk → review the result → optionally enquire about deployment.

The interface must distinguish: ready, microphone permission, connecting, listening, processing, speaking, muted, reconnect needed, busy/capacity reached, ended, summary pending, and summary available. A visible timer and end-call action stay available throughout. Switching agents ends the previous session and clears its context.

Proposed public limits: three minutes per session, one concurrent session per visitor, and a server-enforced daily budget. Exact limits are an owner decision after account pricing and test quality are confirmed. A browser-only timer is insufficient to enforce spending.

## 4. Draft copy direction

These are original draft lines for review. Publish each capability only once the corresponding demo passes acceptance.

| Placement | Draft copy |
|---|---|
| Homepage eyebrow | Voice agents for real estate and healthcare |
| Homepage headline | **A better conversation. A clear next step.** |
| Homepage support | Meet Saavantus voice agents for property enquiries and clinic reception. Try a conversation in English or Hindi and see the summary your team receives. |
| Primary actions | **Try the real estate agent** / **Try the healthcare receptionist** |
| Secondary action | Discuss your workflow |
| Real estate headline | **Know what they want. Know what comes next.** |
| Real estate support | Capture property preferences, budget and timing. See a structured qualification summary and try a sample viewing request. |
| Real estate detail | Collect the requirements. Match approved property information. Give your consultant a clear next action. |
| Healthcare headline | **A calmer first call. A clearer next step.** |
| Healthcare support | Answer clinic questions, collect appointment preferences and prepare a clear request for reception. Clinical questions go to qualified staff. |
| Healthcare detail | Find the right administrative service. Check sample appointment times. Prepare the staff handoff. |
| Demo disclosure | This is an AI demonstration using fictional records and schedules. Please use sample details. It does not create a real booking or provide medical advice. |
| Demo result label | Demonstration result — no real appointment or viewing has been booked. |
| Closing action | Bring your workflow. We’ll map the agent’s role. |

Use short headings and one idea per paragraph. Put technical detail and integration conditions in expandable sections or FAQs. Avoid vague adjectives, fabricated savings, guaranteed conversion lifts, claims to replace clinicians, or blanket integration/compliance promises. English and Hindi voice scripts need separate review for natural speech, names, dates, numbers and code-switching; a literal translation is not sufficient.

## 5. Agent one: real estate lead qualification

**Proposed identity:** Saavantus Property Assistant. Warm, direct, professional, one question at a time. Clearly introduces itself as an AI demo.

### Conversation and result

1. Explain the demonstration and ask whether the visitor wants to buy, rent, sell or discuss leasing.
2. Collect only the fields relevant to that intent. Buyer/renter: location, property type, size, budget, timing, and preferences. Seller/lessor: property location/type, indicative price or rent, timing and preferred next step.
3. Answer using approved sample property records; disclose missing information. Never invent availability, approvals, pricing, appreciation or returns.
4. Read back important fields and accept corrections before final qualification.
5. Apply deterministic business rules to buyer/renter enquiries and show the reasons. Seller/lessor enquiries follow a separate intake path for staff review.
6. Offer sample viewing/consultation slots. Confirm that this is a demonstration request.
7. Produce an enquiry summary with intent, confirmed requirements, unknowns, score/category where applicable, next action and handoff reason.

Proposed demo scoring is deliberately simple: property/location fit, declared budget fit, stated timing, and requested next action each contribute up to 25 points. Before building, define explicit input-to-point rules against the sample catalog. Suggested bands: hot 75–100, warm 45–74, cold 0–44. Missing essential fields produce **incomplete**, not a fabricated score. Opt-outs and invalid contacts are separate dispositions. These scores prioritize staff follow-up; they do not determine housing or credit eligibility. Protected demographic traits are not inputs.

### Mapping your real estate diagram

| Diagram capability | First browser demo | Connected pilot / later |
|---|---|---|
| Ads, portals, forms, calls, referrals | Browser-started sample enquiry. | Add one authorized lead source at a time; verify its API and consent fields. |
| Validation and duplicate checks | Validate sample fields; demonstrate duplicate-safe upsert in an isolated test store. | Match on a defined source/contact key; preserve existing CRM history. |
| Voice contact and retry | Visitor explicitly starts the browser conversation. | Outbound calls, retry windows and opt-outs need a separate approved policy. |
| Consent | Explain AI demo and data use before collection. | Separate service, recording and follow-up permissions as applicable. |
| Qualification conversation | Buyer/renter requirements; seller/lessor intake branch. | Replace sample records with owner-approved inventory. |
| Scoring and classification | Deterministic rules, explanations and incomplete state. | Calibrate rules against staff judgments; version them. |
| Availability and appointment | Sample slots and clearly labelled viewing request. | Authoritative calendar lookup, conflict checks and booking confirmation. |
| Human handoff | Display handoff reason and proposed next action. | Staff queue or supported live transfer after destination and hours are agreed. |
| Conversation summary | Structured result, with corrections and missing fields. | CRM note and permitted transcript/recording references. |
| CRM update | Isolated sample records only. | GoHighLevel contact plus separate enquiry/opportunity, duplicate protection and audit trail; see the detailed CRM plan. |
| Notifications | Show the notification that would be produced. | Send to approved recipients/channels only. |
| Follow-up | Explain the next action; no automatic contact. | Approved sequences with opt-out, cadence and stop conditions. |
| Analytics | Demo starts, successful sessions, completion and failure counts. | Qualification/appointment conversion and operational measures from real evidence. |

## 6. Agent two: healthcare front desk receptionist

**Proposed identity:** Saavantus Clinic Receptionist. Calm, concise and administrative. It is not presented as a doctor or diagnostic system.

The supplied diagram places identity before consent and emergency detection. The proposed design adjusts that sequence: detect potential emergencies or requests for a human from the beginning, and obtain the relevant consent before collecting routine personal/health details. Urgent escalation must never depend on finishing identity, payment or appointment questions.

### Conversation and result

1. Introduce the AI demo and fictional clinic. Offer administrative help: clinic information, appointment request, rescheduling/cancellation demonstration, or staff assistance.
2. Keep emergency/human-handoff handling active throughout. For a possible emergency, stop routine intake and follow a clinician-approved escalation script. The public demo must not pretend it has transferred to emergency services or dispatched help.
3. Obtain the relevant data-use consent before routine collection. Microphone permission is not recording consent.
4. For an existing-patient scenario, use a fictional patient identity. A real pilot must use the clinic's approved verification method before revealing or modifying any record; a name or date of birth alone is not assumed sufficient.
5. Collect the requested service/doctor, preferred date, consultation mode and only necessary contact details. Accept a brief stated reason without diagnosing it.
6. Use approved service-routing rules and doctor/schedule data. Unclear clinical cases go to qualified staff; do not invent a diagnostic confidence score or rank doctors as medically superior.
7. Read back the request, explain whether it is pending or confirmed, and produce the reception summary. In the public demo, every booking is explicitly simulated.

### Mapping all 25 healthcare steps

| Diagram step | Proposed treatment |
|---|---|
| 1. Multi-channel requests | Browser voice first; phone, WhatsApp, SMS, email, portal and kiosk are later channel integrations. |
| 2. AI receptionist | Core first demo, English/Hindi, approved clinic information. |
| 3. Identity verification | Fictional identity in demo; clinic-approved authentication before real record access. |
| 4. Consent/privacy | Pre-collection notice; explicit recording choice if enabled; retained consent evidence in a real pilot. |
| 5. Emergency detection | Active from the first utterance and throughout; clinician-reviewed escalation rules, safe fallback and no false dispatch/transfer claim. |
| 6. Symptom collection | Minimum appointment reason only in public demo; detailed symptoms, medications and history deferred to an approved clinical intake workflow. |
| 7. Medical triage | Reframe first release as administrative routing. Clinical triage requires separate clinical ownership and validation. |
| 8. Doctor recommendation | Filter an approved directory by requested specialty, availability and language; qualified staff handle clinical suitability questions. |
| 9. Availability | Sample schedules first; one authoritative scheduling integration in a pilot. |
| 10. Insurance verification | Answer approved process FAQs; insurer eligibility/cashless checks require a real integration and cannot be inferred. |
| 11. Consultation type | Collect among modes actually offered in the sample or connected clinic. |
| 12. Booking | Simulated request first; authoritative booking ID and conflict protection before calling a real appointment confirmed. |
| 13. Payment | Excluded from public demo. Later use hosted payment checkout and verified payment events; never collect card details by voice. |
| 14. Confirmation | Show a labelled sample result; send a real confirmation only after the booking system succeeds. |
| 15. Conversation summary | Core demo: requested service, time preference, verified fields, unknowns and handoff reason. |
| 16. EMR/EHR update | Deferred until the specific system, permission model and supported interface are confirmed. |
| 17. Notifications | Preview only in demo; approved staff/patient destinations in pilot. |
| 18. Reminders | Pilot with agreed timing, cancellation synchronization and opt-out rules. |
| 19. Check-in | Later queue/kiosk integration. No claim of a working QR or queue system in the demo. |
| 20. Consultation | Clinician performs care; agent prepares administrative context only. |
| 21. Lab integration | Later, based on clinician orders and verified lab-system integration. |
| 22. Pharmacy integration | Later, based on valid prescriptions and pharmacy systems; agent never prescribes or changes medicines. |
| 23. Follow-up scheduling | Pilot only on clinician/staff instructions and actual availability. |
| 24. Feedback | Optional sample feedback in demo; operational surveys only after destinations/consent are agreed. |
| 25. CRM/analytics | Operational metrics first; do not label unvalidated metrics as clinical triage accuracy. |

Human handoff covers explicit requests, uncertain understanding, unsupported language, clinical questions, emergencies, complaints, insurance/payment issues, unavailable doctors and tool failures. A browser staff handoff may be a callback/request queue rather than an immediate telephone transfer; the interface must state which is available.

## 7. Proposed technical architecture

```text
Your GitHub repository
        │ reviewed deployment
        ▼
Hostinger: new Saavantus website + short HTTPS server routes
        │                              │
        │ browser interface            │ server-held Agents key
        ▼                              ▼
Visitor microphone ◄──────► Sarvam managed Voice Agent
                            Real estate OR healthcare
                                      │ authenticated structured tool calls
                                      ▼
                                  n8n Cloud
                                      │
                         Demo records / sample calendars
                                      │ later approved pilot
                         GoHighLevel CRM + native calendars / staff queue
```

**Recommended stack:** one Next.js/TypeScript repository, the official Sarvam web SDK, standard CSS/design tokens and n8n workflow exports. One shared voice panel serves two independently configured agents. Use a minimal dependency set; no separate microservice platform, new LLM provider, telephony stack, or admin dashboard for the first demo. This recommendation uses the Ponytail simplicity principle.

Sarvam documents `sarvam-conv-ai-sdk/browser`, `ConversationAgent`, `BrowserAudioInterface`, transcript/state callbacks, microphone capture and playback. Its production example places a proxy behind the application, while the permanent key remains server-side. The SDK obtains a signed single-use WebSocket URL. The exact current SDK proxy requests must be inspected before implementation; do not invent a Sarvam session endpoint. [Web SDK](https://docs.sarvam.ai/voice-agents/deploy/sdks/web).

The intended audio path is **browser ↔ Sarvam**. n8n handles booking checks, record updates, summaries and staff tasks; it should not relay audio or run the conversational turn loop. Hostinger's managed Node.js limits exclude inbound WebSockets and always-running background workers. Therefore the hosting feasibility check must confirm that only short HTTP session/proxy calls pass through Hostinger and the audio socket goes directly to Sarvam. If the chosen SDK flow needs a server-side persistent socket, reassess hosting before building that path. [Hostinger limits](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/).

Hostinger documents managed Node.js deployment from GitHub on eligible Business/Cloud plans. Your actual plan and GitHub permissions have not been inspected. A single application there is preferred if compatible. Otherwise compare a plan upgrade against a small separately hosted API, explaining recurring cost and operational ownership before changing the setup. GitHub stores source and triggers deployment; GitHub Pages alone cannot keep these server secrets. [Hostinger deployment](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

### Managed-agent access prerequisite

The successful `GET /voices` check belongs to the **Model API**. Managed Voice Agents documents a different authentication surface, workspace IDs and committed agent versions. Confirm the correct workspace and supported credentials before promising to create the agents. The official Sarvam MCP supports creating/configuring agents through scoped sign-in, but it is not connected in this chat. Public documentation also supplies dashboard deployment recipes. Use a verified supported route rather than guessing create-agent endpoints. [Agents MCP](https://docs.sarvam.ai/voice-agents/mcp), [Deploy with Code](https://docs.sarvam.ai/voice-agents/deploy/deploy-with-code).

Sarvam documents declarative HTTP tools for non-enterprise workspaces and code-upload tools for enterprise. Confirm which tool/lifecycle-hook features this account exposes. This is more precise than assuming every webhook requires Enterprise, or assuming every lifecycle feature is available. [MCP tool differences](https://docs.sarvam.ai/voice-agents/mcp), [HTTP tools](https://docs.sarvam.ai/voice-agents/build/tools/https-tool).

### Minimum business contracts

| Proposed action | Inputs and authoritative result |
|---|---|
| Read property/service facts | Selected catalog/service identifier; return only approved records and explicit unknowns. |
| Check availability | Service/property, timezone and requested window; return a timestamped list of actual or labelled sample slots. |
| Request/confirm appointment | Confirmed fields, slot identifier and internal action/deduplication key; return `confirmed`, `pending`, `conflict` or `failed`, plus a booking ID only when authoritative. HighLevel's reviewed create contract does not document a provider idempotency key; reconcile uncertain writes before retrying. |
| Prepare handoff | Session, requested team and reason; return receipt/status. Never say transferred unless a real transfer succeeded. |
| Finalize conversation | Versioned schema, agent/version, interaction/action IDs, consent state, captured facts and disposition; return a duplicate-safe receipt. |

In n8n, start with a small shared action gateway, agent-specific qualification/reception logic, a final-summary workflow and an error workflow. Slow notifications and reporting run after the conversation. Use the actual provider interaction ID plus action ID for duplicate protection; retries must not create a second appointment or message. A timeout with an uncertain booking outcome requires reconciliation, not a blind retry or a false success statement.

Agent speech and final result panels must rely on validated tool results. Fields inferred from a transcript remain tentative until confirmed. Keep sample stores and credentials isolated from real customer data. Do not fetch or expose existing n8n workflows outside this project's scope.

### Session, secret and data boundaries

- Browser requests may select only the two permitted demo agents; server chooses organization/workspace/version. Never accept an arbitrary upstream URL or arbitrary agent ID from a visitor.
- Use short-lived app sessions, origin/CSRF checks appropriate to the deployment, request validation, throttling, account capacity controls and a provider-side call-duration ceiling. Protect a public endpoint against direct scripted use as well as normal browser traffic.
- Keep permanent Sarvam and n8n keys in server/managed secrets. They must not enter GitHub, frontend environment prefixes, downloadable JavaScript, screenshots or logs.
- Public demos use fictional records. Ask visitors not to share health histories or sensitive identifiers. Minimize retained fields and redact logs. Explicitly decide provider audio/transcript recording and retention before launch; a UI notice cannot disable provider-side storage by itself.
- Display only the current visitor's result. Authenticate any result lookup; never use a predictable record ID as the sole access check.
- Maintain separate demonstration and production destinations. Nothing in a public demo sends an external message or creates a real patient/lead appointment without the agreed pilot scope.

## 8. Delivery phases and acceptance

This is a product and architecture plan. Exact file locations below are proposed for the new repository; no repository or source files have been created. The first phase resolves the account/SDK contracts needed for a reliable engineering task plan.

| Phase | Deliverable and affected systems | Acceptance before proceeding |
|---|---|---|
| 0. Resolve prerequisites | After design review: GitHub repository/visibility choice; Hostinger plan check; managed Sarvam workspace, key/MCP access, voice, tool features and budget. Identify a qualified clinical reviewer for the healthcare demo's emergency and clinical-question responses. For the connected pilot, inspect the chosen GoHighLevel location, fields, pipeline, calendars, notifications and permissions. Read-only audit first. | Confirm the exact deployment and secure SDK route, sample datasets, supported tools and billing; assign clinical-script ownership before healthcare agent configuration. Record unresolved provider limitations. |
| 1. Approve website/story — current stage | Three desktop design concepts, opening mobile layouts, exact page copy and proposed CRM flow are available in the companion documents. No functioning site exists yet. Final content/URL migration inventory remains a build prerequisite. | Owner reviews the visual direction, copy and fictional-versus-connected labels before product building or connections begin. |
| 2. Configure both agents | Separate Sarvam drafts, prompts, variables, knowledge, language/voice settings, tool contracts and versioned scenario suites. | English/Hindi conversation tests pass, with no invented facts or unsafe clinical behavior. Select current supported voices; verify V4 suitability given documented V3 retirement. |
| 3. Wire isolated workflows | New project-specific n8n workflows, sample catalog/schedules, duplicate handling, success/failure responses and handoff receipts. | Repeated and failed requests cannot create duplicate effects; agent and UI report the actual result. |
| 4. Integrate website | New GitHub application and shared SDK demo component; server-only credentials; sample result panels and all audio/error states. | One full conversation per industry produces the correct visible result. Browser bundles contain no private keys. |
| 5. Preview and acceptance | Hostinger preview deployment, desktop and real-phone checks, abuse/budget tests, content review, backup and rollback plan. | Owner approves the preview against the checks below; the qualified reviewer approves English/Hindi emergency and clinical-question wording before public healthcare access. Live domain replacement remains a separate release decision. |
| 6. Public demo launch | Reviewed version deployed to the main domain, old routes retained/redirected, monitoring and a working stop switch. | Post-deployment smoke tests pass; rollback is available; budget and failures are visible. |
| 7. Connected pilot | One real estate or clinic customer, GoHighLevel contacts/enquiries and native calendar appointments, and a defined staff team. First prove the workflow with synthetic records in an approved test location. | Staff sign off actual CRM fields, booking statuses, deduplication, notification behaviour, data handling, handoffs and permissions before real operations or additional channels expand. |

Proposed repository responsibilities: `app/` for pages and short server routes; `components/voice-demo/` for the shared interaction; `lib/server/` for credential/session controls; `agents/` for versioned prompts and synthetic scenarios; `workflows/` for sanitized n8n exports; `tests/` for business contracts and browser flows; `docs/` for decisions and operations. Match the final structure to the selected SDK contract and keep secrets out of every export.

### Acceptance checklist

- [ ] Both demos complete in English and Hindi, including a language switch, interruption and correction of a name/date/number.
- [ ] Visitors can identify the product, select an agent and find the start control without a sales form or account.
- [ ] Microphone denial, muted audio, silence, reconnect, capacity exhaustion and session expiry produce understandable recovery states.
- [ ] A desktop browser and actual Android/iPhone browsers have been tested for microphone, playback, interruption and backgrounding. Automated screenshots alone do not establish voice quality.
- [ ] No secret appears in the browser bundle, requests to unrelated services, source history or normal logs.
- [ ] Duplicate webhook delivery, double-click booking, stale slot and uncertain timeout outcomes are tested; no duplicate write or false confirmation occurs.
- [ ] Property answers match the approved catalog. Unknown fields remain unknown; scoring is reproducible from published test rules.
- [ ] Healthcare emergency, diagnosis/prescription requests, identity mismatch and explicit human requests take the approved safe route. No clinical correctness claim follows from a scripted test alone.
- [ ] Attempted prompt injection cannot change agent scope, expose other sessions or invoke unapproved actions.
- [ ] Data retention/recording settings match the disclosure; sample and production stores remain separate.
- [ ] Session ceiling, account-wide daily cap, unavailable-provider fallback and stop switch work on the server/provider side.
- [ ] Keyboard access, mobile reading, visible call controls, labels, reduced motion and page performance are checked on the finished site.
- [ ] Existing URLs, contact destinations, privacy/terms pages and social links are verified before domain replacement.

Proposed quality targets are measurable during testing, not marketing claims: median speech-end to first audible response around two seconds where practical, no silent indefinite tool wait, and zero false booking confirmations in the agreed scenario suite. Record p50/p95 timing and network/device conditions; revise targets based on actual measurements.

## 9. Budget and scope decisions

Sarvam currently publishes PAYG at ₹3.50 per conversation minute, excluding GST, rounded per call to whole 60-second units. At that rate, 100 sessions lasting no more than three billable minutes each would be **₹1,050 in agent usage**, before taxes and other services. This is a planning example, not an account quote or spending authorization. Confirm browser billing, available credits and plan-specific tools first. n8n execution allowance, Hostinger plan changes and any future telephony/messaging are additional. [Sarvam pricing](https://docs.sarvam.ai/voice-agents/pricing).

The next implementation decision should be based on these items, without requesting more API keys in chat:

1. GitHub repository/account and visibility; private is the proposed default until the owner chooses.
2. Exact Hostinger plan and supported deployment method.
3. Managed Voice Agents workspace access, appropriate credentials and two available agent slots/configurations.
4. Approved sample property inventory, clinic services, doctor directory and schedule examples.
5. Desired voices, recording/retention choice and demo spending limit.
6. Before configuring and releasing the healthcare demo: who owns qualified clinical review of emergency and clinical-question wording in both languages. For the later pilot: chosen GoHighLevel location/calendars and field mapping, staff handoff recipient/hours and operational approval. The CRM provider choice is now settled; account configuration is not verified.

**Recommended next step after reviewing this plan:** confirm the scope and these account/data prerequisites, then prepare the original website design and precise agent specifications. Product implementation and live release have not begun.
