"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow } from "@/components/marketing";
import { ClarityLens } from "@/components/clarity-lens";
import { MotionToggle } from "@/components/motion-provider";

export function VoiceScene() {
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scene.current;
    if (!root || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="voice-hero"
      ref={scene}
      aria-labelledby="voice-hero-title"
    >
      <div className="voice-hero-inner">
        <div className="voice-hero-artwork">
          <ClarityLens />
          <div className="hero-scene-controls">
            <MotionToggle />
          </div>
        </div>
        <div className="voice-hero-content">
          <div className="voice-hero-copy">
            <h1 id="voice-hero-title">
              <span className="hero-headline-line">Automate the busywork.</span>{" "}
              <span className="hero-headline-line">
                <em>Make room for better work.</em>
              </span>
            </h1>
          </div>
          <div className="voice-hero-aside">
            <p>
              AI agents, connected workflows and cloud automation, designed
              around the way your business works. Give routine tasks a clear
              path and your team more room to focus.
            </p>
            <div className="voice-hero-actions">
              <Link className="button" href="/services">
                Explore services <Arrow />
              </Link>
              <Link className="hero-contact" href="/contact">
                Discuss your workflow <Arrow diagonal />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
