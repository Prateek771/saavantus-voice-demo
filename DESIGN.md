# Saavantus design system

Authority: the owner-approved October 23, 2026 expansion changes homepage and Services messaging to Saavantus's broader automation offering. Keep the interactive liquid-particle sculpture, artwork-above/copy-below composition, warm ivory/coral palette and current typography. Adapt the supplied legacy site's content into this visual world. Detailed voice-agent content lives on the respective industry pages, reached through two compact translucent homepage links. Product facts and existing live Sarvam behavior stay authoritative in PRODUCT.md.

## Visual direction

Use warm ivory surfaces, deep neutral text and coral actions consistently across the homepage, Services, industry pages, contact, legal routes, navigation, footer and demos. Keep the existing self-hosted DM Sans typography, precise controls, fine borders and readable structured enquiry examples. The supplied Sculpture Hero governs the retained homepage artwork and composition. Earlier Aqua Voice exploration remains historical inspiration for restraint.

The homepage hero gives the supplied liquid sculpture a wide artwork band above the copy. Below it, a business automation headline sits left and supporting copy and actions sit right, stacking naturally on phones. Preserve the supplied pixel-sampled WebGL simulation: cursor and touch disturb the material, which settles back into the original sculpture. Keep its ivory/coral coloring. The property conversation example belongs on the real estate page. This decorative interaction does not indicate live microphone activity. Retain existing spacing, typography, colors and interactions as the new sections are composed.

## Shared tokens

| CSS token      | Value        | Use                                    |
| -------------- | ------------ | -------------------------------------- |
| `--paper`      | `#f7f4ee`    | Page canvas                            |
| `--white`      | `#fffdf9`    | Form and product surfaces              |
| `--soft`       | `#f0e4dc`    | Quiet section bands and sample details |
| `--ink`        | `#17242a`    | Headlines and primary information      |
| `--body`       | `#39464b`    | Supporting prose                       |
| `--muted`      | `#60676b`    | Captions, labels, secondary metadata   |
| `--line`       | `#dfdad2`    | Fine borders and dividers              |
| `--red`        | `#b83223`    | Buttons, links, focus, active states   |
| `--blue`       | `var(--red)` | Compatibility alias for coral actions  |
| `--accent`     | `#da5a47`    | Decorative waveform geometry           |
| `--error`      | `#b42332`    | Errors requiring attention             |
| `--error-soft` | `#fff1f2`    | Error surface                          |
| `--success`    | `#237154`    | Confirmed success state                |
| `--radius`     | `16px`       | Major product surfaces                 |

`--blue` is a compatibility alias for the coral `--red` action token. Neither action token is a semantic error color. Existing semantic error and success colors remain unchanged. New error selectors use the error tokens explicitly. Never blanket-force descendant colors to implement the theme; each component assigns its semantic text and surface roles.

## Typography and rhythm

Self-hosted DM Sans is the only Latin family. Headlines use weight 300, body 400, controls and labels 500, and selected compact emphasis 600. Noto Sans Devanagari remains the Hindi fallback. The desktop homepage headline is fluid up to 88px; page and section headings step down to 40–56px, supporting headings 24–35px and body 16–18px. Headline leading is approximately 1.08–1.15 with restrained tracking, never below -0.04em. Small text remains at readable weight and contrast. `em` uses the same sans family with normal style, with weight 400 or coral emphasis where the component calls for it; no serif italic phrases remain.

The main page grid is 1200px of content inside a 1256px container, with 28px desktop gutters and 22px mobile gutters. Page-level spacing is generous: about 96–116px between major sections, 52–66px on phones. Compact related controls and metadata stay together. Prose usually measures 55–70 characters. Large editorial headings earn their hierarchy without decorative kicker labels.

## Components and interaction

