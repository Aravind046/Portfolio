import { PROJECTS } from "@/lib/data";
import MiniUI from "../ui/MiniUI";

/** Project showcase: title + subtext + case-study link on the left,
 *  a tilted device mockup with a handwritten note on the right. */
export default function Work() {
  return (
    <section id="work" className="section work" aria-label="Projects">
      <div className="wrap">
        <ol className="pj-list">
          {PROJECTS.map((p) => {
            const href = p.caseStudy ?? "#contact";
            const external = !!p.caseStudy && /^https?:/.test(p.caseStudy);
            return (
              <li key={p.id} className="pj">
                <div className="pj-text">
                  <h3 className="pj-title rv">
                    {p.title}
                    <span className="pj-dot" aria-hidden="true" />
                  </h3>
                  <p className="pj-sub rv" style={{ ["--i" as string]: 1 }}>
                    {p.tagline}
                  </p>
                  <a
                    className="pj-link rv"
                    style={{ ["--i" as string]: 2 }}
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {p.caseStudy ? "View case study" : "Ask for the case study"}
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>

                <figure className="pj-stage" aria-hidden="true">
                  <span className="pj-glow" />
                  <div className="pj-device">
                    <div className="pj-screen">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" loading="lazy" />
                      ) : (
                        <MiniUI kind={p.ui} />
                      )}
                    </div>
                  </div>
                  <span className="pj-chip c1">
                    <i />
                    {p.features[0]}
                  </span>
                  <span className="pj-chip c2">
                    <i />
                    {p.features[1]}
                  </span>
                  <span className="pj-note">
                    {p.note}
                    <svg className="pj-uline" viewBox="0 0 100 8" preserveAspectRatio="none">
                      <path d="M2 6 C30 2 70 1 98 3" />
                    </svg>
                    <svg className="pj-arrow" viewBox="0 0 80 90">
                      <path d="M62 4 C70 40 50 70 10 80" />
                      <path d="M22 70 L9 80 L24 86" />
                    </svg>
                  </span>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        .work{--blue:#2f6bff}
        .pj-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:clamp(56px,8vw,120px)}
        .pj{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:center;gap:clamp(24px,4vw,64px);min-height:clamp(420px,42vw,600px)}

        .pj-title{margin:0;font-size:clamp(40px,5.4vw,84px);font-weight:700;line-height:1;letter-spacing:-.045em;color:#0d0d0d}
        .pj-dot{display:inline-block;width:.17em;height:.17em;margin-left:.1em;border-radius:50%;background:var(--blue);vertical-align:baseline}
        .pj-sub{max-width:24em;margin:clamp(18px,2.2vw,30px) 0 0;font-size:clamp(18px,1.75vw,26px);line-height:1.45;letter-spacing:-.01em;color:#5b6170}
        .pj-link{position:relative;display:inline-flex;align-items:center;gap:14px;margin-top:clamp(28px,3.6vw,52px);padding-bottom:14px;font-size:clamp(20px,1.9vw,28px);font-weight:600;letter-spacing:-.02em;color:#0d0d0d}
        .pj-link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:3px;background:var(--blue);transform-origin:left;transition:transform .5s var(--ease)}
        .pj-link svg{transition:transform .4s var(--ease)}
        .pj-link:hover svg,.pj-link:focus-visible svg{transform:translate(3px,-3px)}
        .pj-link:hover::after{transform:scaleX(1.08)}

        .pj-stage{position:relative;margin:0;height:100%;min-height:inherit;display:grid;place-items:center;perspective:1600px}
        .pj-glow{position:absolute;inset:8% 6%;border-radius:50%;background:radial-gradient(closest-side,rgba(47,107,255,.16),rgba(47,107,255,0) 72%);filter:blur(8px)}
        .pj-device{position:relative;width:min(82%,560px);padding:10px;border-radius:30px;background:linear-gradient(145deg,#2a2c31,#0e0f12);box-shadow:inset 0 0 0 1.5px #4a4d55,0 50px 90px -40px rgba(20,30,60,.45),0 18px 36px -18px rgba(20,30,60,.3);transform:rotateY(-16deg) rotateX(7deg) rotateZ(3deg);transition:transform 1s var(--ease)}
        .pj:hover .pj-device{transform:rotateY(-8deg) rotateX(4deg) rotateZ(1.5deg) translateY(-6px)}
        .pj-screen{aspect-ratio:4/3;border-radius:21px;overflow:hidden;background:linear-gradient(180deg,#fff,#eef4ff)}
        .pj-screen img{width:100%;height:100%;object-fit:cover;display:block}
        .pj-screen .mui{border-radius:0;background:transparent;padding:clamp(12px,1.8vw,24px)}

        .pj-chip{position:absolute;display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 14px 30px -16px rgba(20,30,60,.35),inset 0 0 0 1px rgba(13,13,13,.06);font-size:13px;font-weight:500;color:#1c1f26;white-space:nowrap;backdrop-filter:blur(6px);animation:pj-float 6s ease-in-out infinite}
        .pj-chip i{width:8px;height:8px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 4px rgba(47,107,255,.15)}
        .pj-chip.c1{left:2%;bottom:18%}
        .pj-chip.c2{left:8%;bottom:6%;animation-delay:-3s}
        .pj-chip.c2 i{background:#18a957;box-shadow:0 0 0 4px rgba(24,169,87,.15)}
        @keyframes pj-float{50%{transform:translateY(-8px)}}

        .pj-note{position:absolute;right:0;top:4%;max-width:9em;font-family:var(--font-hand),cursive;font-weight:500;font-size:clamp(22px,2.1vw,32px);line-height:1.05;color:#1d2a4a;transform:rotate(-5deg);text-align:center}
        .pj-uline{display:block;width:70%;height:8px;margin:6px auto 0}
        .pj-uline path{fill:none;stroke:var(--blue);stroke-width:3;stroke-linecap:round;vector-effect:non-scaling-stroke}
        .pj-arrow{position:absolute;left:-1.6em;top:62%;width:1.9em;transform:rotate(5deg);fill:none;stroke:#1d2a4a;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

        /* Rows 2 and 4: mockup on the left, text on the right (mirrored decorations). */
        .pj:nth-child(even){grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
        .pj:nth-child(even) .pj-stage{order:-1}
        .pj:nth-child(even) .pj-device{transform:rotateY(16deg) rotateX(7deg) rotateZ(-3deg)}
        .pj:nth-child(even):hover .pj-device{transform:rotateY(8deg) rotateX(4deg) rotateZ(-1.5deg) translateY(-6px)}
        .pj:nth-child(even) .pj-chip.c1{left:auto;right:2%}
        .pj:nth-child(even) .pj-chip.c2{left:auto;right:8%}
        .pj:nth-child(even) .pj-note{right:auto;left:0;transform:rotate(4deg)}
        .pj:nth-child(even) .pj-arrow{left:auto;right:-1.6em;transform:scaleX(-1) rotate(5deg)}

        @media (max-width:860px){
          .pj:nth-child(even){grid-template-columns:1fr}
          .pj:nth-child(even) .pj-stage{order:0}
          .pj:nth-child(even) .pj-note{left:2%}
          .pj{grid-template-columns:1fr;min-height:0;gap:28px}
          .pj-stage{min-height:0;aspect-ratio:1.15;padding-top:14%}
          .pj-note{top:0;right:2%;font-size:22px}
          .pj-chip{font-size:12px;padding:7px 12px}
        }
        @media (prefers-reduced-motion:reduce){.pj-chip{animation:none}.pj-device{transition:none}}
      `}</style>
    </section>
  );
}
