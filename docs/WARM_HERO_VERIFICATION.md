# Warm split hero verification

October 21, 2026. Implements the approved reference composition while preserving current product wording and functionality.

## Changes

- Homepage hero: left-aligned current copy and actions; right-side graphite orb with animated coral ribbons, quotation and existing enquiry details. Phone layout stacks the composition.
- Site palette: warm ivory, charcoal, coral actions and warm neutral surfaces. Outside the hero, CSS changes are limited to colors. All other page components, form handlers, voice logic, providers and environment configuration are unchanged.
- Two GPT-6.1 Sol workers implemented the independent hero and palette tasks; the integration owner reviewed source and browser output.

## Observed checks

- All 23 existing tests passed. TypeScript and production build passed. Impeccable detector returned no findings; Git whitespace check passed.
- Browser-rendered homepage and hero word inventories match the pre-change baseline exactly, including duplicate words. Source diff confirms other page copy is unchanged.
- Desktop 1440 x 1000 and phone 390 x 844 visual review: split/stacked hero, quote and details, property page and contact page. Healthcare and voice panel reviewed on desktop; shared footer also reviewed.
- Homepage document widths matched: desktop client/scroll 1430px, mobile client/scroll 380px. Property and contact phone widths also matched at 380px.
- Orb and ribbon transform matrices changed between observations. Pause motion set both animation play states to paused; resume worked. Offscreen hero set data-visible=false and paused the orb.
- Existing mobile navigation worked. Healthcare Start voice demo was disabled without consent and enabled with consent; checkbox was restored unchecked. No microphone session was started.
- Palette worker's contrast check: white/coral 5.97:1, body/paper 8.89:1, muted/paper 5.24:1, muted/soft 4.61:1. Existing semantic error/success colors are preserved.

## Limits

OS-level reduced-motion and background-tab behavior were reviewed in the existing CSS/provider paths, not newly exercised through system settings. No live audio-quality test, CRM write, booking, public deployment or credential change was part of this visual update.

Local preview: http://127.0.0.1:3100/
