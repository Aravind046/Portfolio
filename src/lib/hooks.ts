"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Boolean in-view flag via IntersectionObserver. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0, rootMargin = "0px", once = false }: { threshold?: number | number[]; rootMargin?: string; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, rootMargin, once]);
  return inView;
}

/**
 * Calls `onProgress(p, rect)` (p in 0..1) on scroll/resize, throttled to one call per frame.
 * `start` / `end` are viewport fractions: p = 0 when the element's top reaches
 * `start * vh`, p = 1 when its bottom reaches `end * vh`. Imperative so it
 * never causes React re-renders.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (p: number, rect: DOMRect) => void,
  { start = 1, end = 0 }: { start?: number; end?: number } = {},
): void {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = start * vh; // top at this y → 0
      const total = r.height + from - end * vh;
      const p = total <= 0 ? 1 : (from - r.top) / total;
      cb.current(Math.min(1, Math.max(0, p)), r);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, start, end]);
}
