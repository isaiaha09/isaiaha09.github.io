"use client";

import { useLayoutEffect, useRef } from "react";

type Particle = {
  angle: number;
  progress: number;
  speed: number;
  brightness: number;
  size: number;
  reflection: boolean;
};

function randomGenerator(seed: number) {
  let state = seed;

  return () => {
    state = (Math.imul(1664525, state) + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });

    if (!canvas || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrame = 0;
    let previousFrame = 0;

    function createParticles() {
      const random = randomGenerator(1927);
      const count = Math.min(780, Math.max(220, Math.round((width * height) / 2000)));
      particles = Array.from({ length: count }, (_, index) => {
        const reflection = index >= count * 0.77;

        return {
          angle: reflection ? random() * Math.PI : -random() * Math.PI,
          progress: random(),
          speed: (reflection ? 0.025 : 0.035) + random() * 0.065,
          brightness: 0.35 + random() * 0.65,
          size: 0.55 + random() * 1.25,
          reflection,
        };
      });
    }

    function draw() {
      if (!context) return;

      const horizon = height * (width < 680 ? 0.7 : 0.69);
      const centerX = width * 0.52;
      const reach = Math.hypot(width * 0.72, height * 0.95);

      const backdrop = context.createLinearGradient(0, 0, 0, height);
      backdrop.addColorStop(0, "#02050b");
      backdrop.addColorStop(0.55, "#030914");
      backdrop.addColorStop(0.72, "#041123");
      backdrop.addColorStop(1, "#02060d");
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(centerX, horizon);
      context.scale(1, 0.28);
      const atmosphere = context.createRadialGradient(0, 0, 0, 0, 0, width * 0.62);
      atmosphere.addColorStop(0, "rgba(0, 105, 255, 0.37)");
      atmosphere.addColorStop(0.35, "rgba(0, 75, 190, 0.18)");
      atmosphere.addColorStop(1, "rgba(0, 50, 140, 0)");
      context.fillStyle = atmosphere;
      context.beginPath();
      context.arc(0, 0, width * 0.62, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.lineCap = "round";

      for (const particle of particles) {
        const distance = Math.pow(particle.progress, 1.55) * reach;
        const verticalScale = particle.reflection ? 0.37 : 0.78;
        const x = centerX + Math.cos(particle.angle) * distance;
        const y = horizon + Math.sin(particle.angle) * distance * verticalScale;

        if (x < -35 || x > width + 35 || y < -35 || y > height + 35) continue;

        const fade = Math.min(1, particle.progress * 2.2) * (1 - particle.progress * 0.26);
        const alpha = fade * particle.brightness * (particle.reflection ? 0.37 : 0.86);
        const trail = (2 + particle.progress * (particle.reflection ? 12 : 25)) * (width < 680 ? 0.7 : 1);
        const previousDistance = Math.max(0, distance - trail);
        const trailX = centerX + Math.cos(particle.angle) * previousDistance;
        const trailY = horizon + Math.sin(particle.angle) * previousDistance * verticalScale;

        context.beginPath();
        context.moveTo(trailX, trailY);
        context.lineTo(x, y);
        context.strokeStyle = `rgba(22, 116, 255, ${alpha * 0.65})`;
        context.lineWidth = Math.max(0.5, particle.size * 0.72);
        context.stroke();

        if (particle.brightness > 0.83 && !particle.reflection) {
          context.beginPath();
          context.arc(x, y, particle.size * 3.5, 0, Math.PI * 2);
          context.fillStyle = `rgba(31, 133, 255, ${alpha * 0.11})`;
          context.fill();
        }

        context.beginPath();
        context.arc(x, y, particle.size * (0.55 + particle.progress * 0.6), 0, Math.PI * 2);
        context.fillStyle = `rgba(79, 170, 255, ${alpha})`;
        context.fill();

        if (particle.brightness > 0.91 && !particle.reflection) {
          context.beginPath();
          context.arc(x, y, 0.65, 0, Math.PI * 2);
          context.fillStyle = `rgba(222, 241, 255, ${alpha * 0.9})`;
          context.fill();
        }
      }

      context.save();
      context.translate(centerX, horizon);
      context.scale(1, 0.052);
      const horizonGlow = context.createRadialGradient(0, 0, 0, 0, 0, width * 0.68);
      horizonGlow.addColorStop(0, "rgba(31, 137, 255, 0.51)");
      horizonGlow.addColorStop(0.28, "rgba(9, 91, 233, 0.26)");
      horizonGlow.addColorStop(1, "rgba(0, 85, 205, 0)");
      context.fillStyle = horizonGlow;
      context.beginPath();
      context.arc(0, 0, width * 0.68, 0, Math.PI * 2);
      context.fill();
      context.restore();

      // Keep the moving field behind the reading surface, especially on small screens.
      const readability = context.createLinearGradient(0, 0, width, 0);
      readability.addColorStop(0, "rgba(2, 5, 11, 0.46)");
      readability.addColorStop(0.4, "rgba(2, 5, 11, 0.22)");
      readability.addColorStop(1, "rgba(2, 5, 11, 0.08)");
      context.fillStyle = readability;
      context.fillRect(0, 0, width, height);
    }

    function resize() {
      if (!canvas || !context) return;

      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
      draw();
    }

    function animate(timestamp: number) {
      animationFrame = window.requestAnimationFrame(animate);
      const elapsed = timestamp - previousFrame;
      if (elapsed < 33) return;

      previousFrame = timestamp;
      const seconds = Math.min(elapsed, 100) / 1000;
      for (const particle of particles) {
        particle.progress += particle.speed * seconds;
        if (particle.progress > 1) particle.progress -= 1;
      }
      draw();
    }

    function syncMotion() {
      window.cancelAnimationFrame(animationFrame);
      if (!motionPreference.matches && !document.hidden) {
        previousFrame = performance.now();
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        draw();
      }
    }

    resize();
    canvas.dataset.ready = "true";
    syncMotion();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", syncMotion);
    motionPreference.addEventListener("change", syncMotion);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncMotion);
      motionPreference.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div className="particle-background" aria-hidden="true">
      <picture className="particle-poster">
        <source media="(max-width: 680px)" srcSet="/particle-poster-mobile.webp" />
        <img
          src="/particle-poster-wide.webp"
          alt=""
          width="1920"
          height="1080"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </picture>
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
}
