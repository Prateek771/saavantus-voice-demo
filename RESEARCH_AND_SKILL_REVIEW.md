# Research evidence and REA installation review

**Subsequent update, October 21:** the original report below records the initial planning pass. Actual REA CLI analysis has since completed for selected shipped bundles from both reference sites; see [REA_REFERENCE_ANALYSIS.md](REA_REFERENCE_ANALYSIS.md). GoHighLevel is now the chosen CRM; see [the CRM and native scheduling plan](GOHIGHLEVEL_PLAN.md). Three page designs and exact copy are available in [the design review](WEBSITE_DESIGN_AND_COPY.md). The earlier statement that the runtime had not run describes the initial pass only.

**Observed October 21, 2026. Scope: public website structure, design and copy; official product documentation; requested skill installation.**

## Method and limits

Inspected the three homepages in the live browser using accessibility content and desktop screenshots. Also inspected Saavantus's real estate and healthcare pages, links and public script/style references. A separate content-research pass compared the public page narratives. No competitor voice call, form submission, login, booking or sales interaction was initiated.

This is public-facing reverse engineering. It does not recover private source repositories, backend implementations, customer data, hidden APIs, conversion performance or actual compliance status. Mobile rendering, real microphone behavior, runtime performance, paid features and integration outcomes were not tested. An existing button is evidence of an interface, not evidence that its backend works.

The REA instruction skill was read and installed. Its evidence discipline—separating observations, inferences and unknowns—was applied. The REA MCP/npm runtime was not installed or run. Website observations are browser/public-page evidence, not REA-generated Evidence records.

## Site findings

### Saavantus