- Buttons use an 8px radius and at least 44px height; primary actions use white text on deep coral. Secondary actions are quiet outlined or text controls. Hover and keyboard focus remain obvious.
- Forms, native selects and transcripts use light surfaces, readable text, honest labels and visible boundaries. Inputs retain native interaction. Selection, caret, focus and scrollbars use the same palette.
- Product demos and result panels are warm white or soft warm neutral. Real estate and healthcare share the same visual language and readable information structure. Do not use dark result panels, dark hero blocks or a dark footer.
- Use fine borders as the default separation. Apply a subtle offset, blurred shadow only where real elevation is needed. Avoid glows, heavy gradients, decorative glass, pills for primary buttons and excessive nested cards.
- Use the existing outlined SVG icon vocabulary. The hero uses the supplied WebGL2 liquid-particle engine with its original desktop and mobile sculpture images served locally; a tinted static image remains available without WebGL. Other waveform diagrams retain their authored SVG geometry.
- Keep sample data, pending requests, real voice connectivity and unconnected CRM/calendar operations clearly distinguished. Never add fabricated customer logos, testimonials, statistics or outcomes.

## Page composition

**Homepage:** the sculpture-above, copy-below hero introduces business automation. The SaaS 4A Framework (Assess, Architect, Adjust, Automate) explains delivery, followed by operational problems, practical solution showcases, eight service summaries, two compact translucent industry links and a plain explanation of outcomes to measure. A soft warm-neutral contact invitation closes the page before the light footer. Translucency is reserved for the two industry links explicitly requested by the owner; other sections use the existing editorial surfaces and fine rules.

**Services:** an editorial introduction and anchored service index lead to eight service sections. Each explains deliverables, business benefits and concrete use cases, with a contact action. Consolidate AWS provisioning and cloud operations into one offering. Use restrained, readable rows and responsive columns in the existing visual system; no unverified performance guarantees or client results.

**Real estate:** introduce the concrete property enquiry role, then let the visitor try the live voice agent or scripted walkthrough. Sample preferences and the resulting enquiry remain legible on light panels. Follow with the role's workflow, boundaries and a relevant contact action.

**Healthcare:** match the real estate page's hierarchy and controls while preserving administrative scope, appointment-request wording and the boundary around clinical decisions. Requested availability is not a confirmed booking. Keep the demo and its result equally readable.

**Contact:** a clear brief and locally saved intake form. The visitor can understand where the information goes and what remains unconnected. The footer uses the verified business contact details, light canvas, restrained coral links and fine rules. Legal routes use the same typography and palette.

## Motion and access

The supplied liquid sculpture is the hero's focal interaction. It rests as a crisp image, responds to cursor/touch with liquid particles and settles when released. The mistaken video and its staged entrances are superseded. Copy remains visible without animation. Pause motion, reduced-motion preference, background-tab suspension and offscreen state gate animation and pointer simulation. A static version of the same image preserves the composition when WebGL is unavailable or motion is reduced. Preserve Lenis, native touch scrolling, anchors, form interaction, transcript scrolling and cleanup.

Desktop and phone must be reviewed as complete shells, including header, menu, footer, demo controls and form states. Check real copy wrapping, keyboard focus, horizontal overflow and contrast; a successful build alone is not visual approval.

## Brief design history

Earlier local iterations explored a dark conversation canvas, a near-white/blue palette, a split waveform hero and a video reference. The current warm ivory/coral liquid sculpture supersedes those visual directions. The October 23 expansion broadens homepage copy and adds Services while preserving existing demo behavior.

## Approved brand and AI Discovery refinement — October 23

The full customer-facing name is Saavantus Excellence. Use the owner's selected muted blue logo (public/saavantus-excellence-logo.png), including its S symbol and full lettering, in the header and footer. Its image is framed to remove excess presentation margins and blended into the warm ivory surface without redesigning the mark. Logo blue is local to branding; retain coral controls and current typography/particle hero. Replace the homepage framework with AI Discovery and use /ai-discovery for the guided assessment. This page is an Operate surface: clear question groups, visible progress, local-only state, accessible validation, transparent scoring and evidence coverage.
