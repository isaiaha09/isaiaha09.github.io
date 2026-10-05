"use client";

import { useEffect, useRef, useState } from "react";

type ProjectDemoVideoProps = {
  src: string;
  poster?: string;
  className: string;
  label: string;
  controls?: boolean;
  ariaHidden?: boolean;
};

export function ProjectDemoVideo({
  src,
  poster,
  className,
  label,
  controls = false,
  ariaHidden = false,
}: ProjectDemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!("IntersectionObserver" in window)) {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
        }
        setInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!nearViewport || !inView || reducedMotion) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // Autoplay can be blocked by browser policy; detail-page controls remain available.
    });
  }, [nearViewport, inView, reducedMotion]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={nearViewport ? src : undefined}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      autoPlay={inView && !reducedMotion}
      controls={controls}
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : label}
    />
  );
}
