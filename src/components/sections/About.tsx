"use client";

import { useRef } from "react";
import { PROFILE, QUICK_FACTS, SECTION_INDEX } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import IdCard from "../ui/IdCard";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const links = [
    { label: "Résumé ↓", href: PROFILE.resume, download: true },
    PROFILE.github ? { label: "GitHub ↗", href: PROFILE.github } : null,
    { label: "LinkedIn ↗", href: PROFILE.linkedin },
    { label: "Portfolio ↗", href: PROFILE.portfolio },
  ].filter(Boolean) as { label: string; href: string; download?: boolean }[];

  return (
    <section id="about" ref={ref} className="section about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="about-left">
          <SectionTag index={SECTION_INDEX.about} label="About" />
          <h2 id="about-title" className="h2 about-title">
            <span className="rv-mask">
              <span>Hi, I&apos;m</span>
            </span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
              <span className="accent">{PROFILE.firstName}.</span>
            </span>
          </h2>
          <p className="lede rv" style={{ ["--i" as string]: 1 }}>
            {PROFILE.resumeSummary}.
          </p>
          <p className="about-extra rv" style={{ ["--i" as string]: 2 }}>
            {PROFILE.extraLine}
          </p>
          <div className="about-btns rv" style={{ ["--i" as string]: 3 }}>
            {links.map((l) =>
              l.download ? (
                <a key={l.href} href={l.href} download={PROFILE.resumeFileName} className="btn btn-primary btn-sm">
                  {l.label}
                </a>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                >
                  {l.label}
                  <span className="sr-only-focusable"> (opens in a new tab)</span>
                </a>
              ),
            )}
          </div>
        </div>

        <div className="about-center">
          <IdCard zoneRef={ref} />
        </div>

        <aside className="about-right" aria-label="Quick facts">
          <p className="tag rv">
            <b>Quick facts</b>
          </p>
          <dl className="facts">
            {QUICK_FACTS.map((f, i) => (
              <div key={f.k} className="rv" style={{ ["--i" as string]: i + 1 }}>
                <dt className="mono">{f.k}</dt>
                <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
              </div>
            ))}
          </dl>
          <figure className="about-quote rv" style={{ ["--i" as string]: 5 }}>
            <blockquote>
              <p>&ldquo;{PROFILE.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mono">— paraphrased from my résumé</figcaption>
          </figure>
        </aside>
      </div>

      <style>{`
        .about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:stretch}
        .about-left,.about-right{display:flex;flex-direction:column}
        .about-title{margin:22px 0 28px;font-size:clamp(48px,5.6vw,84px)}
        .about-title .accent{color:var(--mute)}
        .about-extra{margin:14px 0 0;color:var(--mute);font-size:15px}
        .about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}
        .about-center{display:flex;justify-content:center}
        .about-right{justify-content:flex-start}
        .facts{margin:20px 0 0;padding:0;border-top:1px solid var(--line)}
        .facts div{display:grid;grid-template-columns:110px minmax(0,1fr);gap:12px;padding:16px 0;border-bottom:1px solid var(--line)}
        .facts dt{font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute);padding-top:2px}
        .facts dd{margin:0;font-size:15px;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
        .facts a{background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat;transition:background-size .5s var(--ease)}
        .facts a:hover{background-size:0 1px;background-position:100% 100%}
        .about-quote{margin:auto 0 0;padding-top:32px}
        .about-quote blockquote{margin:0}
        .about-quote p{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(22px,1.9vw,28px);line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
        .about-quote figcaption{margin-top:12px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        @media (max-width:980px){
          .about-grid{grid-template-columns:minmax(0,1fr)}
          .about-center{order:-1;margin-bottom:24px}
          .about-btns{margin-top:0}
          .about-quote{margin-top:24px}
        }
      `}</style>
    </section>
  );
}
