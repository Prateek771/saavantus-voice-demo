# Liquid sculpture hero

The user's October 21, 2026 correction replaces the mistaken Vesper video reference with the supplied Sculpture Hero by guglielmogiannattasio.it. The original WebGL2 flow map, GPU particle simulation, image sampling, cursor wake, liquid streaks and elastic return are retained. Material colors map to Saavantus deep coral, coral and ivory. No dependency or provider changes were needed.

## Composition and source

The artwork now spans the hero above a bottom row: exact existing headline on the left, supporting prose and existing actions on the right. Phones stack that content. Existing illustrative conversation details remain in a compact strip below. The rest of the homepage CSS, including responsive blocks, was compared directly against Git HEAD and is identical. The previous video and poster are removed; historical verification notes remain in Git history and documentation.

Original code supplied as `a6991710-c585-44d5-a610-e657c9986c13/Pasted text.txt`. Author attribution is retained in the source files.

Original assets, downloaded without modification and served locally:

- Desktop: https://cdn.21st.dev/assets/mirror/ae/ae8c3de9003460e59182e950ccd345f68f27f9d0e4808b64c92c962a4eca7120.webp (192,398 bytes; SHA256 matches filename).
- Mobile: https://cdn.21st.dev/assets/mirror/b0/b0c8d8e5d64b8cec906a3b390e3dc7c9a5af08334bf0632873c601782cb4bc46.webp (173,650 bytes; SHA256 matches filename).

## Verification

- All 23 existing functional regression tests pass.
- Final production build and TypeScript check pass.
- Impeccable checks report no findings on the changed presentation and engine files.
- Independent Sol source review found no remaining blocking shader or lifecycle issues.
- Desktop 1440x1000 and phone 390x844 reviewed in browser. Final phone content width and scroll width both 380 CSS pixels; desktop both 1430. Correct portrait source selected on phone.
- Browser reports WebGL rendering active. Pointer interaction changes the sculpture visibly and starts simulation; idle simulation stops.
- Pause shows the tinted static original with no running simulation. Resume initializes a fresh canvas, renders WebGL and accepts another pointer interaction.
- Fully offscreen sculpture reports simulation stopped.
- Homepage rendered word inventory matches the pre-change capture.
- Browser warning/error log empty during these checks.

## Runtime safeguards and limits

GPU initialization requires intersection, visible document and allowed motion. Pause and reduced motion use the static original. Context loss and unsupported WebGL use the same fallback. Contexts, listeners, observers and pending frames are cleaned up. The source's reversed-edge smoothstep was made well-defined without changing its intended edge fade.

Physical touch hardware, actual OS reduced-motion changes and forced context-loss testing were not exercised. These paths were source-reviewed. No live voice call or CRM action was required for this hero-only change.
