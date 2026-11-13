"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/** Mounts Lenis smooth scrolling (skipped when the visitor prefers reduced motion). */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = instance;
    let raf = requestAnimationFrame(function loop(t) {
      instance.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

/** Smooth-scrolls to `#id`, an element, or the top (0), then moves focus there for keyboard users. */
export function scrollToTarget(target: string | HTMLElement | number): void {
  if (target === 0 || target === "#top") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    focusTarget(document.getElementById("top"));
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : (target as HTMLElement);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  focusTarget(el);
  if (typeof target === "string" && target.startsWith("#")) history.replaceState(null, "", target);
}

function focusTarget(el: HTMLElement | null) {
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
