"use client";

import { HERO } from "@/lib/data";
import VenomButton from "./VenomButton";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

/** Right column: pill, oversized two-weight headline, facts row, description, CTAs. */
export default function HeroIntro() {
  return (
    <div className="hi">
      <p className="hi-pill hi-in" style={d(0.35)}>
        {HERO.pill}
      </p>

      <h1 id="hero-title" className="hi-title">
        {HERO.headline.map((line, i) => (
          <span key={i} className="hi-line">
            <span style={d(0.45 + i * 0.12)}>
              <b>{line.strong}</b> <span className="hi-light">{line.light}</span>
            </span>
          </span>
        ))}
      </h1>

      {/* Every item carries a leading dot; the wrapper clips the one that starts each line. */}
      <div className="hi-facts hi-in" style={d(0.8)}>
        <ul>
          {HERO.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <p className="hi-desc hi-in" style={d(0.9)}>
        {HERO.description}
      </p>

      <div className="hi-ctas hi-in" style={d(1)}>
        <VenomButton href="#work">See my work</VenomButton>
      </div>

      <style>{`
        .hi{min-width:0;color:#2b2b2b}
        .hi-pill{display:inline-flex;align-items:center;gap:12px;margin:0 0 clamp(26px,3.6vw,44px);padding:0 20px;height:clamp(38px,3vw,44px);
          border-radius:999px;background:#f1f1f0;box-shadow:inset 0 0 0 1px rgba(13,13,13,.14);
          font-size:clamp(13px,1.1vw,16px);font-weight:450;letter-spacing:-.005em;color:#2b2b2b;max-width:100%;white-space:nowrap}

        .hi-title{margin:0;font-size:clamp(44px,6.1vw,92px);line-height:1.04;letter-spacing:-.03em;color:#2b2b2b}
        .hi-line{display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.06em}
        .hi-line>span{display:block;animation:hiUp 1.25s var(--ease) both;animation-delay:var(--d)}
        .hi-title b,.hi-light{display:inline-block;white-space:nowrap}
        .hi-title b{font-weight:700;letter-spacing:-.034em}
        .hi-light{letter-spacing:-.022em}
        .hi-light{font-weight:300}
        @keyframes hiUp{from{transform:translateY(108%)}to{transform:none}}

        .hi-facts{--m:clamp(10px,1.4vw,20px);overflow:hidden;margin:clamp(24px,3vw,40px) 0 0;font-size:clamp(15px,1.35vw,20px);letter-spacing:-.01em;color:#333}
        .hi-facts ul{display:flex;flex-wrap:wrap;align-items:center;gap:6px 0;margin:0 0 0 calc(-5px - 2 * var(--m));padding:0;list-style:none}
        .hi-facts li{display:inline-flex;align-items:center;white-space:nowrap}
        .hi-facts li::before{content:"";width:5px;height:5px;margin:0 var(--m);border-radius:50%;background:currentColor}

        .hi-desc{max-width:44ch;margin:clamp(16px,1.6vw,22px) 0 0;font-size:clamp(15px,1.1vw,17px);line-height:1.6;color:var(--mute)}
        .hi-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:clamp(26px,3vw,38px)}

        .hi-in{animation:hiFade 1.1s var(--ease) both;animation-delay:var(--d)}
        @keyframes hiFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

        @media (max-width:520px){
          .hi-pill{padding:0 14px;gap:9px;font-size:12.5px}
          .hi-title{font-size:10.3vw}
          .hi-ctas .btn{height:46px;padding:0 20px}
        }
        @media (max-width:360px){.hi-pill{white-space:normal;height:auto;padding:8px 14px}}
      `}</style>
    </div>
  );
}
