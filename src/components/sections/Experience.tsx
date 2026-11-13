"use client";

import { useRef } from "react";
import { EDUCATION, EXPERIENCE, SECTION_INDEX } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionTag from "../ui/SectionTag";
import Heading from "../ui/Heading";

type Stop = { key: string; year: string; title: string; place: string; detail: string[]; kind: "Education" | "Work" };

const STOPS: Stop[] = [
  ...[...EDUCATION].reverse().map((e) => ({
    key: e.title,
    year: `${e.start} – ${e.end}`,
    title: e.title,
    place: `${e.school}, ${e.place}`,
    detail: [],
    kind: "Education" as const,
  })),
  ...[...EXPERIENCE].reverse().map((r) => ({
    key: `${r.company}-${r.start}`,
    year: `${r.start} – ${r.end}`,
    title: r.title,
    place: `${r.company}, ${r.place}`,
    detail: r.points,
    kind: "Work" as const,
  })),
];

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);

  useScrollProgress(
    listRef,
    (p, rect) => {
      const list = listRef.current;
      if (!list) return;
      list.style.setProperty("--p", p.toFixed(4));
      const reach = p * rect.height;
      list.querySelectorAll<HTMLElement>(":scope > li").forEach((li) => {
        li.classList.toggle("lit", li.offsetTop + 14 <= reach);
      });
    },
    { start: 0.62, end: 0.62 },
  );

  return (
    <section id="experience" className="section exp" aria-labelledby="exp-title">
      <div className="wrap exp-grid">
        <div className="exp-head">
          <SectionTag index={SECTION_INDEX.experience} label="Education & experience" />
          <Heading id="exp-title" className="exp-title" lines={["One continuous"]} accent="path." />
          <p className="lede rv">From a Bachelor of Information Technology in 2012 to Senior UI/UX Designer today — education and work, in order.</p>
        </div>

        <ol className="tl" ref={listRef}>
          {STOPS.map((s) => (
            <li key={s.key} className="tl-stop">
              <span className="tl-dot" aria-hidden="true" />
              <div className="tl-card">
                <p className="tl-year mono">
                  {s.year} <span>· {s.kind}</span>
                </p>
                <h3 className="tl-title">{s.title}</h3>
                <p className="tl-place">{s.place}</p>
                {s.detail.length > 0 && (
                  <ul className="tl-detail">
                    {s.detail.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
          <li className="tl-stop tl-next">
            <span className="tl-dot" aria-hidden="true" />
            <div className="tl-card dashed">
              <p className="tl-year mono">Next</p>
              <h3 className="tl-title">
                Your team<span className="accent">?</span>
              </h3>
              <a
                href="#contact"
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
              >
                Let&apos;s talk
              </a>
            </div>
          </li>
        </ol>
      </div>

      <style>{`
        .exp-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
        .exp-head{position:sticky;top:110px}
        .exp-title{margin:22px 0 22px}
        .tl{position:relative;list-style:none;margin:0;padding:0 0 0 44px}
        .tl::before,.tl::after{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:2px;border-radius:2px;background:var(--soft)}
        .tl::after{background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0))}
        .tl-stop{position:relative;padding-bottom:22px}
        .tl-dot{position:absolute;left:-44px;top:24px;width:24px;height:24px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--soft);transition:box-shadow .6s var(--ease),background-color .6s var(--ease),transform .6s var(--ease)}
        .tl-dot::after{content:"";position:absolute;inset:7px;border-radius:50%;background:var(--faint);transition:background-color .6s var(--ease)}
        .tl-stop.lit .tl-dot{box-shadow:inset 0 0 0 2px var(--ink);transform:scale(1.08)}
        .tl-stop.lit .tl-dot::after{background:var(--ink)}
        .tl-card{background:#fff;border-radius:24px;padding:22px 24px;box-shadow:var(--hair);opacity:.45;transform:translateX(10px);transition:opacity .7s var(--ease),transform .8s var(--ease),box-shadow .7s var(--ease)}
        .tl-stop.lit .tl-card{opacity:1;transform:none;box-shadow:var(--hair),0 24px 48px -32px rgba(13,13,13,.35)}
        .tl-year{margin:0;font-size:12px;color:var(--ink);text-transform:uppercase;letter-spacing:.04em}
        .tl-year span{color:var(--mute)}
        .tl-title{margin:10px 0 0;font-size:clamp(22px,2vw,28px);font-weight:700;letter-spacing:-.035em;line-height:1.1}
        .tl-place{margin:4px 0 0;color:var(--mute);font-size:15px}
        .tl-detail{list-style:none;margin:14px 0 0;padding:12px 0 0;border-top:1px solid var(--line);display:grid;gap:8px}
        .tl-detail li{position:relative;padding-left:16px;color:var(--ink-2);font-size:15px;line-height:1.55}
        .tl-detail li::before{content:"";position:absolute;left:0;top:.75em;width:7px;height:1px;background:var(--ink)}
        .tl-card.dashed{background:transparent;box-shadow:none;border:1.5px dashed rgba(13,13,13,.25);display:flex;flex-direction:column;align-items:flex-start;gap:14px}
        .tl-card.dashed .tl-title{margin:0;font-size:clamp(30px,3vw,44px)}
        @media (max-width:900px){
          .exp-grid{grid-template-columns:minmax(0,1fr)}
          .exp-head{position:relative;top:auto}
          .tl{padding-left:36px}
          .tl::before,.tl::after{left:9px}
          .tl-dot{left:-36px;width:20px;height:20px}
          .tl-dot::after{inset:6px}
          .tl-card{padding:18px}
        }
        @media (prefers-reduced-motion:reduce){.tl-card{opacity:1;transform:none}}
      `}</style>
    </section>
  );
}
