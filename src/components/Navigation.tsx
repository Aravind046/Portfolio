"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { getLenis, scrollToTarget } from "@/lib/scroll";

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll state + progress bar (no re-render per frame for the bar).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Active section.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "-45% 0px -50% 0px",
    });
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // Slide the ink indicator under the active link.
  const place = useCallback(() => {
    const ind = indRef.current;
    const pill = pillRef.current;
    if (!ind || !pill) return;
    const link = active ? pill.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);
  useIsoLayout(place, [place]);
  useEffect(() => {
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  // Mobile overlay: lock scroll, Esc closes, focus management.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const first = overlayRef.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && overlayRef.current) {
        const f = [menuBtn.current, ...overlayRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    if (wasOpen) {
      menuBtn.current?.focus({ preventScroll: true });
      // let the overlay unlock scrolling first
      requestAnimationFrame(() => scrollToTarget(id));
    } else scrollToTarget(id);
  };

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="nav-progress" ref={barRef} aria-hidden="true" />
      <div className="nav-row">
        <a href="#top" className="nav-brand" onClick={(e) => go(e, "#top")}>
          <span className="nav-mark" aria-hidden="true">
            {PROFILE.initials}
          </span>
          <span className="nav-name">{PROFILE.name}</span>
          <span className="sr-only-focusable">, back to top</span>
        </a>

        <nav aria-label="Primary" className="nav-desk">
          <div className="nav-pill" ref={pillRef}>
            <span className="nav-ind" ref={indRef} aria-hidden="true" />
            <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  className={active === n.id ? "on" : ""}
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={(e) => go(e, `#${n.id}`)}
                >
                  {n.label}
                </a>
              </li>
            ))}
            </ul>
          </div>
        </nav>

        <button
          ref={menuBtn}
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="nav-burger" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={overlayRef}
        className="nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        data-open={open}
      >
        <nav aria-label="Mobile">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ ["--i" as string]: i }}>
                <a href={`#${n.id}`} onClick={(e) => go(e, `#${n.id}`)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="nav-overlay-foot mono">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
      </div>

      <style>{`
        .nav{position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
        .nav-progress{position:absolute;top:0;left:0;right:0;height:2px;background:var(--ink);transform-origin:0 50%;transform:scaleX(0);z-index:3}
        .nav-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px var(--gutter);max-width:calc(1320px + var(--gutter)*2);margin:0 auto}
        .nav-row>*{pointer-events:auto}
        .nav-brand{display:flex;align-items:center;gap:12px;border-radius:999px}
        .nav-mark{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);font-weight:700;font-size:13px;letter-spacing:-.02em;transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nav-brand:hover .nav-mark{transform:rotate(360deg)}
        .nav.is-scrolled .nav-mark{background:var(--ink);color:var(--paper)}
        .nav-name{font-weight:600;letter-spacing:-.02em;font-size:15px;transition:opacity .5s var(--ease),transform .6s var(--ease)}
        .nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
        .nav-pill ul{display:flex;gap:2px;list-style:none;margin:0;padding:0}
        .nav-pill{position:relative;padding:5px;border-radius:999px;background:rgba(255,255,255,0);box-shadow:inset 0 0 0 1px var(--line);transition:background-color .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nav.is-scrolled .nav-pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.35)}
        .nav-pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .4s var(--ease)}
        .nav-pill a:hover{color:var(--ink)}
        .nav-pill a.on{color:#fff}
        .nav-ind{position:absolute;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--ink);opacity:0;transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
        .nav-menu-btn{display:none;align-items:center;gap:10px;height:42px;padding:0 8px 0 18px;border-radius:999px;font-size:14px;font-weight:500;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line);position:relative;z-index:2}
        .nav-burger{display:grid;place-content:center;gap:5px;width:28px;height:28px;border-radius:50%;background:var(--ink)}
        .nav-burger i{display:block;width:12px;height:1.5px;background:#fff;transition:transform .5s var(--ease)}
        .nav.is-open .nav-burger i:first-child{transform:translateY(3.25px) rotate(45deg)}
        .nav.is-open .nav-burger i:last-child{transform:translateY(-3.25px) rotate(-45deg)}
        .nav-overlay{position:fixed;inset:0;z-index:1;background:var(--paper);pointer-events:auto;display:flex;flex-direction:column;justify-content:center;padding:96px var(--gutter) 40px;clip-path:circle(0% at calc(100% - 40px) 37px);animation:navIn .8s var(--ease) forwards}
        .nav-overlay[hidden]{display:none}
        @keyframes navIn{to{clip-path:circle(150% at calc(100% - 40px) 37px)}}
        .nav-overlay ol{list-style:none;margin:0;padding:0}
        .nav-overlay li{overflow:hidden;border-bottom:1px solid var(--line)}
        .nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-size:clamp(38px,11vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1;transform:translateY(110%);animation:navLink .9s var(--ease) forwards;animation-delay:calc(.12s + var(--i)*60ms)}
        .nav-overlay li a span{font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
        @keyframes navLink{to{transform:none}}
        .nav-overlay-foot{margin-top:32px;font-size:13px;color:var(--mute)}
        @media (max-width:820px){
          .nav-desk{display:none}
          .nav-menu-btn{display:inline-flex}
        }
        @media (max-width:400px){.nav-name{display:none}}
      `}</style>
    </header>
  );
}
