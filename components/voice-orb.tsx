"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionState } from "@/components/motion-provider";
import { createOrbParticles, projectOrbParticles } from "@/lib/voice-orb";

export function VoiceOrb({ activity = 0 }: { activity?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const energy = useRef(activity);
  energy.current = activity;
  const { paused, reduced } = useMotionState();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const surface = canvas.current;
    const ctx = surface?.getContext("2d");
    if (!surface || !ctx) return;
    const particles = createOrbParticles();
    let frame = 0;
    let time = 0;
    let previous = 0;
    let visible = true;
    let size = 0;
    let smoothed = 0;
    const still =
      paused ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const shadow = ctx.createRadialGradient(
        size * 0.5,
        size * 0.92,
        0,
        size * 0.5,
        size * 0.92,
        size * 0.22,
      );
      shadow.addColorStop(0, "rgba(93, 46, 28, 0.12)");
      shadow.addColorStop(1, "rgba(93, 46, 28, 0)");
      ctx.save();
      ctx.translate(0, size * 0.74);
      ctx.scale(1, 0.2);
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
      for (const p of projectOrbParticles(
        particles,
        time,
        still ? 0 : smoothed,
      )) {
        const light = Math.max(0, Math.min(1, (p.depth + 1.2) / 2.4));
        const radius = (p.radius * size) / 400;
        const x = size * 0.5 + p.x * size * 0.34;
        const y = size * 0.48 - p.y * size * 0.34;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.cream
          ? `hsl(27 57% ${54 + light * 35}% / ${0.45 + light * 0.55})`
          : `hsl(${9 + light * 4} 66% ${25 + light * 33}% / ${0.5 + light * 0.5})`;
        ctx.fill();
        if (radius > 1.5 && light > 0.5) {
          ctx.beginPath();
          ctx.arc(
            x - radius * 0.25,
            y - radius * 0.3,
            radius * 0.32,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = "rgba(255, 247, 231, 0.5)";
          ctx.fill();
        }
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (previous && now - previous < 1000 / 30) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const delta = previous ? Math.min((now - previous) / 1000, 0.06) : 0;
      previous = now;
      time += delta;
      smoothed += (energy.current - smoothed) * (1 - Math.exp(-delta * 6));
      draw();
      frame = requestAnimationFrame(tick);
    };
    const synchronize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (!still && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      size = surface.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.round(size * dpr);
      surface.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const resizer = new ResizeObserver(resize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      synchronize();
    });
    resize();
    setDrawn(true);
    resizer.observe(surface);
    observer.observe(surface);
    document.addEventListener("visibilitychange", synchronize);
    synchronize();
    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", synchronize);
    };
  }, [paused, reduced]);

  return (
    <span className="voice-orb-art" aria-hidden="true">
      {!drawn && (
        <img className="voice-orb-poster" src="/voice-orb-ribbons.png" alt="" />
      )}
      <canvas ref={canvas} />
    </span>
  );
}