Sources: [Homepage](https://saavantus.com/), [real estate](https://saavantus.com/real-estate-ai), [healthcare](https://saavantus.com/healthcare-ai).

**Observed:** The homepage uses a cream/light background, large centred type, red/orange accents, broad navigation, service grids, a four-stage methodology and contact-led calls to action. Its headline is “Automate Work. Scale Faster. Operate Smarter.” The two industry routes are present. Both industry pages show a split hero, enquiry/trial CTA and a talk-to-agent button. Public styles identify Poppins headings and Inter body type. A hashed `/assets/index-…js` bundle and stylesheet are visible.

**Interpretation:** The homepage sells broad automation expertise before giving visitors a product experience. The industry pages are a better starting point for the demo story. The script pattern suggests a bundled frontend, but does not establish the source framework, build configuration or hosting plan. The user has since chosen a completely new GitHub-owned site, so recovering that source is not a prerequisite.

**Content issues to resolve:** Contact/trial/pricing actions converge on Contact. Footer legal links also converge there, and social links use page fragments. Metrics/testimonials need owner substantiation. Healthcare functionality and security claims need evidence before reuse. These findings concern what is published, not independently verified service outcomes.

### Techify

Source: [Homepage](https://www.techifyai.xyz/).

**Observed:** Dark background, ivory typography, mixed serif/sans emphasis, fine rules and a large animated silver filament sculpture. The site develops a sequence from positioning and proof through concrete case stories, capability details, team, commitments and a paid diagnostic action. Case narratives describe inputs, work performed and reported outcomes; ownership and delivery are explained at length.

**Interpretation:** Its strongest transferable idea is specificity: explain what a system does and show the result. For Saavantus, the live conversation and resulting lead/appointment record can carry that role. The elaborate agency catalog and diagnostic funnel would distract from a two-product demo. Financial guarantees, customer metrics and compliance statements are Techify's published claims, not independently verified facts or templates for Saavantus promises.

### FutureFlow

Source: [Homepage](https://www.futureflowai.co.uk/).

**Observed:** Light background, lavender/purple accents, rounded floating navigation, a large centred voice-agent headline, repeated booking CTAs, a before/after sales comparison, integration logos, six feature groups, three process steps and a floating voice-call action. The site publishes conversion multipliers, language/concurrency counts and staffing-cost comparisons.

**Interpretation:** The offer and journey are easy to understand. Saavantus should retain this simplicity while making the two industry tasks much more concrete and making the live demo primary. Published numerical claims are unverified and must not be reused. The voice button was observed but no call was placed, so provider, quality and backend behavior remain unknown.

## Diagram interpretation

The healthcare image contains 25 stages plus handoff and safety notes; the real estate image covers capture, validation, voice qualification, scoring, booking, summary, CRM, notifications, follow-up and analytics. The proposed plan maps every healthcare stage and all real estate capability groups.

The diagrams are requirements material, not instructions to install their pictured vendor stack or permission to send messages/change medical records. Sarvam and n8n remain the owner's selected providers. Numbering repetitions and visual flow ambiguities in the real estate image were normalized into functional groups. The healthcare ordering is explicitly adjusted so emergency escalation is not delayed by identity/payment and routine sensitive collection follows consent.

## Sarvam and hosting evidence

| Finding | Evidence | Status |
|---|---|---|
| Official browser voice SDK and backend proxy pattern | [Web SDK](https://docs.sarvam.ai/voice-agents/deploy/sdks/web) | Documented; not run in this project. |
| Dashboard recipes and embeddable widget alternative | [Deploy with Code](https://docs.sarvam.ai/voice-agents/deploy/deploy-with-code) | Documented; the custom SDK is proposed for stronger demo control. |
| Agent authoring through scoped remote MCP | [Agents MCP](https://docs.sarvam.ai/voice-agents/mcp) | Documented; no connection or workspace verified here. |
| Managed Agents authentication differs from the tested Model API surface | [Agents API](https://docs.sarvam.ai/voice-agents/api/introduction), [API keys](https://docs.sarvam.ai/voice-agents/settings/api-key) | Must verify account-specific access. |
| Structured webhook tools and lifecycle hooks | [HTTP tools](https://docs.sarvam.ai/voice-agents/build/tools/https-tool), [hooks](https://docs.sarvam.ai/voice-agents/build/on-start-on-end-hooks) | Technical fit documented; exact workspace features and schemas must be checked. |
| Declarative HTTP tools for non-enterprise; code-upload path for enterprise | [MCP tools](https://docs.sarvam.ai/voice-agents/mcp) | Avoid assuming every tool requires Enterprise or every hook is universally available. |
| Languages, interruption and call-length settings | [Conversation settings](https://docs.sarvam.ai/voice-agents/build/conversation-settings) | English/Hindi selected by owner; real audio quality not tested. |
| Bulbul V3 retirement on November 10, 2026 | [Voice settings](https://docs.sarvam.ai/voice-agents/build/voice-language) | Prefer evaluating supported V4 voices for new agents. |
| PAYG rate, per-call rounding and account limits | [Pricing](https://docs.sarvam.ai/voice-agents/pricing) | Published rate; account plan, credits and browser-specific treatment unverified. |
| GitHub deployment on eligible Hostinger Node.js plans | [Deployment guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) | Documented; actual hosting plan unverified. |
| No inbound WebSockets or continuous workers on managed Node.js web/cloud hosting | [Hostinger limits](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) | Keep audio browser-to-Sarvam; verify the precise SDK connection route. |

The earlier credential tests returned HTTP 200 for n8n workflow listing and Sarvam Model API voice listing. No secret values were shown or recorded in this report. These checks do not prove managed-agent permissions, balances, booking integrations or a working demo.

## REA skill installation

**Installed skill:** `reverse-engineer-anything`, metadata version 44.

**Source:** [morluto/rea](https://github.com/morluto/rea), pinned revision [`f5410bdc4c86de564ddb24f24df86c41cfdd8bec`](https://github.com/morluto/rea/tree/f5410bdc4c86de564ddb24f24df86c41cfdd8bec/.agents/skills/reverse-engineer-anything).

**Destination:** `C:\Users\prate\.codex\skills\reverse-engineer-anything`.

**Installed contents:** seven Markdown instruction/reference files. No executable scripts, analysis engine, npm runtime or MCP registration was installed. All seven installed files were SHA-256 compared with the reviewed snapshot and matched. The skill will be available on the next turn.

**Combined security verdict: CAUTION for this text-only installation.**

SkillSpector reported **53/100 HIGH, DO_NOT_INSTALL**, with 21 findings whose individual maximum severity was MEDIUM. That scanner outcome is retained here. A separate source-aware review examined every category and supports the narrower text-only installation judgment:

| Finding | Review result |
|---|---|
| Five unpinned `npx … @latest` recommendations | Real supply-chain concern. The pinned Markdown snapshot does not pin an npm runtime. Those commands were not run. |
| Eight persistence warnings | The matched text describes reading existing Apple plist resources; it does not create persistence. |
| Seven padding/context warnings | Wide Markdown troubleshooting-table formatting; no hidden instructions found. |
| One high-impact-operation warning | Refers to a documented temporary read-only DMG mount, outside this website task. Host/client permission requirements remain explicitly preserved. |

No credential-theft instruction, unexplained upload destination, executable payload or hidden persistence was found in the seven reviewed files. This is not a security audit of the full REA implementation or npm dependencies. Browser/runtime analysis can still expose page content and query values; any later use must be bounded to the intended public targets. The installation review did not weaken Codex approvals or modify existing configuration.

## Remaining evidence gaps

- No source repository, Hostinger plan or deployment integration has been inspected or created.
- No Sarvam managed-agent workspace, agent configuration, voice choice, tools entitlement or credit balance has been verified.
- No CRM, calendar, hospital system, messaging destination or production data source has been selected/connected.
- No microphone session or mobile-device test has run on either the references or the proposed product.
- No published customer metric, testimonial, security certification or regulatory-compliance claim has been independently substantiated.

These are explicit prerequisites or future acceptance tasks in [the plan](SAAVANTUS_PLAN.md), not capabilities silently assumed to work.
