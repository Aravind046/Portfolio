"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { getLenis, scrollToTarget } from "@/lib/scroll";

/* Lucide icons (ISC), inlined so no extra dependency is needed. */
const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const Columns3 = () => (
  <svg {...icon}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18M15 3v18" />
  </svg>
);
const Mail = () => (
  <svg {...icon}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const Eye = () => (
  <svg {...icon} width={15} height={15} strokeWidth={2.2}>
    <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LINKS = NAV.filter((n) => n.id !== "contact");
const RING = 2 * Math.PI * 8; // progress ring circumference (r = 8)

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [grid, setGrid] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll state + progress ring in the island (no re-render per frame).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = `${RING * (1 - p)}`;
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
    const ids = ["top", ...NAV.map((n) => n.id)];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Eyes: pupils follow the pointer, with an occasional blink.
  useEffect(() => {
    const wrap = eyesRef.current;
    if (!wrap || prefersReducedMotion()) return;
    const pupils = [...wrap.querySelectorAll<HTMLElement>(".ni-pupil")];
    let raf = 0;
    let px = window.innerWidth / 2;
    let py = window.innerHeight;
    const aim = () => {
      raf = 0;
      pupils.forEach((pu) => {
        const r = (pu.parentElement as HTMLElement).getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const a = Math.atan2(dy, dx);
        const d = Math.min(1, Math.hypot(dx, dy) / 160) * 3.2;
        pu.style.transform = `translate(${(Math.cos(a) * d).toFixed(2)}px, ${(Math.sin(a) * d).toFixed(2)}px)`;
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(aim);
    };
    aim();
    window.addEventListener("pointermove", onMove, { passive: true });

    let blinkT = 0;
    const blink = () => {
      wrap.classList.add("is-blink");
      window.setTimeout(() => wrap.classList.remove("is-blink"), 150);
      blinkT = window.setTimeout(blink, 2800 + Math.random() * 3600);
    };
    blinkT = window.setTimeout(blink, 2200);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      window.clearTimeout(blinkT);
    };
  }, []);

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
      requestAnimationFrame(() => scrollToTarget(id)); // let the overlay unlock scrolling first
    } else scrollToTarget(id);
  };

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="nav-row">
        {/* Left: name + layout-grid toggle */}
        <div className="nav-left">
          <a href="#top" className="nav-brand" onClick={(e) => go(e, "#top")}>
            {PROFILE.firstName}
            <span className="sr-only-focusable">, back to top</span>
          </a>
          <button
            type="button"
            className={`nav-icon nav-grid-btn${grid ? " on" : ""}`}
            aria-pressed={grid}
            aria-label="Show layout grid"
            title="Layout grid"
            onClick={() => setGrid((g) => !g)}
          >
            <Columns3 />
          </button>
        </div>

        {/* Centre: the island — red face with eyes that follow the cursor + scroll-progress ring */}
        <div className="nav-center">
          <a href="#top" className="ni" onClick={(e) => go(e, "#top")} aria-label="Back to top">
            <span className="ni-eyes" ref={eyesRef} aria-hidden="true">
              <span className="ni-eye">
                <span className="ni-pupil" />
              </span>
              <span className="ni-eye">
                <span className="ni-pupil" />
              </span>
            </span>
            <span className="ni-hello" aria-hidden="true">
              hello <span className="ni-wave">👋</span>
            </span>
            <svg className="ni-ring" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" className="ni-track" />
              <circle
                ref={ringRef}
                cx="10"
                cy="10"
                r="8"
                className="ni-prog"
                style={{ strokeDasharray: RING, strokeDashoffset: RING }}
              />
            </svg>
          </a>
        </div>

        {/* Right: links, mail, résumé */}
        <div className="nav-right">
          <nav aria-label="Primary" className="nav-desk">
            <ul>
              {LINKS.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={active === n.id ? "on" : ""}
                    aria-current={active === n.id ? "true" : undefined}
                    onClick={(e) => go(e, `#${n.id}`)}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#contact"
            className={`nav-icon nav-mail${active === "contact" ? " on" : ""}`}
            aria-label="Contact"
            title="Contact"
            onClick={(e) => go(e, "#contact")}
          >
            <Mail />
          </a>
          <span className="nav-sep" aria-hidden="true" />
          <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" className="nav-cv">
            <span className="nav-cv-ic">
              <Eye />
            </span>
            Résumé
            <span className="sr-only-focusable"> (PDF, opens in a new tab)</span>
          </a>

          <button
            ref={menuBtn}
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav-menu-txt">{open ? "Close" : "Menu"}</span>
            <span className="nav-burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div className="nav-grid" data-on={grid} aria-hidden="true">
        <div className="wrap">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
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
        <div className="nav-overlay-foot">
          <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" className="nav-cv">
            <span className="nav-cv-ic">
              <Eye />
            </span>
            View résumé
          </a>
          <a className="mono" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
        </div>
      </div>

      <style>{`
        .nav{--nav-ink:#16181d;--nav-mute:#5d616b;position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
        .nav::before{content:"";position:absolute;inset:0 0 -18px;pointer-events:none;opacity:0;transition:opacity .5s var(--ease);
          background:rgba(251,251,250,.86);-webkit-backdrop-filter:blur(14px) saturate(1.2);backdrop-filter:blur(14px) saturate(1.2);
          -webkit-mask:linear-gradient(#000 78%,transparent);mask:linear-gradient(#000 78%,transparent)}
        .nav.is-scrolled::before{opacity:1}
        .nav-row{position:relative;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;height:72px;padding:0 var(--gutter);max-width:calc(1320px + var(--gutter)*2);margin:0 auto}
        .nav-row>*>*{pointer-events:auto}

        /* left */
        .nav-left{display:flex;align-items:center;gap:14px}
        .nav-brand{font-size:19px;font-weight:650;letter-spacing:-.03em;color:var(--nav-ink);border-radius:6px;transition:opacity .3s}
        .nav-brand:hover{opacity:.7}
        .nav-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;color:var(--nav-mute);transition:color .3s var(--ease),background-color .3s var(--ease)}
        .nav-icon:hover,.nav-icon.on{color:var(--nav-ink);background:rgba(22,24,29,.06)}
        .nav-grid-btn.on{color:#e5484d;background:rgba(229,72,77,.1)}

        /* centre island */
        .nav-center{display:flex;justify-content:center}
        .ni{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;height:42px;min-width:196px;padding:0 9px 0 9px;border-radius:999px;
          background:radial-gradient(140% 180% at 28% 18%,#f0241b 0%,#d10f0f 48%,#a90a0c 100%);
          box-shadow:0 12px 26px -12px rgba(170,10,12,.65),inset 0 1px 0 rgba(255,255,255,.18),inset 0 -2px 4px rgba(90,0,0,.25);transition:min-width .6s var(--ease),transform .5s var(--ease)}
        .ni:hover{min-width:208px}
        .ni-hello{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;font-size:14px;font-weight:600;letter-spacing:-.01em;color:#fff;white-space:nowrap;text-shadow:0 1px 1px rgba(90,0,0,.35)}
        .ni-wave{display:inline-block;font-size:14px;transform-origin:70% 75%;animation:niWave 2.8s ease-in-out 1.2s infinite}
        .ni:hover .ni-wave{animation-duration:1s}
        @keyframes niWave{0%,60%,100%{transform:rotate(0)}10%,30%{transform:rotate(16deg)}20%,40%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
        .ni:active{transform:scale(.97)}
        .ni-eyes{display:flex;gap:3px;padding-top:3px}
        .ni-eye{position:relative;display:grid;place-items:center;width:15px;height:20px;border-radius:50%;
          background:radial-gradient(circle at 40% 30%,#fff 55%,#e9e6e6 100%);
          box-shadow:0 0 0 1px rgba(110,0,0,.55),0 1px 2px rgba(90,0,0,.35);transition:transform .12s ease}
        .ni-eye::before{content:"";position:absolute;top:-6px;width:12px;height:3px;border-radius:3px 3px 1px 1px;background:#3b1610;transition:transform .5s var(--ease)}
        .ni-eye:first-child::before{left:1px;transform:rotate(-12deg)}
        .ni-eye:last-child::before{right:1px;transform:rotate(12deg)}
        .ni:hover .ni-eye:first-child::before{transform:translateY(-2px) rotate(-18deg)}
        .ni:hover .ni-eye:last-child::before{transform:translateY(-2px) rotate(18deg)}
        .ni-eyes.is-blink .ni-eye{transform:scaleY(.1)}
        .ni-pupil{position:relative;width:8px;height:8px;border-radius:50%;
          background:radial-gradient(circle,#0b0b0b 0 34%,#5f7a74 38%,#3c4f4b 100%);transition:transform .18s ease-out}
        .ni-pupil::after{content:"";position:absolute;top:1.3px;left:1.6px;width:2.2px;height:2.2px;border-radius:50%;background:#fff}
        .ni-ring{width:22px;height:22px;flex:none;transform:rotate(-90deg)}
        .ni-ring circle{fill:none;stroke-width:2.6}
        .ni-track{stroke:rgba(255,255,255,.28)}
        .ni-prog{stroke:#fff;stroke-linecap:round;transition:stroke-dashoffset .15s linear}

        /* right */
        .nav-right{display:flex;align-items:center;justify-content:flex-end;gap:4px}
        .nav-desk ul{display:flex;list-style:none;margin:0;padding:0}
        .nav-desk a{position:relative;display:block;padding:8px 12px;border-radius:8px;font-size:15.5px;font-weight:450;letter-spacing:-.01em;color:var(--nav-mute);transition:color .3s var(--ease)}
        .nav-desk a:hover,.nav-desk a.on{color:var(--nav-ink)}
        .nav-desk a::after{content:"";position:absolute;left:50%;bottom:1px;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:currentColor;transform:scale(0);transition:transform .4s var(--ease)}
        .nav-desk a.on::after{transform:scale(1)}
        .nav-mail{margin-left:4px}
        .nav-sep{width:1px;height:22px;margin:0 10px 0 8px;background:rgba(22,24,29,.14)}
        .nav-cv{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 5px;border-radius:999px;background:#0e0e10;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 18px -12px rgba(13,13,13,.6);
          font-size:15px;font-weight:600;letter-spacing:-.01em;color:#fff;transition:background-color .35s var(--ease),box-shadow .35s var(--ease),transform .4s var(--ease)}
        .nav-cv-ic{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#fff;color:#0e0e10;transition:transform .5s var(--ease)}
        .nav-cv:hover{background:#26262a;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 12px 22px -12px rgba(13,13,13,.7);transform:translateY(-1px)}
        .nav-cv:hover .nav-cv-ic{transform:scale(1.08)}

        .nav-menu-btn{display:none;align-items:center;gap:10px;height:40px;padding:0 6px 0 16px;margin-left:8px;border-radius:999px;font-size:14px;font-weight:500;background:rgba(255,255,255,.8);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line);position:relative;z-index:2}
        .nav-burger{display:grid;place-content:center;gap:5px;width:28px;height:28px;border-radius:50%;background:var(--ink)}
        .nav-burger i{display:block;width:12px;height:1.5px;background:#fff;transition:transform .5s var(--ease)}
        .nav.is-open .nav-burger i:first-child{transform:translateY(3.25px) rotate(45deg)}
        .nav.is-open .nav-burger i:last-child{transform:translateY(-3.25px) rotate(-45deg)}

        /* layout grid overlay */
        .nav-grid{position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:0;transition:opacity .4s var(--ease)}
        .nav-grid[data-on="true"]{opacity:1}
        .nav-grid .wrap{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(12px,1.6vw,24px);height:100%}
        .nav-grid i{background:rgba(229,72,77,.07);box-shadow:inset 1px 0 rgba(229,72,77,.18),inset -1px 0 rgba(229,72,77,.18)}

        /* mobile overlay */
        .nav-overlay{position:fixed;inset:0;z-index:-1;background:var(--paper);pointer-events:auto;display:flex;flex-direction:column;justify-content:center;padding:96px var(--gutter) 40px;clip-path:circle(0% at calc(100% - 40px) 36px);animation:navIn .8s var(--ease) forwards}
        .nav-overlay[hidden]{display:none}
        @keyframes navIn{to{clip-path:circle(150% at calc(100% - 40px) 36px)}}
        .nav-overlay ol{list-style:none;margin:0;padding:0}
        .nav-overlay li{overflow:hidden;border-bottom:1px solid var(--line)}
        .nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-size:clamp(38px,11vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1;transform:translateY(110%);animation:navLink .9s var(--ease) forwards;animation-delay:calc(.12s + var(--i)*60ms)}
        .nav-overlay li a span{font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
        @keyframes navLink{to{transform:none}}
        .nav-overlay-foot{display:flex;flex-wrap:wrap;align-items:center;gap:16px 20px;margin-top:32px;font-size:13px;color:var(--mute)}

        @media (max-width:1180px){
          .nav-desk,.nav-mail,.nav-sep{display:none}
          .nav-menu-btn{display:inline-flex}
        }
        @media (max-width:760px){
          .nav-right>.nav-cv,.nav-grid-btn{display:none}
        }
        @media (max-width:480px){
          .nav-row{height:64px;gap:8px}
          .nav-brand{font-size:17px}
          .ni{min-width:0;height:38px;padding:0 7px;gap:8px}
          .ni-hello{font-size:12.5px;gap:3px}
          .ni-wave{font-size:12.5px}
          .ni:hover{min-width:0}
          .ni-eye{width:13px;height:17px}
          .ni-pupil{width:7px;height:7px}
          .ni-ring{width:20px;height:20px}
          .nav-menu-txt{display:none}
          .nav-menu-btn{padding:0 6px}
        }
      `}</style>
    </header>
  );
}
