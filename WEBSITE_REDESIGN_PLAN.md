# Saavantus website redesign plan — October 21, 2026

## Authorization and outcome
The owner requested a new homepage composition, animated voice imagery, Lenis scrolling, stronger copy about the existing framework, a contact form replacing the workflow worksheet, and verified footer contact details. The owner explicitly asked the main chat to plan and coordinate while subagents implement. Preserve the existing Sarvam connection and private GitHub worktree. GoHighLevel contact and appointment integration follows this stage; no public deployment or live CRM/calendar writes in this change.

## Direction
- Replace split hero with a full-width illustrated conversation-to-result composition and overlaid headline. Animated voice waveform is illustrative; it does not imply microphone capture.
- Keep recognizable Saavantus identity (ivory, ink, vermilion, self-hosted typography). Make layout and hierarchy more distinctive.
- Explain existing SaaS 4A Framework exactly: Assess, Architect, Adjust, Automate. Show how conversation design, validation, integration and review deliver an operational handoff; no invented results or testimonials.
- Use Lenis for smooth desktop scrolling with native touch, reduced-motion fallback, safe anchors, readable content without JavaScript, and no interference with forms or voice transcripts. Pause decorative animation and stop offscreen work.
- Contact form collects business contact details, requirements, consent and optional preferred callback time in Asia/Kolkata. Save privately to ignored local server storage. Report a local request saved, never an email sent or appointment booked.
- Footer uses public contact information verified at https://saavantus.com/: support@saavantus.com, 08031686962, 9845718730. See content research notes for evidence.

## Work ownership
1. redesign_home: homepage, shared marketing copy, motion/Lenis, layout provider, design contract and dependency.
2. redesign_contact: validated contact form, local intake route/storage, tests, privacy/terms and intake documentation.
3. redesign_content: original-site research, framework copy guidance, shared navigation/footer and contact constants.
4. Main chat: scope, coordination, review, integrated checks, corrections, branch and preview handoff.

## GoHighLevel preparation
Use the existing GOHIGHLEVEL_PLAN.md as the source of field and calendar decisions. Website sales enquiries and property/clinic voice enquiries remain separate records. Retain stable request/session IDs, explicit consent, caller-confirmed values and source. A preferred callback time is not a confirmed calendar event. Later connection requires selected location and calendar, schema mapping, authorized scoped credentials and controlled synthetic checks. Avoid duplicate writes; preserve unrelated CRM history. Never infer marketing consent from microphone permission. Healthcare remains administrative; no clinical content belongs in the sales contact form.

## Completion checks
- Responsive homepage/contact/industry navigation; working existing voice panels.
- Form validation, consent, error recovery, durable local save, duplicate protection and request origin/body bounds; no outbound writes.
- Keyboard focus and native fields; readable content with reduced motion; animation pause behavior.
- Meaningful regression tests, TypeScript, production build and credential exclusion.
- One batched desktop/mobile visual review, consolidated fixes, at most one confirmation pass.
- Existing feat/local-demo branch saved/pushed; no main merge or public deployment.
