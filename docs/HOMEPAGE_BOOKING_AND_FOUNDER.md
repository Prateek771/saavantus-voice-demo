# Homepage booking and founder update — 24 October 2026

Owner-approved scope: add the reviewed 30-minute Calendly section immediately
above the footer; add only a short vision/help summary and founder introduction,
with the founder's LinkedIn reference in the shared footer. No separate About page.
Preserve the particle hero, theme, industry pages and existing integrations.

The booking uses the public event at
https://calendly.com/mukesh-das-saavantus/30min. The trailing comma in the supplied
URL was punctuation and is excluded. A lazy iframe and always-visible external
link use Calendly's supported iframe method. No Calendly script, new package,
webhook, API credential or contact prefill is added. The calendar's controls and
optional internal scrolling are owned by Calendly; its cookie controls remain.
The CSP permits only the exact Calendly origin in frame-src, with existing
anti-framing and script restrictions preserved. Footer, privacy and terms now
distinguish real strategy bookings from simulated industry appointments.

The two-sentence founder biography uses the owner-supplied `Mukesh kumar das.pdf`
(pages 1–2): Mukesh Kumar Das is Founder & CEO; a former enterprise IT leader;
an AWS/AI author; and reports 25+ years in infrastructure, cloud migration and
transformation. No unsupported company results, client metrics or certifications
are added. The supplied LinkedIn profile could not be fetched publicly, so no
extra LinkedIn claims were inferred. Its owner-provided public URL is linked
with noopener/noreferrer. The private PDF itself is not copied into the site.

Verification: all 66 tests pass, including the amended CSP regression covering
the exact Maps and Calendly frame allowlist. The production build and explicit
TypeScript check pass. All 19 bounded local security HTTP checks pass after
restarting the verified server on 127.0.0.1:3100. No mail, assessment write,
voice session or actual calendar booking was created by these checks.

Browser review covered the default desktop viewport and a 390 × 844 mobile
override. The founder and calendar columns stack on mobile, with the calendar
remaining above 320px wide. Document scroll width equals viewport client width
on both layouts. The calendar renders available dates after client navigation
from Services; no CSP violations were captured. Footer href, target and rel
match the supplied LinkedIn URL and noopener/noreferrer. Desktop viewport was
restored. Screenshots are saved outside the repository in Documents/Codex.

The direct iframe uses Calendly's fixed-height method; selecting a date can
require internal scrolling to reach times and the booking form. The external
calendar link remains available. No auto-resize or booking-event tracking is
claimed, and no CRM/Sheets bridge for Calendly is implemented.
