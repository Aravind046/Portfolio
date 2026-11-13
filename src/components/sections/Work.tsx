"use client";

import { useState } from "react";
import { PROJECTS, SECTION_INDEX } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import Heading from "../ui/Heading";
import MiniUI from "../ui/MiniUI";

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work-head">
          <div>
            <SectionTag index={SECTION_INDEX.work} label="Selected work" />
            <Heading id="work-title" className="work-title" lines={["Things I've"]} accent="designed." />
          </div>
          <p className="lede rv work-lede">
            Pieces of work named in my résumé, in my own words from it. The sketches are illustrative,
            not screenshots.
          </p>
        </div>

        <ul className="acc rv">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <li
                key={p.id}
                className={`acc-panel${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) setOpen(i);
                }}
              >
                <h3 className="acc-h">
                  <button
                    type="button"
                    className="acc-spine"
                    aria-expanded={isOpen}
                    aria-controls={`panel-${p.id}`}
                    id={`tab-${p.id}`}
                    onClick={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                  >
                    <span className="acc-num mono">{p.index}</span>
                    <span className="acc-vtitle">{p.title}</span>
                    <span className="acc-plus" aria-hidden="true">
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className="acc-body"
                  id={`panel-${p.id}`}
                  role="region"
                  aria-labelledby={`tab-${p.id}`}
                  inert={!isOpen}
                >
                  <div className="acc-inner">
                    <div className="acc-text">
                      <p className="acc-kicker mono">
                        <b>{p.index}</b> — {p.kicker}
                      </p>
                      <p className="acc-title">{p.title}</p>
                      <p className="acc-desc">{p.description}</p>
                      <ul className="acc-feat">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <div className="acc-foot">
                        <span className="chip">Role · {p.role}</span>
                        {p.github && (
                          <a href={p.github} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                            View on GitHub <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <figure className="acc-ui">
                      <MiniUI kind={p.ui} />
                      <figcaption className="mono">Illustrative UI</figcaption>
                    </figure>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .work-head{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-bottom:44px}
        .work-title{margin:22px 0 0}
        .work-lede{max-width:380px;margin:0}
        .acc{--spine:76px;--gap:10px;list-style:none;margin:0;padding:0;display:flex;gap:var(--gap);height:min(78svh,600px);container-type:inline-size}
        .acc-panel{position:relative;flex:0 0 var(--spine);min-width:0;border-radius:26px;background:#fff;box-shadow:var(--hair);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease),background-color .5s var(--ease)}
        .acc-panel.is-open{flex-grow:1;box-shadow:var(--hair),var(--lift)}
        .acc-panel:not(.is-open):hover{background:#fbfaf8}
        .acc-h{margin:0;position:absolute;inset:0 auto 0 0;width:var(--spine);z-index:2}
        .acc-spine{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;border-radius:26px;text-align:center}
        .acc-panel.is-open .acc-h{pointer-events:none;opacity:0;transition:opacity .2s}
        .acc-panel.is-open .acc-spine{pointer-events:auto}
        .acc-num{font-size:12px;color:var(--mute)}
        .acc-vtitle{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:17px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:calc(100% - 100px)}
        .acc-plus{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:18px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:transform .6s var(--ease),background-color .4s,color .4s}
        .acc-spine:hover .acc-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
        .acc-body{position:absolute;inset:0;width:calc(100cqw - (${PROJECTS.length - 1} * (var(--spine) + var(--gap))));opacity:0;transition:opacity .4s var(--ease)}
        .acc-panel.is-open .acc-body{opacity:1;transition:opacity .7s var(--ease) .25s}
        .acc-inner{height:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(18px,2.4vw,36px);padding:clamp(20px,2.6vw,36px)}
        .acc-text{display:flex;flex-direction:column;min-width:0}
        .acc-kicker{margin:0;font-size:11.5px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em}
        .acc-kicker b{color:var(--ink);font-weight:500}
        .acc-title{margin:14px 0 0;font-weight:700;font-size:clamp(28px,3vw,44px);letter-spacing:-.045em;line-height:1}
        .acc-desc{margin:16px 0 0;color:var(--ink-2);font-size:15.5px;line-height:1.6}
        .acc-feat{list-style:none;margin:20px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:0 16px}
        .acc-feat li{padding:9px 0 9px 16px;border-top:1px solid var(--line);font-size:13.5px;position:relative}
        .acc-feat li::before{content:"";position:absolute;left:0;top:50%;width:7px;height:1px;background:var(--ink)}
        .acc-foot{margin-top:auto;padding-top:20px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
        .acc-ui{position:relative;margin:0;min-height:0;clip-path:inset(0 100% 0 0 round 20px);transition:clip-path 1.1s var(--ease)}
        .acc-panel.is-open .acc-ui{clip-path:inset(0 0 0 0 round 20px);transition-delay:.3s}
        .acc-ui figcaption{position:absolute;left:14px;bottom:12px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--mute);background:rgba(255,255,255,.85);padding:4px 8px;border-radius:999px}
        @media (max-width:1100px){.acc-inner{grid-template-columns:minmax(0,1fr)}.acc-ui{display:none}}
        @media (max-width:900px){
          .work-head{flex-direction:column;align-items:flex-start}
          .acc{flex-direction:column;height:auto;container-type:normal}
          .acc-panel{flex:none}
          .acc-h{position:relative;inset:auto;width:auto}
          .acc-panel.is-open .acc-h{opacity:1;pointer-events:auto}
          .acc-spine{flex-direction:row;padding:18px 20px;gap:14px;justify-content:flex-start}
          .acc-vtitle{writing-mode:horizontal-tb;transform:none;text-align:left;flex:1;max-height:none}
          .acc-panel.is-open .acc-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
          .acc-body{position:relative;inset:auto;width:auto;display:grid;grid-template-rows:0fr;transition:grid-template-rows .7s var(--ease),opacity .5s}
          .acc-panel.is-open .acc-body{grid-template-rows:1fr}
          .acc-inner{overflow:hidden;min-height:0;padding:0 20px;grid-template-columns:minmax(0,1fr)}
          .acc-panel.is-open .acc-inner{padding-bottom:20px}
          .acc-ui{display:block;height:300px}
          .acc-title{display:none}
          .acc-feat{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
