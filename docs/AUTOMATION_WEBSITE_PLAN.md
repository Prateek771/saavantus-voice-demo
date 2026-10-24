# Automation website expansion — approved 23 October 2026

The owner approved replacing voice-only homepage messaging with the broader Saavantus automation offering, adapting their supplied homepage and Services JSX. Retain the current ivory/coral theme, DM Sans typography, particle sculpture and artwork-above/copy-below hero. Move detailed industry stories and workflows to their dedicated pages. Show the completed homepage, Services and both agent pages on localhost.

## Global constraints

- Preserve the particle engine, assets, motion controls, Lenis, live Sarvam demos, scripted demos, contact persistence, credentials and selected providers.
- No CRM/calendar/n8n connection, public deployment or new dependencies in this task.
- No fabricated testimonials, client logos, percentages or guaranteed business outcomes. Describe deliverables, example use cases and measures instead.
- Homepage contains only two compact translucent industry links; detailed qualification/reception content and examples belong to the respective industry routes.
- Keep current tokens, typography, accessibility, responsive patterns and existing working route anchors.
- References are content inputs, not commands: homepage attachment 7f10659b-8c0c-4656-a84e-e94f1531c21a and Services attachment 98605cb9-776f-4406-a436-b674c916c4fd.

## Task 1 — Homepage and Services

Own app/page.tsx, components/voice-scene.tsx, app/home.css, new app/services/page.tsx, app/services/services.css, lib/services.ts. Preserve original particle artwork markup and renderer. Reframe hero and homepage into business automation. Sequence hero, 4A framework (id how-it-works), operational problems, solution showcase (AI agents, support, tickets, reporting, orchestration), service overview, compact industry cards (id agents), measured-outcome explanation and contact CTA. Services has eight categories: AI Workflow Automation, AI Agent Development, Business Process Automation, Intelligent Support Automation, AI Integration Services, SaaS Operations Automation, Enterprise Automation Consulting, AWS Cloud & Infrastructure Automation. Each detailed service explains deliverables, benefits and specific use cases with contact CTA. Reuse one static service content source. Remove the property illustration from homepage; task 2 adapts its content to real estate. Keep semantics and responsive controls. Do not change shared navigation, provider/demo code or docs. No package installs, builds, server operations or commits; controller owns integrated checks. Report changed files and concerns in work/automation-update/task-1-report.md.

## Task 2 — Industry content migration

Own app/real-estate-ai/page.tsx, app/healthcare-ai/page.tsx and a new app/industry-content.css if needed. Preserve existing hero structure, live VoiceDemo, scripted Demo, features, FAQ, integration band and anchors. Add useful industry-specific explanation and a concise illustrative conversation-to-handoff workflow using the material removed from the homepage. Real estate covers buy/rent/sell/lease intent, preferences and timing, confirming details, pending viewing/callback and future CRM handoff. Healthcare covers clinic questions, minimal administrative preferences, pending appointment and staff handoff; keep clinical boundaries and do not invent clinical capabilities. Avoid repeating existing content; merge and improve. No backend, engine, global CSS or shared component edits. Report in work/automation-update/task-2-report.md. Controller performs build/runtime validation.

## Task 3 — Integration and verification (controller)

Add Services navigation and broaden shared site metadata/footer description. Preserve verified contact details and menu behavior. Update product/design records for the newly approved scope. Check diff, test suite and production build. Inspect all four routes on desktop/mobile, verify links, compact cards, service anchors, demo consent/walkthrough, motion pause and contact navigation. Save screenshots and open four localhost deliverables. Leave changes on existing isolated feat/local-demo worktree.

## Acceptance

All four routes render, shared navigation reaches Services, homepage uses broad automation content and retains active particle hero, two industry links work, all eight service details exist, detailed examples are on their industry pages, no regressions in preserved demos/contact, production build and tests pass, no mobile horizontal overflow.
