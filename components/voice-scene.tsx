"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { Arrow } from "@/components/marketing";
import { LiquidSculpture } from "@/components/liquid-sculpture";
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
          <LiquidSculpture />
          <div className="hero-scene-controls">
            <MotionToggle />
          </div>
        </div>
        <div className="voice-hero-content">
          <div className="voice-hero-copy">
            <div className="voice-hero-topline">
              <p>Built for Indian businesses. Spoken in English & Hindi.</p>
            </div>
            <h1 id="voice-hero-title">
              <span className="hero-headline-line">
                Every enquiry has a story.
              </span>{" "}
              <span className="hero-headline-line">
                <em>Give it a next step.</em>
              </span>
            </h1>
          </div>
          <div className="voice-hero-aside">
            <p>
              Voice agents that listen, ask the right questions and turn
              everyday conversations into clear property enquiries and clinic
              appointment requests.
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
        </div>
        <div className="voice-product-scene">
          <div
            className="conversation-map"
            aria-label="Illustrative property enquiry moving from conversation to confirmed details and a next step"
          >
            <div className="conversation-source">
              <span className="map-label">A conversation begins</span>
              <div className="conversation-quote">
                <p>
                  “A 2 BHK in Whitefield. <br />
                  Sometime this weekend?”
                </p>
                <div className="voice-signal" aria-hidden="true">
                  {Array.from({ length: 7 }, (_, i) => (
                    <i
                      className="signal-bar"
                      key={i}
                      style={
                        {
                          height: `${8 + Math.pow(Math.sin(i * 0.7), 2) * 15}px`,
                          "--bar-delay": `${i * -0.14}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="conversation-details">
              <span className="map-label">
                The important details, confirmed
              </span>
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
        </div>
      </div>
    </section>
  );
}
