# Particle-wave hero verification

Date: 2026-10-21

## Scope

Replaced the decorative orb with the exact particle-wave video supplied in the user's Vesper animation reference. The clip is locally served, muted, looping at native speed, and tinted from grayscale into Saavantus ivory/coral. Added the reference's staggered headline, emphasis, body and button entrances. Existing homepage wording, links, split composition, other pages and provider functionality are preserved.

Source: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4

Local asset: public/media/saavantus-particle-wave.mp4

SHA256: 5A8C3D7D2F3AC04C2FE40774DAD05F14566FBD209127C42E87CDAA370D595959

Unmodified source is 9,488,614 bytes, 1920x1080, approximately 10.04 seconds. A JPEG frame at one second supplies the static fallback. Keeping the original footage preserves its movement and quality at the cost of a roughly 9.5 MB initial video transfer. Existing same-origin media CSP remains unchanged.

## Verified

- All 23 existing tests pass, including intake, scripted workflows, SDK lifecycle and Sarvam session proxy checks.
- Production build and its TypeScript check pass.
- Impeccable detector reports no findings for changed hero sources.
- Desktop 1440x1000 and phone 390x844 browser review: readable copy, existing controls, coral wave blended into ivory, no horizontal overflow.
- Homepage rendered word inventory matches the pre-change capture.
- Local video reaches readyState 4, plays at rate 1, muted and looping.
- Pause holds currentTime at 6.676407 across observations; resume continues playback.
- Scrolling the hero fully offscreen pauses video; returning to the hero resumes it.
- All seven entrance elements settle to opacity 1 with their completion class.
- Source review confirms poster fallback, reduced-motion handling, hidden-page handling, and cleanup of pending playback, observers and animation listeners.

## Limits

Actual OS reduced-motion changes, blocked-autoplay/media-error simulation and physical phone hardware were not exercised. No live voice session or external CRM action was needed for this presentation change. Screenshots are still frames; localhost shows the motion.
