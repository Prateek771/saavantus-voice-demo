# Local preview implementation

Approved October 21, 2026: build the approved homepage and two agent pages locally; initialize Git/GitHub and an isolated worktree. Sarvam, n8n and GoHighLevel must remain disconnected.

## Completion contract

- A private GitHub repository and an isolated local worktree/feature branch.
- Next.js/TypeScript application matching the approved ivory, ink and vermilion designs.
- Homepage, real estate and healthcare routes, mobile navigation, truthful privacy/terms/contact previews.
- An interactive local walkthrough for each industry: English/Hindi scripts, step controls, editable fictional preferences, sample slot selection, result summary, simulated CRM record, reset and error recovery.
- No provider SDK, credential reads, external API calls, microphone request, real booking, message sending or deployment.
- Existing credential file preserved outside the app worktree. Blank ignored environment file plus tracked template in the worktree.
- Type check, meaningful workflow tests, production build, desktop/mobile browser review and independent code review.

## Work sequence

1. Repository/worktree and runnable foundation.
2. Shared visual system, three pages and local demo state model.
3. Integrated walkthrough, responsive/accessibility states and supporting routes.
4. Tests, visual review, fix pass, local launch and private GitHub branch push.

## Decisions and progress

- User approved the existing design; no new visual concept round is necessary.
- Default repository visibility: private, to keep unpublished product work private.
- This is a local simulation, not voice implementation. Keep the future Sarvam/n8n/GoHighLevel boundaries documented without stub endpoints that pretend to connect.
- Git CLI identity verified as Prateek771. Initial sandbox auth failure was network-related; network-enabled read-only authentication succeeded.
