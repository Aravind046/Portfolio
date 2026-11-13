"use client";

import { useState } from "react";
import { PROFILE, SECTION_INDEX } from "@/lib/data";
import SectionTag from "../ui/SectionTag";

const LINES = ["Let's build", "something together."];

function HopLine({ text, accentFrom }: { text: string; accentFrom?: number }) {
  const words = text.split(" ");
  let n = 0;
  return (
    <span className="hop-line" aria-hidden="true">
      {words.map((w, wi) => (
        <span key={wi} className={`hop-word${accentFrom !== undefined && wi >= accentFrom ? " accent" : ""}`}>
          {[...w].map((ch) => (
            <span
              key={n++}
              className="hop"
              onPointerEnter={(e) => {
                const el = e.currentTarget;
                el.classList.remove("go");
                void el.offsetWidth;
                el.classList.add("go");
              }}
              onAnimationEnd={(e) => e.currentTarget.classList.remove("go")}
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = PROFILE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const links = [
    { k: "Phone", label: PROFILE.phone, href: PROFILE.phoneHref, ext: false },
    PROFILE.github ? { k: "GitHub", label: "GitHub", href: PROFILE.github, ext: true } : null,
    { k: "LinkedIn", label: PROFILE.name, href: PROFILE.linkedin, ext: true },
    { k: "Portfolio", label: "Portfolio link", href: PROFILE.portfolio, ext: true },
  ].filter(Boolean) as { k: string; label: string; href: string; ext: boolean }[];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionTag index={SECTION_INDEX.contact} label="Contact" />
        <h2 id="contact-title" className="contact-title rv" aria-label={LINES.join(" ")}>
          <HopLine text={LINES[0]} />
          <HopLine text={LINES[1]} accentFrom={1} />
        </h2>

        <div className="contact-grid">
          <div className="contact-mail rv">
            <p className="mono contact-k">Email</p>
            <div className="contact-mail-row">
              <a className="contact-email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <button type="button" className="chip copy" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only-focusable" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
          </div>

          <ul className="contact-links rv" style={{ ["--i" as string]: 1 }}>
            {links.map((l) => (
              <li key={l.k}>
                <span className="mono contact-k">{l.k}</span>
                <a href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {l.label}
                  {l.ext && (
                    <>
                      <span aria-hidden="true"> ↗</span>
                      <span className="sr-only-focusable"> (opens in a new tab)</span>
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>

          <a className="badge" href={`mailto:${PROFILE.email}`}>
            <span className="sr-only-focusable">Say hello by email</span>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
              </defs>
              <text>
                <textPath href="#badge-circle" startOffset="0">
                  SAY HELLO · SAY HELLO · SAY HELLO · SAY HELLO ·
                </textPath>
              </text>
            </svg>
            <span className="badge-core" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>

      <style>{`
        .contact{padding-bottom:clamp(64px,10vh,120px)}
        .contact-title{margin:22px 0 clamp(40px,6vw,72px);font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(46px,9vw,148px)}
        .hop-line{display:block}
        .hop-word{display:inline-block;white-space:pre}
        .hop-word.accent{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.025em;color:var(--mute)}
        .hop{display:inline-block}
        .hop.go{animation:hop .6s var(--ease)}
        @keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:none}}
        .contact-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) auto;gap:clamp(24px,4vw,64px);align-items:end}
        .contact-k{display:block;margin:0 0 8px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        .contact-mail-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px}
        .contact-email{font-size:clamp(22px,2.9vw,42px);font-weight:600;letter-spacing:-.04em;line-height:1.15;overflow-wrap:anywhere;background:linear-gradient(currentColor,currentColor) 0 100%/100% 2px no-repeat;padding-bottom:4px;transition:background-size .6s var(--ease)}
        .contact-email:hover{background-size:0 2px;background-position:100% 100%}
        .copy{cursor:pointer;transition:background-color .3s,color .3s}
        .copy:hover{background:var(--ink);color:#fff}
        .contact-links{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
        .contact-links li{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
        .contact-links .contact-k{margin:0}
        .contact-links a{font-weight:500;font-size:16px;transition:opacity .3s}
        .contact-links a:hover{opacity:.6}
        .badge{position:relative;display:grid;place-items:center;width:150px;height:150px;border-radius:50%}
        .badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
        .badge text{font-family:var(--font-mono);font-size:15.5px;letter-spacing:.2em;fill:var(--ink)}
        .badge-core{width:58px;height:58px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px;transition:transform .6s var(--ease)}
        .badge:hover .badge-core{transform:rotate(45deg) scale(1.08)}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media (max-width:980px){
          .contact-grid{grid-template-columns:minmax(0,1fr)}
          .badge{justify-self:start}
        }
      `}</style>
    </section>
  );
}
