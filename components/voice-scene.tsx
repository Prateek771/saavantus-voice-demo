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
      <div className="voice-hero-inner">
        <div className="voice-hero-copy">
          <div className="voice-hero-topline">
            <p>Built for Indian businesses. Spoken in English & Hindi.</p>
          </div>
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
        <div className="voice-product-scene">
          <div className="hero-scene-controls">
            <MotionToggle />
          </div>
          <div className="hero-wave-field" aria-hidden="true">
            <svg viewBox="0 0 660 320" fill="none">
              <defs>
                <radialGradient id="hero-orb-light" cx=".3" cy=".24" r=".82">
                  <stop offset="0" stopColor="#526065" />
                  <stop offset=".38" stopColor="#27373c" />
                  <stop offset=".8" stopColor="#17242a" />
                  <stop offset="1" stopColor="#101b20" />
                </radialGradient>
                <linearGradient
                  id="hero-orb-edge"
                  x1="286"
                  y1="116"
                  x2="374"
                  y2="204"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#708083" stopOpacity=".45" />
                  <stop offset="1" stopColor="#17242a" stopOpacity="0" />
                </linearGradient>
              </defs>
              {Array.from({ length: 28 }, (_, line) => {
                const d = Array.from({ length: 133 }, (_, point) => {
                  const x = point * 5;
                  const envelope = Math.exp(-Math.pow((x - 330) / 165, 2));
                  const amplitude = (34 + line * 3.5) * envelope;
                  const y =
                    160 + Math.sin((x - 55) / 47 + line * 0.055) * amplitude;
                  return `${point ? "L" : "M"}${x} ${y.toFixed(2)}`;
                }).join(" ");
                return (
                  <path
                    key={line}
                    className="wave-ribbon"
                    d={d}
                    stroke="currentColor"
                    strokeWidth=".65"
                    opacity=".7"
                    style={
                      { "--wave-delay": `${line * -0.17}s` } as CSSProperties
                    }
                  />
                );
              })}
              {Array.from({ length: 51 }, (_, i) => {
                const x = 80 + i * 10;
                const envelope = Math.exp(-Math.pow((x - 330) / 190, 2));
                const height =
                  (12 + Math.pow(Math.sin(i * 0.66), 2) * 60) * envelope;
                return (
                  <path
                    key={i}
                    d={`M${x} ${160 - height / 2}v${height}`}
                    stroke="currentColor"
                    strokeWidth=".8"
                    opacity=".42"
                  />
                );
              })}
              <g className="hero-orb">
                <circle cx="330" cy="160" r="45" fill="url(#hero-orb-light)" />
                <circle
                  cx="330"
                  cy="160"
                  r="44.5"
                  stroke="url(#hero-orb-edge)"
                />
                <path
                  d="M307 134v53m8-62v71m9-77v82m10-81v80m10-72v63m10-51v39"
                  stroke="#da5a47"
                  strokeWidth=".8"
                  opacity=".25"
                />
              </g>
            </svg>
          </div>
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
