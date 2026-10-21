"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { Arrow } from "@/components/marketing";
import { MotionToggle } from "@/components/motion-provider";

export function VoiceScene() {
  const scene = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!scene.current || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (scene.current)
        scene.current.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="voice-hero"
      ref={scene}
      aria-labelledby="voice-hero-title"
    >
      <div className="hero-wave-field" aria-hidden="true">
        <svg viewBox="0 0 1440 700" preserveAspectRatio="none" fill="none">
          {Array.from({ length: 20 }, (_, line) => {
            const d = Array.from({ length: 121 }, (_, point) => {
              const x = point * 12;
              const amplitude = 40 + 95 * Math.pow(Math.sin(x / 540), 2);
              const y =
                420 + Math.sin(x / 150 + line * 0.13) * amplitude + line * 4;
              return `${point ? "L" : "M"}${x} ${y.toFixed(2)}`;
            }).join(" ");
            return (
              <path
                key={line}
                className="wave-ribbon"
                d={d}
                stroke="currentColor"
                strokeWidth=".8"
                style={{ "--wave-delay": `${line * -0.17}s` } as CSSProperties}
              />
            );
          })}
        </svg>
      </div>
      <div className="voice-hero-topline">
        <p>Built for Indian businesses. Spoken in English & Hindi.</p>
        <MotionToggle />
      </div>
      <div className="voice-hero-copy">
        <h1 id="voice-hero-title">
          Every enquiry has a story.
          <br />
          <em>Give it a next step.</em>
        </h1>
        <p>
          Voice agents that listen, ask the right questions and turn everyday
          conversations into clear property enquiries and clinic appointment
          requests.
        </p>
        <div className="voice-hero-actions">
          <a className="button" href="#agents">
            Talk to an agent <Arrow />
          </a>
          <Link className="hero-contact" href="/contact">
            Build yours with us <Arrow diagonal />
          </Link>
        </div>
      </div>
      <div
        className="conversation-map"
        aria-label="Illustrative property enquiry moving from conversation to confirmed details and a next step"
      >
        <div className="conversation-source">
          <span className="map-label">A conversation begins</span>
          <p>
            “A 2 BHK in Whitefield. <br />
            Sometime this weekend?”
          </p>
          <div className="voice-signal" aria-hidden="true">
            {Array.from({ length: 27 }, (_, i) => (
              <i
                className="signal-bar"
                key={i}
                style={
                  {
                    height: `${8 + Math.pow(Math.sin(i * 0.7), 2) * 27}px`,
                    "--bar-delay": `${i * -0.14}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
        <span className="map-connector" aria-hidden="true">
          <Arrow />
        </span>
        <div className="conversation-details">
          <span className="map-label">The important details, confirmed</span>
          <dl>
            <div>
              <dt>Intent</dt>
              <dd>Buy a home</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Whitefield</dd>
            </div>
            <div>
              <dt>Preference</dt>
              <dd>2 BHK · Weekend</dd>
            </div>
          </dl>
        </div>
        <span className="map-connector" aria-hidden="true">
          <Arrow />
        </span>
        <div className="conversation-outcome">
          <span className="map-label">A clear next step</span>
          <p>
            A viewing request. <br />
            <em>Ready for a person.</em>
          </p>
          <span className="map-status">Requested · Not booked</span>
        </div>
      </div>
      <p className="hero-visual-note">
        Illustrative workflow · No microphone is active here
      </p>
    </section>
  );
}
