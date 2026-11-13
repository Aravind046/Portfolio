"use client";

import { useState } from "react";
import { ALL_SKILLS, SECTION_INDEX, SKILL_GROUPS, type Skill, type SkillFamily } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import Heading from "../ui/Heading";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

const FAMILIES = SKILL_GROUPS.map((g) => g.family);

export default function Skills() {
  const [filter, setFilter] = useState<SkillFamily | "All">("All");
  const [current, setCurrent] = useState<Skill>(ALL_SKILLS[0]);
  const num = (s: Skill) => ALL_SKILLS.indexOf(s) + 1;
  const tint = BRAND[current.key]?.tint;

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionTag index={SECTION_INDEX.skills} label="Skills & tools" />
        <Heading id="skills-title" className="skills-title" lines={["The periodic table"]} accent="of my craft." />
        <p className="lede rv skills-lede">
          Every design tool and skill from my résumé, set as an element. Hover or focus a tile to inspect it.
        </p>

        <div className="chips rv" role="group" aria-label="Filter by family">
          {(["All", ...FAMILIES] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`fchip${filter === f ? " on" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ptable">
          <ul className="pgrid rv-group" aria-label="Skills">
            {ALL_SKILLS.map((s, i) => {
              const dim = filter !== "All" && s.family !== filter;
              return (
                <li
                  key={s.key}
                  style={{
                    ["--r8" as string]: Math.floor(i / 8),
                    ["--c8" as string]: i % 8,
                    ["--r4" as string]: Math.floor(i / 4),
                    ["--c4" as string]: i % 4,
                  }}
                >
                  <button
                    type="button"
                    className={`el${dim ? " dim" : ""}${current.key === s.key ? " cur" : ""}`}
                    data-family={s.family}
                    onMouseEnter={() => setCurrent(s)}
                    onFocus={() => setCurrent(s)}
                    onClick={() => setCurrent(s)}
                    aria-label={`${s.name}, ${s.family}`}
                    aria-controls="inspector"
                  >
                    <span className="el-n mono">{String(num(s)).padStart(2, "0")}</span>
                    <span className="el-sym">{s.symbol}</span>
                    <span className="el-name">{s.name}</span>
                    <span className="el-fam mono">{s.family}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside id="inspector" className="inspector card rv" aria-label="Skill inspector">
            <div className="insp-top mono">
              <span>No. {String(num(current)).padStart(2, "0")}</span>
              <span>{current.symbol}</span>
            </div>
            <div className="insp-logo" key={current.key} style={tint ? { ["--tint" as string]: tint } : undefined}>
              {tint && <span className="insp-glow" aria-hidden="true" />}
              <span className={`insp-pop${isBrand(current.key) ? "" : " concept"}`}>
                <TechLogo k={current.key} size={150} label={isBrand(current.key) ? undefined : `${current.name} icon`} />
              </span>
            </div>
            <h3 className="insp-name">{current.name}</h3>
            <dl className="insp-meta">
              <div>
                <dt className="mono">Family</dt>
                <dd>{current.family}</dd>
              </div>
              <div>
                <dt className="mono">Listed under</dt>
                <dd>{current.source}</dd>
              </div>
              <div>
                <dt className="mono">Group</dt>
                <dd>{SKILL_GROUPS.find((g) => g.family === current.family)?.blurb}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>

      <style>{`
        .skills-title{margin:22px 0 18px}
        .skills-lede{max-width:520px;margin:0 0 28px}
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
        .fchip{height:36px;padding:0 16px;border-radius:999px;font-size:13.5px;font-weight:500;color:var(--ink-2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.16);transition:background-color .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .fchip:hover{transform:translateY(-1px);color:var(--ink)}
        .fchip.on{background:var(--ink);color:#fff;box-shadow:none}
        .ptable{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
        .pgrid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
        .pgrid li{--d:calc((var(--r8) + var(--c8)) * 40ms);opacity:0;transform:translateY(18px) scale(.96)}
        .pgrid.is-in li{animation:wave .9s var(--ease) both;animation-delay:var(--d)}
        @keyframes wave{to{opacity:1;transform:none}}
        .el{position:relative;width:100%;aspect-ratio:1/1.12;display:flex;flex-direction:column;align-items:flex-start;padding:10px 10px 9px;border-radius:16px;background:#fff;box-shadow:var(--hair);text-align:left;overflow:hidden;transition:transform .5s var(--ease),box-shadow .5s var(--ease),opacity .5s var(--ease),background-color .4s var(--ease),color .4s var(--ease)}
        .el:hover,.el:focus-visible{transform:translateY(-4px);box-shadow:var(--hair),var(--lift)}
        .el.cur{background:var(--ink);color:#fff}
        .el.cur .el-n,.el.cur .el-fam{color:rgba(255,255,255,.6)}
        .el.dim{opacity:.18}
        .el-n{font-size:10.5px;color:var(--mute)}
        .el-sym{margin-top:auto;font-weight:700;font-size:clamp(24px,2.4vw,36px);letter-spacing:-.05em;line-height:1}
        .el-name{margin-top:6px;font-size:12px;font-weight:500;line-height:1.2;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .el-fam{margin-top:2px;font-size:9.5px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        .inspector{position:sticky;top:96px;width:320px;padding:20px;display:flex;flex-direction:column}
        .insp-top{display:flex;justify-content:space-between;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        .insp-logo{position:relative;height:210px;display:grid;place-items:center}
        .insp-glow{position:absolute;width:180px;height:180px;border-radius:50%;background:var(--tint);opacity:.16;filter:blur(40px)}
        .insp-pop{position:relative;display:block;animation:pop .7s var(--ease) both}
        .insp-pop.concept{color:var(--ink)}
        @keyframes pop{from{opacity:0;transform:scale(.6) rotate(-8deg)}60%{opacity:1}to{opacity:1;transform:none}}
        .insp-name{margin:4px 0 14px;font-size:24px;font-weight:700;letter-spacing:-.035em;line-height:1.1}
        .insp-meta{margin:0;padding:0;border-top:1px solid var(--line)}
        .insp-meta div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:14px}
        .insp-meta dt{font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em;padding-top:2px}
        .insp-meta dd{margin:0;font-weight:500;text-align:right}
        @media (max-width:1060px){
          .ptable{grid-template-columns:minmax(0,1fr)}
          .inspector{position:relative;top:auto;width:100%}
        }
        @media (max-width:640px){
          .pgrid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
          .pgrid li{--d:calc((var(--r4) + var(--c4)) * 40ms)}
          .el{padding:8px 7px;border-radius:12px}
          .el-name{font-size:10.5px}
          .el-fam{display:none}
        }
      `}</style>
    </section>
  );
}
