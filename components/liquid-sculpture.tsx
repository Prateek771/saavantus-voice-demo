"use client";

import { useEffect, useId, useRef } from "react";
import {
  LiquidEngine,
  type EngineOptions,
  type Rect,
} from "@/lib/liquid-engine";
import { useMotionState } from "@/components/motion-provider";

/** Artwork and GPU simulation by guglielmogiannattasio.it.
 * Adapted to Saavantus's palette and shared motion lifecycle; original pixels,
 * flow field, particle sampling, elastic return and cursor response retained.
 */
const OPTIONS: EngineOptions = {
  interactive: true,
  strength: 1,
  radius: 220,
  density: 1,
  dotSize: 1,
  spread: 1,
  turbulence: 1,
  liquid: 1,
  streaks: true,
  restStyle: "image",
  returnSpeed: 1,
  ambient: false,
  ambientIntensity: 1,
  speed: 1,
  intro: false,
  reducedMotion: false,
  bg: [247 / 255, 244 / 255, 238 / 255],
  imgBg: [234 / 255, 233 / 255, 231 / 255],
};

// The supplied artwork's background, #EAE9E7, normalized before color mapping.
const BACKGROUND_LUMA = (234 * 0.2126 + 233 * 0.7152 + 231 * 0.0722) / 255;
const LUMA = [0.2126, 0.7152, 0.0722]
  .map((value) => value / BACKGROUND_LUMA)
  .join(" ");
const LUMA_MATRIX = `${LUMA} 0 0 ${LUMA} 0 0 ${LUMA} 0 0 0 0 0 1 0`;

/** Original computeRect layout, applied to this artwork-only band. */
function sculptureRect(w: number, h: number, aspect: number): Rect {
  let width: number;
  let maxHeight: number;
  if (w >= 1024) {
    width = w * 1.02;
    maxHeight = h * 1.1;
  } else if (w >= 640) {
    width = w * 1.3;
    maxHeight = h * 1.15;
  } else if (aspect < 1.3) {
    width = w;
    maxHeight = h;
  } else {
    width = w * 1.9;
    maxHeight = h * 1.2;
  }
  if (width / aspect > maxHeight) width = maxHeight * aspect;
  const height = width / aspect;
  return { x: (w - width) / 2, y: (h - height) / 2, w: width, h: height };
}

export function LiquidSculpture() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { paused, reduced } = useMotionState();
  const filterId = `liquid-material-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image) return;
    // A released WebGL context cannot be reused after Pause or preference changes.
    const canvas = document.createElement("canvas");
    canvas.className = "liquid-sculpture-canvas";
    root.appendChild(canvas);
    let disposed = false;
    let engine: LiquidEngine | null = null;
    let failed = false;
    let loadedSource = "";
    let intersecting = false;
    let aspect = image.naturalWidth / image.naturalHeight || 1983 / 793;
    const motionAllowed =
      !paused &&
      !reduced &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fail = () => {
      root.dataset.renderer = "fallback";
      root.dataset.running = "false";
      failed = true;
      const failedEngine = engine;
      engine = null;
      failedEngine?.destroy();
    };
    root.dataset.renderer = "fallback";
    root.dataset.running = "false";

    // GPU allocation and every scheduled frame require all visibility gates.
    // Pause and reduced motion keep the tinted original without allocating WebGL.
    const syncVisibility = () => {
      const active = motionAllowed && intersecting && !document.hidden;
      if (active && !engine && !failed) {
        try {
          engine = new LiquidEngine(canvas, OPTIONS, fail);
          engine.onRunningChange = (running) => {
            if (!disposed) root.dataset.running = String(running);
          };
          layout();
        } catch {
          fail();
        }
      }
      engine?.setVisible(active);
      if (
        active &&
        engine &&
        image.complete &&
        image.naturalWidth &&
        loadedSource !== image.currentSrc
      )
        load();
    };
    const layout = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;
      const rect = sculptureRect(width, height, aspect);
      Object.assign(image.style, {
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.w}px`,
        height: `${rect.h}px`,
      });
      engine?.resize(width, height, rect);
    };
    const load = () => {
      if (disposed || !image.naturalWidth) return;
      aspect = image.naturalWidth / image.naturalHeight;
      root.dataset.renderer = "fallback";
      layout();
      if (engine && motionAllowed && intersecting && !document.hidden) {
        try {
          loadedSource = image.currentSrc;
          engine.onFirstFrame = () => {
            if (!disposed) root.dataset.renderer = "webgl";
          };
          engine.setImage(image);
          layout();
        } catch {
          fail();
        }
      }
    };
    image.addEventListener("load", load);
    image.addEventListener("error", fail);
    const resize = new ResizeObserver(layout);
    resize.observe(root);
    const observer = new IntersectionObserver((entries) => {
      intersecting = entries.some((entry) => entry.isIntersecting);
      syncVisibility();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", syncVisibility);

    const pointer = (
      type: "move" | "down" | "up" | "leave",
      event: PointerEvent,
    ) => {
      if (!motionAllowed || !intersecting || document.hidden) return;
      const touch = event.pointerType === "touch";
      if (type === "move" && touch && !event.buttons && !event.pressure) return;
      const bounds = root.getBoundingClientRect();
      engine?.pointer(
        type,
        event.clientX - bounds.left,
        event.clientY - bounds.top,
        touch,
      );
    };
    const move = (event: PointerEvent) => pointer("move", event);
    const down = (event: PointerEvent) => pointer("down", event);
    const up = (event: PointerEvent) => pointer("up", event);
    const leave = (event: PointerEvent) => pointer("leave", event);
    if (motionAllowed) {
      root.addEventListener("pointermove", move, { passive: true });
      root.addEventListener("pointerdown", down, { passive: true });
      root.addEventListener("pointerup", up, { passive: true });
      root.addEventListener("pointercancel", leave, { passive: true });
      root.addEventListener("pointerleave", leave, { passive: true });
    }
    layout();
    if (image.complete && image.naturalWidth) load();
    return () => {
      disposed = true;
      resize.disconnect();
      observer.disconnect();
      image.removeEventListener("load", load);
      image.removeEventListener("error", fail);
      document.removeEventListener("visibilitychange", syncVisibility);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", leave);
      root.removeEventListener("pointerleave", leave);
      engine?.destroy();
      canvas.remove();
      root.dataset.renderer = "fallback";
      root.dataset.running = "false";
    };
  }, [paused, reduced]);

  return (
    <div
      ref={rootRef}
      className="liquid-sculpture"
      data-renderer="fallback"
      data-running="false"
      aria-hidden="true"
    >
      <svg
        width="0"
        height="0"
        className="liquid-sculpture-filter"
        focusable="false"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={LUMA_MATRIX} />
            <feComponentTransfer>
              <feFuncR
                type="table"
                tableValues={`${116 / 255} ${218 / 255} ${247 / 255}`}
              />
              <feFuncG
                type="table"
                tableValues={`${44 / 255} ${90 / 255} ${244 / 255}`}
              />
              <feFuncB
                type="table"
                tableValues={`${34 / 255} ${71 / 255} ${238 / 255}`}
              />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <picture className="liquid-sculpture-fallback">
        <source
          media="(max-width: 639px)"
          srcSet="/media/liquid-sculpture-mobile.webp"
        />
        {/* The exact original pixels are also sampled by the WebGL engine. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src="/media/liquid-sculpture.webp"
          alt=""
          draggable={false}
          decoding="async"
          fetchPriority="high"
          style={{ filter: `url(#${filterId})` }}
        />
      </picture>
    </div>
  );
}
