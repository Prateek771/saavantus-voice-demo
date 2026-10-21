"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Arrow } from "@/components/marketing";
import { MotionToggle, useMotionState } from "@/components/motion-provider";

export function VoiceScene() {
  const scene = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const playbackAllowed = useRef(false);
  const { paused, reduced } = useMotionState();
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const visibility = () => setPageVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = window.IntersectionObserver
      ? new IntersectionObserver(([entry]) => {
          setInView(entry.isIntersecting);
          if (scene.current)
            scene.current.dataset.visible = String(entry.isIntersecting);
        })
      : undefined;
    if (scene.current) observer?.observe(scene.current);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let requestCurrent = true;
    const bounds = scene.current?.getBoundingClientRect();
    playbackAllowed.current =
      !paused &&
      !reduced &&
      inView &&
      pageVisible &&
      !mediaFailed &&
      !!bounds &&
      bounds.bottom > 0 &&
      bounds.top < window.innerHeight &&
      !document.hidden &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (playbackAllowed.current) {
      element.muted = true;
      void element
        .play()
        .then(() => {
          // A pending native play request may settle after a later pause.
          if (!playbackAllowed.current) element.pause();
        })
        .catch((error: unknown) => {
          if (
            requestCurrent &&
            playbackAllowed.current &&
            !(error instanceof DOMException && error.name === "AbortError")
          )
            setAutoplayBlocked(true);
        });
    } else {
      element.pause();
    }
    return () => {
      requestCurrent = false;
      playbackAllowed.current = false;
      element.pause();
    };
  }, [paused, reduced, inView, pageVisible, mediaFailed]);

  useEffect(() => {
    const root = scene.current;
    if (!root) return;
    const elements = Array.from(
      root.querySelectorAll<HTMLElement>(".hero-enter"),
    );
    const finish = (element: HTMLElement) =>
      element.classList.add("hero-is-in");
    if (
      paused ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach(finish);
      return;
    }
    root.dataset.entrance = "on";
    const handlers = elements.map((element) => {
      const complete = (event: AnimationEvent) => {
        if (event.target === element) finish(element);
      };
      element.addEventListener("animationend", complete);
      return () => element.removeEventListener("animationend", complete);
    });
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        elements.forEach((element) => {
          const active = element
            .getAnimations?.()
            .some(
              (animation) =>
                animation.playState === "running" ||
                animation.playState === "finished",
            );
          if (!active) finish(element);
        });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      handlers.forEach((remove) => remove());
    };
  }, [paused, reduced]);

  return (
    <section
      className="voice-hero"
      ref={scene}
      aria-labelledby="voice-hero-title"
    >
      <div className="voice-hero-inner">
        <div className="voice-hero-copy">
          <div className="voice-hero-topline hero-enter hero-enter-pop">
            <p>Built for Indian businesses. Spoken in English & Hindi.</p>
          </div>
          <h1 id="voice-hero-title">
            <span className="hero-headline-line">
              <span className="hero-enter hero-enter-mask hero-enter-first">
                Every enquiry has a story.
              </span>
            </span>{" "}
            <span className="hero-headline-line">
              <span className="hero-enter hero-enter-mask hero-enter-second">
                <em className="hero-enter hero-enter-em">
                  Give it a next step.
                </em>
              </span>
            </span>
          </h1>
          <p className="hero-enter hero-enter-soft">
            Voice agents that listen, ask the right questions and turn everyday
            conversations into clear property enquiries and clinic appointment
            requests.
          </p>
          <div className="voice-hero-actions">
            <a className="button hero-enter hero-enter-button" href="#agents">
              Talk to an agent <Arrow />
            </a>
            <Link
              className="hero-contact hero-enter hero-enter-side"
              href="/contact"
            >
              Build yours with us <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="voice-product-scene">
          <div className="hero-scene-controls">
            <MotionToggle />
          </div>
          <div
            className="hero-wave-field"
            data-static={
              reduced || mediaFailed || autoplayBlocked || !hasPlayed
            }
            aria-hidden="true"
          >
            <svg
              className="hero-media-filter"
              width="0"
              height="0"
              focusable="false"
            >
              <defs>
                <filter
                  id="saavantus-particle-tint"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  colorInterpolationFilters="sRGB"
                >
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncR type="table" tableValues="0.968627 0.854902" />
                    <feFuncG type="table" tableValues="0.956863 0.352941" />
                    <feFuncB type="table" tableValues="0.933333 0.278431" />
                    <feFuncA type="identity" />
                  </feComponentTransfer>
                </filter>
              </defs>
            </svg>
            <img
              className="hero-particle-poster"
              src="/media/saavantus-particle-wave-poster.jpg"
              alt=""
              width="1920"
              height="1080"
              decoding="async"
            />
            <video
              ref={video}
              className="hero-particle-video"
              src="/media/saavantus-particle-wave.mp4"
              poster="/media/saavantus-particle-wave-poster.jpg"
              width="1920"
              height="1080"
              preload={reduced ? "none" : "metadata"}
              muted
              loop
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              onPlaying={() => {
                if (!playbackAllowed.current) {
                  video.current?.pause();
                  return;
                }
                setHasPlayed(true);
                setAutoplayBlocked(false);
              }}
              onError={() => setMediaFailed(true)}
            />
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
