# Live glass hero — 24 October 2026

Preview: http://127.0.0.1:3100/

## Current result

The active hero is a real Three.js scene, not the reference photograph with moving overlays. Five solid lenses use lathed biconvex geometry, rounded shoulders and polished optical edges. Clear faces refract the scene; edge shaders approximate internal reflection with warm/dark highlights. Procedural floor shadows and light streaks ground the lenses. Seventy-two strands move continuously and 144 particles travel through them. Fine-pointer movement subtly influences the camera, light, lens angle and strands. Artwork extends to the viewport edges with soft masks. Existing copy, content positions, CSS, buttons and hero height remain unchanged.

The earlier image-based implementation was superseded after the owner explicitly requested live animation. The supplied image now serves only as the loading/reduced-motion/unavailable-WebGL fallback. It is cropped to exclude the reference's header, copy and controls. Original LiquidSculpture code and assets remain intact.

## Implementation

- components/clarity-lens.tsx: lazy initialization, pointer response, pause, reduced motion, visibility and teardown.
- lib/clarity-lens-renderer.ts: procedural Three.js scene, baked lens dimensions, transmission, bevel shading, studio environment and floor caustic approximation.
- lib/clarity-clock.mjs and lib/clarity-flow.mjs: bounded motion scheduling and deterministic moving strands; declaration files alongside.
- tests/clarity-clock.test.mjs and tests/clarity-flow.test.mjs: scheduler lifecycle and convergence/motion tests.
- components/voice-scene.tsx: only the import and artwork component changed against the saved pre-task version.
- Dependencies added: three 0.186.1 and development types @types/three 0.186.0. Existing dependencies and SDK patches preserved.

## Verified

Production build and TypeScript compilation passed after the final bevel change. Full suite passed: 72 tests, zero failures before the final visual-only material grouping; final build includes type checking. Exact string comparison confirms voice-scene changed only its two artwork references. app/home.css SHA-256 equals the pre-task backup.

Desktop preview inspected at 1440x1000. The final live renderer reported 30.2 fps in a short visible-window sample; 30fps is the scheduling cap, not a guarantee across hardware. Earlier background captures were throttled to 1fps. Live renderer/time progression, pointer activation, stable paused time and resumed rendering were observed. At 390x844 the page width was 380px with no horizontal overflow; live renderer remained active. No runtime errors appeared in the final console error check. Earlier generated Three.js shaders emitted floating-point precision warnings, not compilation failures. Final desktop and mobile images are saved beside this report. Original viewport restored after review.

## Limits

This is a real-time visual approximation, not path-traced optical simulation or an exact match to the reference. The bevel reflection and floor caustics are artist-directed shaders; repeated physical refraction through five transmissive bodies is not simulated. Screenshots document composition, not continuous motion. Physical phones, GPU profiling, live reduced-motion changes and forced context-loss were not separately tested. Reduced-motion and failure handling retain a static fallback by design. No public deployment was performed.

## Revert

In components/voice-scene.tsx restore the LiquidSculpture import from @/components/liquid-sculpture and replace ClarityLens with LiquidSculpture. Rebuild and restart the verified local preview server. Avoid restoring unrelated files or resetting the checkout. The original source and CSS backups are in this task workspace's work/clarity-lens/previous directory. The preceding image-based variant is also saved in image-version.

## Final contrast and definition pass

Following the owner review, the renderer now uses full-resolution transmission, zero glass roughness, reduced optical displacement and 1.5x desktop supersampling (2142 drawing-buffer pixels across 1428 CSS pixels). This removes the previous downsampled refraction blur. The signal paths use 128 segments and richer copper/charcoal colors. Dark optical reflections, narrow warm highlights, rounded glass shoulders and stronger contact/caustic shading replace the pale material. The outgoing stream continues beyond the viewport. This remains live geometry, not an image plate.

The final production build including TypeScript passed. Six relevant scheduler/flow tests passed. CSS and hero-copy preservation were rechecked against the original backups. Desktop rendering at 1440x1000 measured 29.9 fps during the supersampled contrast pass; background browser throttling still affects some capture sessions. The preceding glass version is saved in work/clarity-lens/before-contrast. Real-time optics remain an approximation of the reference, not an exact photographic reproduction.

Final rounded-shoulder scene measured 30.0 fps in the visible browser at 1400x950. The 390x844 check showed pageWidth 380, live-3d and running=true; final console error inspection returned no errors. Hover activation and pause/resume were observed. Final screenshots: final-contrast-desktop.png and final-contrast-mobile.png.

## Surface refinement before repository consolidation
The final scene uses 56 smoother strands, per-lens elongated ring/contact shadows and seven warm caustic ridges per lens spreading toward the lower-right surface. The actual desktop screenshot confirms the shadows and streaks are visible. Production build and all 72 tests passed after integration; independent focused review found no actionable shader, resource or lifecycle issues. Evidence: final-surface-desktop.png.

## Final owner correction
The owner requested restoring the preceding root/strand animation. The final scene restores all 72 strands and their previous bend amplitudes, frequencies and timing. The new elongated ring shadows and warm caustics remain. Six motion tests and the production build including TypeScript passed after this correction. This supersedes the 56-strand simplification described above.
