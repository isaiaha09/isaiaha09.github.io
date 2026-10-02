"use client";

import { useEffect } from "react";

const pendingSectionKey = "iasapps-pending-section";

function getSectionId(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return "";
  }
}

export function CleanSectionUrls() {
  useEffect(() => {
    let hashFrame = 0;
    let scrollFrame = 0;

    function clearSectionHash() {
      const hash = window.location.hash;
      if (!hash) return;
      const id = getSectionId(hash);
      if (!document.getElementById(id)) return;

      window.cancelAnimationFrame(hashFrame);
      hashFrame = window.requestAnimationFrame(() => {
        if (window.location.hash !== hash) return;
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      });
    }

    function handleSectionClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const destination = new URL(link.href);
      if (destination.origin !== window.location.origin || !destination.hash) return;

      const id = getSectionId(destination.hash);
      if (!id) return;

      if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
        const section = document.getElementById(id);
        if (!section) return;

        event.preventDefault();
        section.scrollIntoView({ block: "start" });

        if (link.classList.contains("skip-link")) {
          const hadTabIndex = section.hasAttribute("tabindex");
          if (!hadTabIndex) section.setAttribute("tabindex", "-1");
          section.focus({ preventScroll: true });
          if (!hadTabIndex) {
            section.addEventListener("blur", () => section.removeAttribute("tabindex"), { once: true });
          }
        }
        return;
      }

      if (destination.pathname !== "/" || !["top", "work", "about", "resume", "contact", "main"].includes(id)) return;

      try {
        window.sessionStorage.setItem(pendingSectionKey, id);
      } catch {
        return;
      }

      event.preventDefault();
      window.location.assign(`${destination.pathname}${destination.search}`);
    }

    function scrollToPendingSection() {
      let id: string | null;
      try {
        id = window.sessionStorage.getItem(pendingSectionKey);
      } catch {
        return;
      }

      if (!id) return;
      scrollFrame = window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
        window.sessionStorage.removeItem(pendingSectionKey);
      });
    }

    clearSectionHash();
    scrollToPendingSection();
    document.addEventListener("click", handleSectionClick);
    window.addEventListener("hashchange", clearSectionHash);

    return () => {
      window.cancelAnimationFrame(hashFrame);
      window.cancelAnimationFrame(scrollFrame);
      document.removeEventListener("click", handleSectionClick);
      window.removeEventListener("hashchange", clearSectionHash);
    };
  }, []);

  return null;
}
