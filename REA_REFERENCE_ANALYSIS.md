# REA public website investigation — 21 October 2026

## What this means for Saavantus's design

The review combines the earlier live browser inspection with the new REA analysis of shipped public JavaScript. Visual findings come from browser/page evidence; code findings below identify REA observations separately from manual source inspection. The result informs an original design, not a clone of either business.

| Reference | Observable design and conversion pattern | Applied to the Saavantus concepts |
|---|---|---|
| [TechifyAI](https://www.techifyai.xyz/) | Dark editorial presentation, contrasting serif/sans typography, distinctive animated hero, detailed problem/system/outcome narratives, proof and diagnostic flow. Shipped code also contains stateful booking and proof-video components. | Large, specific headlines; one memorable acoustic visual; clear intent-to-result storytelling. Use warm Saavantus colours and original imagery. Leave the large agency service catalogue, paid diagnostic funnel and unverified guarantees out of this first release. |
| [FutureFlow](https://www.futureflowai.co.uk/) | Light purple presentation, concise voice-agent positioning, persistent call entry, grouped features and a short process. Its shipped code provides a call lifecycle scaffold. | Make the demo easy to find; give each industry its own visible start control; specify connecting, active, ended and error states. Add a concrete record preview so buyers see what the conversation produces. |
| [Existing Saavantus](https://saavantus.com/) | Cream/red identity and industry routes, but broader automation positioning and claims not verified in this project. | Retain the brand's warmth and useful route names; lead with the two products, exact use cases and honest sample labels. |

**The original contribution:** each demo pairs a conversation with a structured GoHighLevel-shaped handoff. No evidence collected here establishes that either reference implements this same interaction. The new designs are in [the design and copy review](WEBSITE_DESIGN_AND_COPY.md).

The new source remains in your GitHub; Hostinger remains the deployment destination. Observing FutureFlow's Vapi client does not change your Sarvam/n8n choice.

## Technical investigation

Authentic REA CLI static analysis completed successfully for both requested websites. This is shipped-browser-code inspection, not backend recovery, a live voice test, or independent verification of marketing claims. No forms, calls, conversations, authentication, vulnerability probes, or product connections were performed.

## Evidence and method

The installed `reverse-engineer-anything` skill was applied using its local JavaScript CLI fallback. Skill source revision: `f5410bdc4c86de564ddb24f24df86c41cfdd8bec`. Runtime: **rea-agents 6.7.0**, Node **24.11.1**. The npm archive's SHA-512 matched the registry integrity value. Its public launcher, package scripts, command routing/configuration, JavaScript analysis entrypoint and source-analysis worker were inspected before execution. This was a targeted review of the invoked path, not a comprehensive security audit of the complete npm dependency tree or its bundled native controls.

Runtime and 173 dependencies were installed only under `work/rea-public-sites/runtime/package`, using `--ignore-scripts --omit=dev --no-audit --no-fund`, workspace npm cache and isolated npm configuration paths. No global install, MCP registration, engine installation, profile configuration, or approval-policy change occurred. Corrected successful REA runs used the existing sandbox and an explicit environment-key allowlist.

Only the two public homepages and directly referenced script/module-preload URLs were downloaded with ordinary HTTPS GET. All 15 Techify and 11 FutureFlow directly referenced external scripts were captured, plus inline script text. The 18-external-asset safety cap was not reached. No source-map fetch or recursive import crawl was performed. Downloaded website JavaScript was parsed as inert text and never executed.

First REA attempts returned authentic partial Evidence with `EPERM` at `source-transfer` when using the Windows sandbox's default private temporary directory. Changing only the child process TEMP/TMP to `work/rea-public-sites/runtime-temp` resolved the failure. Both corrected runs exited **0**, with no parse failures. First-attempt files are retained with `-attempt1` suffixes; no elevation or sandbox weakening was needed to run REA.

| Site | Capture | REA selected scope | Actual result |
|---|---|---|---|
| [TechifyAI](https://www.techifyai.xyz/) | 27 HTML/JS files | 5 application-rich bundles, 337,279 source bytes | 5 JS files parsed, 78,485 AST nodes visited, 0 parse failures. REA recovered 0 bundler factory modules from this Turbopack input. |
| [FutureFlow](https://www.futureflowai.co.uk/) | 20 HTML/JS files | 3 bundles covering voice integration, layout and homepage, 96,379 source bytes | 3 JS files parsed, 25,524 AST nodes visited, 28 webpack modules recovered, 0 parse failures. |

Both semantic graphs are explicitly **partial/truncated**, with resource limits of 15,000 total semantic nodes, 4,000 nodes per file, 3,000 total unknown records, 1,000 unknowns per file, 512 MiB worker heap and a 60-second deadline per selected source. Unselected sources remain unknown. Successful exit does not mean complete application reconstruction.

Full Evidence and compact projections:

The review copies are [Techify evidence summary](research/techify-evidence-summary.json), [FutureFlow evidence summary](research/futureflow-evidence-summary.json), [Techify URL/hash manifest](research/techify-capture-manifest.json), and [FutureFlow URL/hash manifest](research/futureflow-capture-manifest.json). The full raw Evidence and captured sources remain in the task's work directory; the paths below identify those audit files rather than deliverable links.

- `work/rea-public-sites/techify-rea-evidence.json` — Evidence `ev_5b1df985737193ba31268e20b73ca44553a792270f007806e91e3ad71a7c5c44`; captured-directory identity `d0b3c45e825e631ac54f77ac15f68762831db42949b1296ebc9b41ef4c76a6e3`.
- `work/rea-public-sites/futureflow-rea-evidence.json` — Evidence `ev_101dc2d144e72bdb71e075c7d49e25dd88618c62dd2eb0f47d9f3f1d2f93c3e9`; captured-directory identity `f9e4dd31bac082bdd5480704c55ad7cec763d819fcd7abecd724ffc66b502e47`.
- `*-compact-evidence.json` retains original Evidence IDs, scope, actual statistics, graph coverage and selected listener/timer observations. These are local projections of the full REA records, not additional REA analyses.
- `techify-capture-manifest.json` and `futureflow-capture-manifest.json` map every local file to its public URL, capture timestamp, byte count and SHA-256. `*-run-metadata.json` preserves the actual command, exit code and environment-key allowlist. `cli-schema.json` preserves the invoked runtime's command schema.

Directory digests identify the locally captured set, not the complete remote website or its server build. Local asset filenames were normalized to `asset-NN.js`; manifests preserve their original URLs and byte identities. This capture does not reproduce the original deployment directory structure, so original relative file relationships are not assumed to resolve locally.

## FutureFlow: actual voice interaction scaffold

**REA observation:** the layout bundle contains listener registrations for `call-start`, `call-end` and `error`, corresponding listener cleanup, and a 3,000 ms timer. These are source-bound semantic nodes, not behavior observed during a call. The call-start listener is `jsrg_node_9717212d106ec0f1d3cdf22d90f7b72cf6c4021ec25182dda442b4e23c356cfa` at `asset-06.js` line 1 column 2662. The reset timer is `jsrg_node_606258792636cf7ce7a77d25f1c0dbdef11a5b4bcc2f8493d0ec8211c3efe984` at line 1 columns 2558–2599.

**Corroborating manual inspection of the captured source:** `asset-05.js` includes Vapi client code and `https://api.vapi.ai`; `asset-06.js` constructs the client, calls its start/stop methods, maintains INACTIVE → CONNECTING → ACTIVE → FINISHED display states, disables starting while connecting/active, and resets after an end event. Its inspected error callback logs to the console; that callback alone does not show a user-facing recovery message. This is evidence of an implemented front-end integration scaffold. It does not establish successful calls, current account configuration, assistant quality, latency, permissions, operational availability or backend integrations. Public client/assistant identifiers were not copied into this report or used to initiate calls.

The original layout URL is [layout-9cdf84f15b64f8e0.js](https://www.futureflowai.co.uk/_next/static/chunks/app/layout-9cdf84f15b64f8e0.js), captured SHA-256 `e47814c65a10cb327c28611a1a765ca1922b2917ca2b87090803d6b88975e03d`.

**Planning implication:** copy the interaction discipline: explicit start, visible connection state, active/end controls, disabled duplicate starts, end-state reset, cleanup and a clear failure/retry path. Keep the user's Sarvam/n8n provider choice. FutureFlow's Vapi implementation is an observation about that site, not a recommendation or authorization to replace providers.

**Critical interpretation limit:** REA also found many path-like strings in the bundled SDK, including generic platform features. These are library inventory, not a map of FutureFlow's server endpoints or proof it implements every SDK feature. No endpoint was replayed or probed.

## TechifyAI: conversion and proof components

**REA observation:** five selected bundles parsed successfully and yielded source-level semantic graphs, but its bundler factory reconstruction reported 0 modules. The inputs use Turbopack syntax. Accordingly, no complete component/import graph or call chain is claimed. Twenty-two captured files were outside selected-source analysis, and the bounded semantic graph contains explicit unknowns.

REA's four endpoint candidates also illustrate a false-positive boundary: one is the image path `/_next/image`, while three come from properties named `route` whose values are human labels such as documentation request, partnership and press. Treating these as reachable API endpoints would be incorrect.

**Corroborating manual inspection of captured shipped source:** `asset-07.js` contains interactive cards and diagnostic/contact content; `asset-08.js` contains a video-testimonial overlay with an explicit close control and responsive media sizing; `asset-10.js` contains a booking calendar with selectable dates/time slots, selected-state accessibility attributes, disabled progression until prerequisites exist and submit/loading handling. `asset-06.js`/`asset-11.js` include diagnostic-pricing content and a Stripe-hosted URL. None of this verifies booking availability, payment completion, testimonial authenticity, the business results claimed, or backend behavior. An ElevenLabs name in the icon inventory is only a brand asset, not proof of an active ElevenLabs integration.

Source URLs and exact captured hashes are in the Techify manifest. For the booking component, the original bundle is [2e65xq6kui-o2.js](https://www.techifyai.xyz/_next/static/immutable/chunks/2e65xq6kui-o2.js). Its component display name in the shipped source is `BookingSlotCalendar`; useful source spans include selected time-slot handling around character 18,000 and submit/loading handling around character 20,065 (manual string positions, not REA byte offsets).

**Planning implication:** adopt progressive disclosure and proof-on-demand: let people inspect one concrete agent scenario, open a focused proof item, then choose the next step. Include disabled/loading/selection states and accessible dialog controls in the plan. A diagnostic calendar, payment funnel, icon catalog and extensive agency capability inventory add complexity before the user's two voice agents have demonstrated value; they are optional later flows.

## Resulting plan guidance and unresolved evidence

Use Techify's structured proof and careful component states with FutureFlow's clear voice-demo entry and call lifecycle. Plan an original flow: choose real-estate/healthcare scenario → deliberately start demo → see connection and active states → end/retry → inspect structured handoff output → request customization. The structured handoff output is a proposal for the user's product, not a capability established on either inspiration site by this analysis.

Keep privacy disclosure, microphone permission, supported language choice, loading/cancel/retry, session cleanup and truthful integration labels in the plan. Do not advertise appointment confirmation, calendar/CRM writes, transfers, multilingual quality or live demo readiness until separately implemented and verified. No product code, accounts, provider configuration or deployment was changed during this investigation.
