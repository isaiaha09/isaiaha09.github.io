"use client";

import { useEffect } from "react";

const reach = 0.56;

function repel(x: number, y: number, homeX: number, homeY: number) {
  const awayX = homeX - x;
  const awayY = homeY - y;
  const distance = Math.hypot(awayX, awayY);
  const proximity = Math.max(0, 1 - distance / reach);
  const force = proximity * proximity * (3 - 2 * proximity);
  if (!force) return { x: 0, y: 0 };

  // At the exact center, send the color inward until the pointer has a direction again.
  const directionX = distance > 0.001 ? awayX / distance : homeX < 0.5 ? Math.SQRT1_2 : -Math.SQRT1_2;
  const directionY = distance > 0.001 ? awayY / distance : homeY < 0.5 ? Math.SQRT1_2 : -Math.SQRT1_2;
  return { x: directionX * force, y: directionY * force };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function GlassColorMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let next: { surface: HTMLElement; clientX: number; clientY: number } | null = null;

    function moveColor(event: PointerEvent) {
      if (reducedMotion.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      if (!(event.target instanceof Element)) return;

      const surface = event.target.closest<HTMLElement>(".glass-surface");
      if (!surface) return;

      next = { surface, clientX: event.clientX, clientY: event.clientY };
      if (frame) return;

      frame = requestAnimationFrame(() => {
        if (next) {
          const bounds = next.surface.getBoundingClientRect();
          if (bounds.width && bounds.height) {
            const surface = next.surface;
            const x = Math.min(1, Math.max(0, (next.clientX - bounds.left) / bounds.width));
            const y = Math.min(1, Math.max(0, (next.clientY - bounds.top) / bounds.height));
            const styles = getComputedStyle(surface);
            const position = (name: string, fallback: number) => {
              const value = Number.parseFloat(styles.getPropertyValue(name));
              return Number.isFinite(value) ? value / 100 : fallback;
            };
            const top = repel(x, y, position("--glass-top-x", 0.2), position("--glass-top-y", 0.18));
            const bottom = repel(x, y, position("--glass-bottom-x", 0.8), position("--glass-bottom-y", 0.82));
            const set = (name: string, value: number) => surface.style.setProperty(name, `${Math.round(value * 10) / 10}%`);

            set("--glass-top-x", clamp(20 + 44 * top.x, 2, 70));
            set("--glass-top-y", clamp(18 + 36 * top.y, 2, 70));
            set("--glass-bottom-x", clamp(80 + 44 * bottom.x, 30, 98));
            set("--glass-bottom-y", clamp(82 + 36 * bottom.y, 30, 98));
          }
        }
        frame = 0;
      });
    }

    function releaseColor(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (!(event.target instanceof Element)) return;

      const surface = event.target.closest<HTMLElement>(".glass-surface");
      if (!surface) return;
      if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".glass-surface") === surface) return;

      if (next?.surface === surface) next = null;
      surface.style.removeProperty("--glass-top-x");
      surface.style.removeProperty("--glass-top-y");
      surface.style.removeProperty("--glass-bottom-x");
      surface.style.removeProperty("--glass-bottom-y");
    }

    document.addEventListener("pointermove", moveColor, { passive: true });
    document.addEventListener("pointerout", releaseColor, { passive: true });
    return () => {
      document.removeEventListener("pointermove", moveColor);
      document.removeEventListener("pointerout", releaseColor);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
