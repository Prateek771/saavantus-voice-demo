"use client";
import { useEffect, useRef, useId } from "react";
import { useMotionState } from "@/components/motion-provider";
import { createMotionClock } from "@/lib/clarity-clock.mjs";
import type { createLensRenderer } from "@/lib/clarity-lens-renderer";

export function ClarityLens() {
  const cropId = useId(),
    root = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<(() => void) | null>(null);
  const { paused, reduced } = useMotionState();
  const state = useRef({ paused, reduced });
  useEffect(() => {
    state.current = { paused, reduced };
    controller.current?.();
  }, [paused, reduced]);
  useEffect(() => {
    const element = root.current,
      surface = canvas.current;
    if (!element || !surface) return;
    let renderer: ReturnType<typeof createLensRenderer> | undefined,
      clock: ReturnType<typeof createMotionClock> | undefined;
    let visible = false,
      failed = false,
      disposed = false,
      loading = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)"),
      finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const area = element.closest(".voice-hero") || element.parentElement!;
    const active = () =>
      visible &&
      !document.hidden &&
      !state.current.paused &&
      !state.current.reduced &&
      !preference.matches &&
      !failed &&
      !disposed;
    const fail = () => {
      failed = true;
      clock?.dispose();
      renderer?.dispose();
      clock = undefined;
      renderer = undefined;
      element.dataset.renderer = "poster";
      element.dataset.running = "false";
      surface.style.opacity = "0";
    };
    const sync = () => {
      if (disposed) return;
      if (active() && !renderer && !loading) {
        loading = true;
        void import("@/lib/clarity-lens-renderer")
          .then((module) => {
            loading = false;
            if (!active()) return;
            try {
              renderer = module.createLensRenderer(surface);
              const rect = element.getBoundingClientRect();
              renderer.resize(rect.width, rect.height);
              let sampleStart = performance.now(),
                sampleFrames = 0;
              clock = createMotionClock(
                (t) => {
                  renderer?.draw(t);
                  element.dataset.time = t.toFixed(2);
                  sampleFrames++;
                  const now = performance.now();
                  if (now - sampleStart >= 1000) {
                    element.dataset.fps = (
                      (sampleFrames * 1000) /
                      (now - sampleStart)
                    ).toFixed(1);
                    sampleFrames = 0;
                    sampleStart = now;
                  }
                },
                requestAnimationFrame,
                cancelAnimationFrame,
                1000 / 30,
              );
              element.dataset.renderer = "live-3d";
              surface.style.opacity = "1";
              sync();
            } catch {
              fail();
            }
          })
          .catch(() => {
            if (!disposed) fail();
          });
      }
      clock?.setActive(active());
      element.dataset.running = String(active() && !!renderer);
      if (!active()) {
        renderer?.setPointer(0, 0, false);
        element.dataset.pointer = "idle";
      }
    };
    const move = (event: Event) => {
      const e = event as PointerEvent,
        rect = element.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      const hover =
        active() && finePointer.matches && e.pointerType !== "touch" && inside;
      renderer?.setPointer(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((e.clientY - rect.top) / rect.height) * 2,
        hover,
      );
      element.dataset.pointer = hover ? "active" : "idle";
    };
    const leave = () => {
      renderer?.setPointer(0, 0, false);
      element.dataset.pointer = "idle";
    };
    controller.current = sync;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersection.observe(element);
    const resize = new ResizeObserver(() => {
      if (renderer && !failed) {
        const rect = element.getBoundingClientRect();
        renderer.resize(rect.width, rect.height);
      }
    });
    resize.observe(element);
    const lost = (e: Event) => {
      e.preventDefault();
      fail();
    };
    surface.addEventListener("webglcontextlost", lost);
    area.addEventListener("pointermove", move, { passive: true });
    area.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      disposed = true;
      controller.current = null;
      intersection.disconnect();
      resize.disconnect();
      surface.removeEventListener("webglcontextlost", lost);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      clock?.dispose();
      renderer?.dispose();
    };
  }, []);
  return (
    <div
      ref={root}
      className="clarity-lens"
      data-renderer="poster"
      aria-hidden="true"
      style={{
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100vw - 12px)",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        maskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
    >
      <svg
        viewBox="0 115 1586 480"
        width="100%"
        height="100%"
        focusable="false"
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        <defs>
          <clipPath id={cropId}>
            <rect x="0" y="115" width="1586" height="480" />
          </clipPath>
        </defs>
        <image
          href="/art/clarity-lens-reference.png"
          width="1586"
          height="992"
          clipPath={`url(#${cropId})`}
        />
      </svg>
      <canvas
        ref={canvas}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          opacity: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, var(--paper), transparent 9%, transparent 89%, var(--paper))",
        }}
      />
    </div>
  );
}
