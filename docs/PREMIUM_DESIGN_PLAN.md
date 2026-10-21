# Saavantus premium light design plan

## Approved direction and scope

Apply the user-supplied AquaVoice light reference as inspiration for Saavantus. Keep Saavantus product truth, its two industry roles and its selected providers. The reference establishes surface, typography, rhythm and restraint; it supplies no business claims or product behavior.

The four primary routes are `/`, `/real-estate-ai`, `/healthcare-ai` and `/contact`. Shared navigation, footer, `/privacy` and `/terms` must belong to the same website. This is a local presentation redesign. Deployment and new provider/account connections are outside scope.

## Shared framework

Use a paper canvas `#fafbfc`, ink `#252c39`, body text `#465062`, muted text `#606a79`, rules `#e3e8ef`, mist panels `#f1f5f9` and white `#ffffff`. Action blue is `#245ad4`; pale sky `#69b7ed` is decorative. Error text and invalid input borders use `#b42318` so they remain distinct from the brand color.

Self-hosted DM Sans carries the whole hierarchy: light display headings, regular body copy and medium labels. No italic serif emphasis. Use balanced headings, readable body measures, fine borders, 16px functional panels and 8px buttons with a minimum 44px target. Avoid dark hero, result or footer surfaces. Let spacing and type establish hierarchy.

Navigation stays consistent on all routes, with visible active links, a working mobile menu and keyboard focus. All business contact calls to action lead to `/contact`. Preserve the skip link and native anchors.

## Route composition

- **Homepage:** a full-width light voice-led introduction, an authored conversation visual, clear access to both roles, the concrete workflow and Saavantus's established Assess, Architect, Adjust, Automate framework. The decorative voice visual is not a live microphone indicator.
- **Real estate:** an industry-specific introduction, property enquiry conversation, preference/qualification handoff and an honest distinction between sample outcomes and live connected operations. Keep the voice demo and separate scripted walkthrough usable.
- **Healthcare:** the same editorial system with clinic reception content and administrative boundaries. Keep voice and walkthrough actions clear; no clinical advice or implied live appointment booking.
- **Contact:** a full-width heading and short introduction above a balanced form/assistance layout. The form takes visual priority; direct email and phone links remain in a quiet aside. Native inputs use compact labels, inline optional text, legible hints and clearly marked errors. Preserve every field and the existing required/optional rules.
- **Legal:** a shared, narrow reading layout with the same light headings and spacing. Preserve the existing data-handling and preview-scope disclosures.
- **Footer:** a light directory with brand context, product links, verified public contact details and subdued legal/preview information, separated by fine rules.

## Behavior and truth preserved

Sarvam voice sessions, server routes, signing, environment configuration and provider credentials do not change. n8n and GoHighLevel remain unconnected. No new dependency, fabricated customer result, testimonial or certification is introduced.

Contact submission still uses the existing API, validation, consent and local persistence. A success state appears only after the server confirms saving and returns a receipt. Confirmation continues to say that the enquiry is stored on this computer, has not been emailed or sent to GoHighLevel, and does not book an appointment. The verified email and phone links come from `lib/site-contact.ts` without alteration.

Preserve Lenis scrolling and its cleanup, native form/transcript interaction, reduced motion, visible motion pause and visible-by-default content. Decorative motion must not hide essential text or controls.

## Acceptance checks

Inspect all four primary routes plus both legal routes at desktop and phone sizes. Check full-page rhythm, form labels, long email wrapping, navigation, focus and overflow. Exercise the contact error state and confirmed local-save state with fictional data; confirm required/optional behavior and receipt truth. Recheck reduced motion and navigation between routes.

The integration owner runs the shared build, type and behavior checks once the parallel presentation changes are integrated. A source pass alone does not establish browser appearance, microphone quality, public deployment readiness or account integration.
