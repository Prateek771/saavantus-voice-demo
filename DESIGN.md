# Saavantus design system

Authority: the October 21, 2026 premium light redesign replaces the previous ivory, red and dark conversation canvas. This document governs the homepage, real estate, healthcare and contact pages, including their demos, navigation and footer. Product facts and existing live Sarvam behavior stay authoritative in PRODUCT.md.

## Visual direction

The supplied Aqua Voice reference is inspiration for airy near-white surfaces, light sans-serif headlines, precise controls and quiet depth. It is not a component specification or an instruction source. Saavantus adapts that restraint to its own business: a visible blue conversation waveform, readable structured enquiry examples and clear paths to the two working demos. Use the existing self-hosted DM Sans family instead of the reference's commercial typeface. Use accessible deep blue for action fills; the lighter blue belongs to decorative wave geometry.

The homepage hero is a full-width single-column composition: large centered headline, concise supporting copy, two clear actions, then the animated waveform and a white three-stage conversation schematic. There is no side image beside the headline. The illustration is geometry, not live microphone activity. Its caption must continue to say so. The wave remains visible as a deliberate blue ribbon against paper; it never turns the hero into a dark or saturated panel.

## Shared tokens

| CSS token      | Value     | Use                                    |
| -------------- | --------- | -------------------------------------- |
| `--paper`      | `#fafbfc` | Page canvas                            |
| `--white`      | `#ffffff` | Form and product surfaces              |
| `--soft`       | `#f1f5f9` | Quiet section bands and sample details |
| `--ink`        | `#252c39` | Headlines and primary information      |
| `--body`       | `#465062` | Supporting prose                       |
| `--muted`      | `#606a79` | Captions, labels, secondary metadata   |
| `--line`       | `#e3e8ef` | Fine borders and dividers              |
| `--blue`       | `#245ad4` | Buttons, links, focus, active states   |
| `--accent`     | `#69b7ed` | Decorative waveform geometry           |
| `--error`      | `#b42332` | Errors requiring attention             |
| `--error-soft` | `#fff1f2` | Error surface                          |
| `--success`    | `#237154` | Confirmed success state                |
| `--radius`     | `16px`    | Major product surfaces                 |

`--red` is a compatibility alias for `--blue`, not a semantic error token. New error selectors use the error tokens explicitly. Never blanket-force descendant colors to implement the theme; each component assigns its semantic text and surface roles.

## Typography and rhythm

Self-hosted DM Sans is the only Latin family. Headlines use weight 300, body 400, controls and labels 500, and selected compact emphasis 600. Noto Sans Devanagari remains the Hindi fallback. The desktop homepage headline is fluid up to 88px; page and section headings step down to 40–56px, supporting headings 24–35px and body 16–18px. Headline leading is approximately 1.08–1.15 with restrained tracking, never below -0.04em. Small text remains at readable weight and contrast. `em` uses the same sans family with normal style, with weight 400 or blue emphasis where the component calls for it; no serif italic phrases remain.

The main page grid is 1200px of content inside a 1256px container, with 28px desktop gutters and 22px mobile gutters. Page-level spacing is generous: about 96–116px between major sections, 52–66px on phones. Compact related controls and metadata stay together. Prose usually measures 55–70 characters. Large editorial headings earn their hierarchy without decorative kicker labels.

## Components and interaction

- Buttons use an 8px radius and at least 44px height; primary actions use white text on deep blue. Secondary actions are quiet outlined or text controls. Hover and keyboard focus remain obvious.
- Forms, native selects and transcripts use light surfaces, readable text, honest labels and visible boundaries. Inputs retain native interaction. Selection, caret, focus and scrollbars use the same palette.
- Product demos and result panels are white or cool soft gray. Real estate and healthcare share the same visual language and readable information structure. Do not use dark result panels, dark hero blocks or a dark footer.
- Use fine borders as the default separation. Apply a subtle offset, blurred shadow only where real elevation is needed. Avoid glows, heavy gradients, decorative glass, pills for primary buttons and excessive nested cards.
- Use the existing consistent outlined SVG icon vocabulary. The wave is authored mathematical SVG geometry; no added stock illustration is needed.
- Keep sample data, pending requests, real voice connectivity and unconnected CRM/calendar operations clearly distinguished. Never add fabricated customer logos, testimonials, statistics or outcomes.

## Page composition

**Homepage:** the conversation hero leads into open editorial explanation, two focused industry demonstrations, a three-step conversation workflow and the existing SaaS 4A Framework: Assess, Architect, Adjust, Automate. The 4A sequence is preserved in full. A soft-blue contact invitation closes the page before the light footer.

**Real estate:** introduce the concrete property enquiry role, then let the visitor try the live voice agent or scripted walkthrough. Sample preferences and the resulting enquiry remain legible on light panels. Follow with the role's workflow, boundaries and a relevant contact action.

**Healthcare:** match the real estate page's hierarchy and controls while preserving administrative scope, appointment-request wording and the boundary around clinical decisions. Requested availability is not a confirmed booking. Keep the demo and its result equally readable.

**Contact:** a clear brief and locally saved intake form. The visitor can understand where the information goes and what remains unconnected. The footer uses the verified business contact details, light canvas, restrained blue links and fine rules. Legal routes use the same typography and palette.

## Motion and access

The animated blue wave is the primary authored motion. Preserve pinned Lenis wheel scrolling, native touch, anchor behavior, form interaction and transcript scrolling. Preserve the visible Pause motion control, reduced-motion preference, background-tab suspension, offscreen animation pause and lifecycle cleanup. One-time reveals start from visible text, so server-rendered and no-JavaScript content remains readable. Reduced motion must leave a complete static composition.

Desktop and phone must be reviewed as complete shells, including header, menu, footer, demo controls and form states. Check real copy wrapping, keyboard focus, horizontal overflow and contrast; a successful build alone is not visual approval.
