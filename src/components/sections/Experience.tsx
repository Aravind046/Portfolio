import { EXPERIENCE, SECTION_INDEX } from "@/lib/data";
import SectionTag from "../ui/SectionTag";

/* ------------------------------------------------------------------ helpers */

/** Placeholder-logo colours, borrowed from the hero ticket. */
const SWATCH = ["#ff5b22", "#7a5cff", "#0f6a48", "#1d8cff", "#161513", "#c8102e"];

const yearOf = (s: string) => (/present/i.test(s) ? "Now" : (s.match(/\d{4}/)?.[0] ?? s));

type Entry = {
  key: string;
  name: string; // company
  desc: string; // one line under the name
  role: string; // mono column
  years: string; // mono column
  mark: string; // placeholder logo letter
  color: string;
  logo?: string;
  now?: boolean;
};

const ENTRIES: Entry[] = EXPERIENCE.map((r, i) => ({
    key: `${r.company}-${r.start}`,
    name: r.company,
    desc: r.points[0] ?? "",
    role: r.title,
    years: `${yearOf(r.start)} — ${yearOf(r.end)}`,
    mark: r.company[0].toUpperCase(),
    color: SWATCH[i % SWATCH.length],
    logo: r.logo,
    now: /present/i.test(r.end),
  }));

/* ------------------------------------------------------------------ section */

export default function Experience() {
  return (
    <section id="experience" className="section xp" aria-labelledby="exp-title">
      <div className="wrap">
        <SectionTag index={SECTION_INDEX.experience} label="Experience" />
        <h2 id="exp-title" className="xp-title rv">
          Eight years, UI designer to Senior.
        </h2>
        <p className="xp-sub rv" style={{ ["--i" as string]: 1 }}>
          The teams I&apos;ve designed with along the way, end to end.
        </p>

        <ol className="xl" aria-label="Work history">
          {ENTRIES.map((e, i) => (
            <li key={e.key} className="xl-item rv" style={{ ["--c" as string]: e.color, ["--i" as string]: Math.min(i, 4) }}>
              <span className="xl-logo" aria-hidden="true">
                {e.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.logo} alt="" />
                ) : (
                  e.mark
                )}
              </span>
              <div className="xl-main">
                <h3>{e.name}</h3>
                <p>{e.desc}</p>
              </div>
              <span className="xl-role">{e.role}</span>
              <span className="xl-years">
                {e.now && <i aria-hidden="true" />}
                {e.years}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        .xp-title{margin:26px 0 0;font-family:var(--font-serif);font-weight:400;font-size:clamp(40px,5.2vw,76px);line-height:1.05;letter-spacing:-.015em;color:var(--ink)}
        .xp-sub{max-width:44ch;margin:clamp(14px,1.6vw,22px) 0 0;font-size:clamp(17px,1.6vw,23px);line-height:1.45;color:#5b6170}

        .xl{display:grid;gap:clamp(22px,2.6vw,40px);margin:clamp(44px,5vw,72px) 0 0;padding:0;list-style:none}
        .xl-item{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(170px,.42fr) 150px;gap:clamp(18px,2.2vw,40px);align-items:center}
        .xl-logo{display:grid;place-items:center;width:clamp(64px,5.6vw,80px);aspect-ratio:1;border-radius:24%;overflow:hidden;
          background:linear-gradient(180deg,color-mix(in srgb,var(--c) 14%,#fff),#fff 70%);
          box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--c) 16%,#fff),0 1px 0 #fff inset,0 12px 26px -18px color-mix(in srgb,var(--c) 70%,transparent);
          color:var(--c);font-size:clamp(26px,2.3vw,34px);font-weight:800;letter-spacing:-.04em;transition:transform .5s var(--ease)}
        .xl-logo img{width:62%;height:62%;object-fit:contain}
        .xl-item:hover .xl-logo{transform:translateY(-3px) rotate(-3deg)}
        .xl-main h3{margin:0;font-size:clamp(18px,1.5vw,22px);font-weight:500;letter-spacing:-.015em;line-height:1.25;color:var(--ink)}
        .xl-main p{max-width:52ch;margin:6px 0 0;font-size:clamp(15px,1.25vw,18px);line-height:1.45;color:#4b5160}
        .xl-role,.xl-years{font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5b6170}
        .xl-years{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
        .xl-years i{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.18)}

        @media (max-width:900px){
          .xl-item{grid-template-columns:auto minmax(0,1fr);align-items:start;row-gap:10px}
          .xl-role{grid-column:2}
          .xl-years{grid-column:2;margin-top:-4px}
          .xl-role,.xl-years{font-size:11px}
        }
      `}</style>
    </section>
  );
}
