"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import "lenis/dist/lenis.css";
import "@/app/motion.css";

const MotionContext = createContext({
  paused: false,
  reduced: false,
  toggle: () => {},
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = paused || reduced ? "off" : "on";
    const visibility = () => {
      root.dataset.pageHidden = String(document.hidden);
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      delete root.dataset.motion;
      delete root.dataset.pageHidden;
    };
  }, [paused, reduced]);

  useEffect(() => {
    if (
      paused ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let cancelled = false;
    let destroy: (() => void) | undefined;
    void import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          autoRaf: true,
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.13,
          anchors: { offset: -100 },
          stopInertiaOnNavigate: true,
          respectReducedMotion: true,
          prevent: (node) =>
            node.matches(
              "input, textarea, select, [data-lenis-prevent], .voice-transcript, .transcript",
            ),
        });
        destroy = () => lenis.destroy();
      })
      .catch(() => {
        /* Native scrolling remains available if enhancement fails. */
      });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [paused, reduced, pathname]);

  useEffect(() => {
    if (paused || reduced || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-entered");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname, paused, reduced]);

  return (
    <MotionContext.Provider
      value={{ paused, reduced, toggle: () => setPaused((value) => !value) }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function MotionToggle() {
  const { paused, reduced, toggle } = useContext(MotionContext);
  return (
    <button
      className="motion-toggle"
      type="button"
      onClick={toggle}
      disabled={reduced}
      aria-pressed={paused || reduced}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        {paused || reduced ? (
          <path d="m5 3 7 5-7 5V3Z" fill="currentColor" />
        ) : (
          <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
      {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
    </button>
  );
}
