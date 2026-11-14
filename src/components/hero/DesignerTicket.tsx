"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { HERO, PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const T = HERO.ticket;
const B = T.back;

/** Deterministic barcode: [x, width] pairs from the serial, Code-128-ish rhythm. */
function barcode(seed: string) {
  const out: [number, number][] = [];
  let x = 0;
  for (let i = 0; x < 196; i++) {
    const c = seed.charCodeAt(i % seed.length) * (i + 3);
    const w = 1 + (c % 4) * 0.9;
    out.push([x, w]);
    x += w + 1.4 + ((c >> 3) % 3) * 0.9;
  }
  return out;
}
const BARS = barcode(T.serial + PROFILE.name);

/** Lucide "arrow-down-right" (ISC), inlined so no extra dependency is needed. */
function ArrowDownRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7 7 10 10" />
      <path d="M17 7v10H7" />
    </svg>
  );
}

/** Lucide "mouse-pointer-2" (ISC). */
function Pointer() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.04 4.84a.6.6 0 0 1 .8-.8l16 6.5a.6.6 0 0 1-.07 1.14l-6.12 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.12a.6.6 0 0 1-1.14.07z"
        fill="#fff"
        stroke="#121212"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The colour band used on both faces (front: thin strip, back: header art). */
function Band({ tall }: { tall?: boolean }) {
  return tall ? (
    <svg className="tk-shapes" viewBox="0 0 100 33" aria-hidden="true">
      <path d="M0 0 H16 A16 16 0 0 1 0 16 Z" fill="var(--tk-orange)" />
      <circle cx="30" cy="21" r="8" fill="var(--tk-blue)" />
      <path d="M43 33 V18 A7 7 0 0 1 57 18 V33 Z" fill="var(--tk-purple)" />
      <path d="M61 33 A12 12 0 0 1 85 33 Z" fill="var(--tk-green)" />
      <circle cx="74" cy="9" r="4.5" fill="var(--tk-orange)" />
      <path d="M86 0 A14 14 0 0 0 100 14 V0 Z" fill="var(--tk-purple)" />
    </svg>
  ) : (
    <svg className="tk-shapes" viewBox="0 0 100 9" aria-hidden="true">
      <path d="M0 0 H7 A7 7 0 0 1 0 7 Z" fill="var(--tk-orange)" />
      <circle cx="19" cy="5" r="3.2" fill="var(--tk-blue)" />
      <path d="M29 9 V5.2 A3 3 0 0 1 35 5.2 V9 Z" fill="var(--tk-purple)" />
      <path d="M44 9 A5.5 5.5 0 0 1 55 9 Z" fill="var(--tk-green)" />
      <circle cx="65" cy="4.5" r="3.2" fill="var(--tk-orange)" />
      <path d="M75 9 V5.2 A3 3 0 0 1 81 5.2 V9 Z" fill="var(--tk-blue)" />
      <path d="M93 0 A7 7 0 0 0 100 7 V0 Z" fill="var(--tk-purple)" />
    </svg>
  );
}

function Grommet() {
  return (
    <span className="tk-grommet" aria-hidden="true">
      <i />
    </span>
  );
}

/**
 * A hanging, die-cut event pass. Segments are masked individually so the
 * concave corners of neighbours form the side notches at each perforation.
 * Flips to its back on hover (mouse), tap (touch) or Enter / Space (keyboard).
 * Entrance: drops in on its cord, then idles.
 */
export default function DesignerTicket() {
  // `n` counts flips so the lift animation restarts on every turn (not on first paint).
  const [{ on: flipped, n }, setFlip] = useState({ on: false, n: 0 });
  const pointer = useRef("mouse");
  const flip = (next: boolean | ((on: boolean) => boolean)) =>
    setFlip((s) => {
      const on = typeof next === "function" ? next(s.on) : next;
      return on === s.on ? s : { on, n: s.n + 1 };
    });

  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) return; // links keep working
    if (pointer.current !== "mouse") flip((f) => !f);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    flip((f) => !f);
  };

  return (
    <div className="tk-drop">
      <div className="tk-hang">
        <span className="tk-cord" aria-hidden="true">
          <i />
          <i />
        </span>
        {/* Knot where the two strands meet, then a loop running down through the eyelet. */}
        <svg className="tk-knot" viewBox="0 0 10 12" aria-hidden="true">
          <defs>
            <radialGradient id="tkKnotFill" cx="38%" cy="32%" r="75%">
              <stop offset="0" stopColor="#4a4743" />
              <stop offset=".55" stopColor="#1d1b19" />
              <stop offset="1" stopColor="#0c0b0a" />
            </radialGradient>
          </defs>
          <path className="tk-loop" d="M4.15 6.4 C3 8.4 3.1 10.6 4.4 12.3" />
          <path className="tk-loop" d="M5.85 6.4 C7 8.4 6.9 10.6 5.6 12.3" />
          <ellipse cx="5" cy="7.5" rx="1.8" ry=".5" fill="rgba(0,0,0,.25)" />
          <ellipse cx="5" cy="4.7" rx="2.1" ry="2.6" fill="url(#tkKnotFill)" />
          <path className="tk-wrap" d="M3.1 3.8 Q5 5.2 6.9 3.8" />
          <path className="tk-wrap" d="M3.05 5.55 Q5 6.95 6.95 5.55" />
          <path className="tk-wrap tk-wrap-hi" d="M3.9 2.75 Q4.5 2.4 5.2 2.5" />
        </svg>

        {/* Hover is read from this box, which never rotates, so the card can't flicker at its edge mid-turn. */}
        <div
          className="tk-hit"
          tabIndex={0}
          role="group"
          aria-roledescription="flip card"
          aria-label={`Designer pass for ${PROFILE.name}. Press Enter to flip.`}
          onPointerDown={(e) => (pointer.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && flip(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && flip(false)}
          onClick={onClick}
          onKeyDown={onKeyDown}
        >
        <div className={`tk-swing${n ? (n % 2 ? " swing-a" : " swing-b") : ""}`}>
        <div className={`tk${flipped ? " is-flipped" : ""}`}>
          <article className="tk-face tk-front" inert={flipped}>
            {/* 1 · Header */}
            <div className="tk-seg tk-head">
              <Grommet />
              <div>
                <p className="tk-word">{PROFILE.firstName}</p>
                <p className="tk-edition">{T.edition}</p>
              </div>
              <svg className="tk-mark" viewBox="0 0 41 41" aria-hidden="true">
                <path d="M0 20 A20 20 0 0 1 20 0 V20 Z" fill="var(--tk-orange)" />
                <path d="M21 0 A10 10 0 0 1 21 20 Z" fill="var(--tk-purple)" />
                <circle cx="10" cy="31" r="9.5" fill="var(--tk-blue)" />
                <path d="M21 21 H41 A20 20 0 0 1 21 41 Z" fill="var(--tk-green)" />
              </svg>
            </div>

            {/* 2 · Identity */}
            <div className="tk-seg tk-meta">
              <ul className="tk-mono">
                {T.role.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <span className="tk-vr" aria-hidden="true" />
              <ul className="tk-mono">
                {T.meta.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>

            {/* 3 · Poster strip + portrait */}
            <div className="tk-seg tk-art">
              <div className="tk-poster">
                <Band />
              </div>
              <div className="tk-photo">
                <Image src={T.portrait} alt={`Illustrated portrait of ${PROFILE.name}`} width={720} height={720} sizes="(max-width: 719px) 300px, 350px" />
                <span className="tk-cursor" aria-hidden="true">
                  <Pointer />
                  <b>{PROFILE.firstName}</b>
                </span>
              </div>
            </div>

            {/* 4 · Pass details */}
            <dl className="tk-seg tk-info">
              {T.info.map((r) => (
                <div key={r.k}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>

            {/* 5 · Stub */}
            <div className="tk-seg tk-stub">
              <div className="tk-code">
                <svg viewBox="0 0 198 40" preserveAspectRatio="none" aria-hidden="true">
                  {BARS.map(([x, w], i) => (
                    <rect key={i} x={x} y="0" width={w} height="40" />
                  ))}
                </svg>
                <p>{T.serial}</p>
              </div>
              <span className="tk-vr" aria-hidden="true" />
              <a
                href="#work"
                className="tk-enter"
                aria-label="See my work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#work");
                }}
              >
                <ArrowDownRight />
                <small>#work</small>
              </a>
            </div>
            <div className="tk-tear" aria-hidden="true" />
          </article>

          {/* Back */}
          <article className="tk-face tk-back" inert={!flipped} aria-label={B.title}>
            <div className="tk-seg tk-bhead">
              <Grommet />
              <div className="tk-poster tk-band">
                <Band tall />
              </div>
            </div>

            <div className="tk-seg tk-bmain">
              <h2 className="tk-btitle">
                {B.title}
              </h2>
              {B.groups.map((g, i) => (
                <section key={g.k} className="tk-group">
                  <h3>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {g.k}
                  </h3>
                  <ul className={"strong" in g ? "is-stack" : undefined}>
                    {g.chips.map((c) => (
                      <li key={c} className={/^[\d–-]+$/.test(c) ? "is-year" : undefined}>
                        {c}
                      </li>
                    ))}
                    {"strong" in g && <li className="is-strong">{g.strong}</li>}
                  </ul>
                </section>
              ))}
            </div>

            <div className="tk-seg tk-bsign">
              {/* Signed on the line, with a flourish under the name. */}
              <div className="tk-sigbox">
                <span className="tk-x" aria-hidden="true">×</span>
                <p className="tk-sig">{B.signature}</p>
                <svg className="tk-flourish" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M6 22 C38 30 70 8 112 14 S170 26 186 12 C192 6 184 2 176 9" />
                </svg>
                <p className="tk-sigline">
                  <span>Signature</span>
                  <span>{T.edition.replace("Portfolio ", "")}</span>
                </p>
              </div>
              <p className="tk-found-label">{B.found}</p>
              <p className="tk-found">
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </p>
            </div>
            <div className="tk-tear" aria-hidden="true" />
          </article>
        </div>
        </div>
        </div>
      </div>

      <style>{`
        .tk-drop{
          --tk-paper:#f1ece1;--tk-ink:#161513;--tk-mute:#6e6a61;--tk-rule:rgba(22,21,19,.3);
          --tk-orange:#ff5b22;--tk-purple:#7a5cff;--tk-green:#0f6a48;--tk-blue:#1d8cff;
          --tk-noise:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .27 0 0 0 0 .2 0 0 0 .34 -.14'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          --tk-mottle:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='2' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .25 0 0 0 .14 -.04'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E");
          container-type:inline-size;
          width:100%;
          animation:tkDrop 1.5s cubic-bezier(.2,.8,.2,1) .1s both;
        }
        @keyframes tkDrop{
          0%{transform:translateY(-75vh)}
          62%{transform:translateY(1.6cqi)}
          80%{transform:translateY(-.6cqi)}
          100%{transform:none}
        }
        .tk-hang{position:relative;transform-origin:50% -60vh;animation:tkSway 9s ease-in-out 1.6s infinite alternate}
        @keyframes tkSway{0%{transform:rotate(-.45deg)}100%{transform:rotate(.45deg)}}

        .tk-cord{position:absolute;left:50%;bottom:calc(100% - .6cqi);width:0;height:150vh;z-index:4;pointer-events:none}
        .tk-knot{position:absolute;left:45cqi;top:-4.4cqi;width:10cqi;height:12cqi;z-index:5;overflow:visible;pointer-events:none;filter:drop-shadow(0 .3cqi .4cqi rgba(0,0,0,.25))}
        .tk-loop{fill:none;stroke:#1b1a18;stroke-width:1.7px;stroke-linecap:round;vector-effect:non-scaling-stroke}
        .tk-wrap{fill:none;stroke:rgba(255,255,255,.16);stroke-width:.8px;stroke-linecap:round;vector-effect:non-scaling-stroke}
        .tk-wrap-hi{stroke:rgba(255,255,255,.35)}
        .tk-cord i{position:absolute;bottom:0;left:-.85px;width:1.7px;height:100%;border-radius:2px;background:#1b1a18;transform-origin:50% 100%}
        .tk-cord i:first-child{transform:translateX(-.4cqi) rotate(-.12deg)}
        .tk-cord i:last-child{transform:translateX(.4cqi) rotate(.12deg)}

        .tk-hit{position:relative;cursor:pointer;border-radius:2cqi}
        .tk-hit::before{content:"";position:absolute;inset:-14px}/* a little slack so the idle sway never drags the edge out from under the cursor */
        .tk-hit:focus-visible{outline:2px solid var(--ink);outline-offset:6px}
        /* Turning over sets the tag swinging on its eyelet: a small, damped pendulum. */
        .tk-swing{transform-style:preserve-3d;transform-origin:50% 7.6cqi}
        .tk-swing.swing-a{animation:tkSwingA 1.9s both}
        .tk-swing.swing-b{animation:tkSwingB 1.9s both}
        @keyframes tkSwingA{
          0%{transform:rotate(0);animation-timing-function:cubic-bezier(.3,0,.5,1)}
          20%{transform:rotate(2.6deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          42%{transform:rotate(-1.5deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          62%{transform:rotate(.8deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          81%{transform:rotate(-.35deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          100%{transform:rotate(0)}
        }
        @keyframes tkSwingB{
          0%{transform:rotate(0);animation-timing-function:cubic-bezier(.3,0,.5,1)}
          20%{transform:rotate(-2.6deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          42%{transform:rotate(1.5deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          62%{transform:rotate(-.8deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          81%{transform:rotate(.35deg);animation-timing-function:cubic-bezier(.45,0,.55,1)}
          100%{transform:rotate(0)}
        }
        .tk{position:relative;transform-style:preserve-3d;transform:perspective(1600px) rotateY(0deg);transition:transform .8s cubic-bezier(.45,.05,.25,1)}
        .tk.is-flipped{transform:perspective(1600px) rotateY(180deg)}
        .tk-face{margin:0;color:var(--tk-ink);-webkit-backface-visibility:hidden;backface-visibility:hidden;
          filter:drop-shadow(0 1px 1px rgba(40,30,15,.12)) drop-shadow(0 10px 14px rgba(40,30,15,.08)) drop-shadow(0 34px 44px rgba(40,30,15,.16))}
        .tk-back{position:absolute;inset:0;display:flex;flex-direction:column;transform:rotateY(180deg)}

        /* Die-cut segments: concave corners on every segment → notches at seams. */
        .tk-seg{
          --r:2.4cqi;--rt:var(--r);--rb:var(--r);
          position:relative;margin:0;
          background-color:var(--tk-paper);
          background-image:var(--tk-noise),var(--tk-mottle);
          background-size:180px 180px,400px 400px;
          -webkit-mask:
            radial-gradient(circle at 0 0,#0000 var(--rt),#000 calc(var(--rt) + .5px)) 0 0/51% 51% no-repeat,
            radial-gradient(circle at 100% 0,#0000 var(--rt),#000 calc(var(--rt) + .5px)) 100% 0/51% 51% no-repeat,
            radial-gradient(circle at 0 100%,#0000 var(--rb),#000 calc(var(--rb) + .5px)) 0 100%/51% 51% no-repeat,
            radial-gradient(circle at 100% 100%,#0000 var(--rb),#000 calc(var(--rb) + .5px)) 100% 100%/51% 51% no-repeat;
          mask:
            radial-gradient(circle at 0 0,#0000 var(--rt),#000 calc(var(--rt) + .5px)) 0 0/51% 51% no-repeat,
            radial-gradient(circle at 100% 0,#0000 var(--rt),#000 calc(var(--rt) + .5px)) 100% 0/51% 51% no-repeat,
            radial-gradient(circle at 0 100%,#0000 var(--rb),#000 calc(var(--rb) + .5px)) 0 100%/51% 51% no-repeat,
            radial-gradient(circle at 100% 100%,#0000 var(--rb),#000 calc(var(--rb) + .5px)) 100% 100%/51% 51% no-repeat;
        }
        .tk-seg+.tk-seg::before{content:"";position:absolute;top:0;left:calc(var(--r) + 1.6cqi);right:calc(var(--r) + 1.6cqi);height:1px;
          background:repeating-linear-gradient(90deg,var(--tk-rule) 0 1.3cqi,transparent 1.3cqi 2.3cqi)}
        .tk-seg::after{content:"";position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.55)}

        .tk-mono{margin:0;padding:0;list-style:none;font-family:var(--font-mono);font-size:max(7.5px,2.75cqi);line-height:1.5;letter-spacing:.05em;text-transform:uppercase}
        .tk-vr{align-self:stretch;width:1px;background:var(--tk-rule)}

        /* 1 */
        .tk-head{--r:2cqi;display:flex;justify-content:space-between;align-items:flex-start;padding:10cqi 6.5cqi 6cqi}
        .tk-grommet{position:absolute;left:50%;top:3.2cqi;width:8.8cqi;height:8.8cqi;margin-left:-4.4cqi;border-radius:50%;
          background:radial-gradient(circle at 34% 28%,#5b5a57,#1a1918 52%,#0b0b0a 100%);
          box-shadow:0 .5cqi .9cqi rgba(0,0,0,.28),inset 0 .3cqi .3cqi rgba(255,255,255,.18)}
        .tk-grommet i{position:absolute;inset:2.3cqi;border-radius:50%;background:var(--hero-bg,#fbfbfa);box-shadow:inset 0 .5cqi .7cqi rgba(0,0,0,.45)}
        .tk-word{margin:0;font-weight:700;font-size:10.4cqi;line-height:1;letter-spacing:-.05em}
        .tk-edition{display:inline-block;margin:2.6cqi 0 0;padding:.9cqi 2.6cqi;border:1px solid var(--tk-ink);border-radius:99px;font-size:3.2cqi;font-weight:500;letter-spacing:-.01em;line-height:1.2}
        .tk-mark{width:15.5cqi;height:15.5cqi;margin-top:-1cqi;flex:none}

        /* 2 */
        .tk-meta{display:grid;grid-template-columns:1fr auto 1fr;gap:5cqi;padding:4.4cqi 6.5cqi 4.6cqi}

        /* 3 */
        .tk-art{padding:4cqi 4.6cqi 4.4cqi}
        .tk-poster{position:relative;aspect-ratio:100/9;background:#121211;color:#fff;overflow:hidden;border-radius:.6cqi}
        .tk-shapes{position:absolute;inset:0;width:100%;height:100%}
        .tk-photo{position:relative;margin-top:2.4cqi;aspect-ratio:1;overflow:hidden;border-radius:.6cqi;background:#b5130f}
        .tk-photo img{width:100%;height:100%;object-fit:cover}
        .tk-cursor{position:absolute;left:66%;top:40%;display:flex;align-items:flex-start;gap:.2cqi}
        .tk-cursor svg{width:5cqi;height:5cqi;filter:drop-shadow(0 .4cqi .6cqi rgba(0,0,0,.35))}
        .tk-cursor b{margin-top:3.8cqi;padding:.5cqi 1.6cqi;border-radius:.6cqi .6cqi .6cqi .6cqi;background:var(--tk-blue);font-size:2.5cqi;font-weight:600;letter-spacing:0;white-space:nowrap}

        /* 4 */
        .tk-info{display:grid;grid-template-columns:1fr 1fr 1fr;padding:3.8cqi 4cqi 4.2cqi}
        .tk-info>div{padding:0 2.6cqi}
        .tk-info>div+div{border-left:1px solid var(--tk-rule)}
        .tk-info dt{font-family:var(--font-mono);font-size:2.3cqi;letter-spacing:.07em;text-transform:uppercase;color:var(--tk-mute)}
        .tk-info dd{margin:1.4cqi 0 0;font-size:2.9cqi;line-height:1.2;font-weight:700;letter-spacing:.005em;text-transform:uppercase}

        /* 5 */
        .tk-stub{--rb:0px;display:grid;grid-template-columns:1fr auto auto;gap:4.4cqi;align-items:center;padding:4.8cqi 5.4cqi 2.6cqi}
        .tk-code svg{width:100%;height:10cqi}
        .tk-code rect{fill:var(--tk-ink)}
        .tk-code p{margin:1.6cqi 0 0;font-family:var(--font-mono);font-size:3.3cqi;letter-spacing:.14em;white-space:nowrap}
        .tk-enter{position:relative;display:grid;justify-items:start;padding-right:.5cqi;border-radius:1cqi}
        .tk-enter svg{width:8cqi;height:8cqi;margin-top:.6cqi;transition:transform .6s var(--ease)}
        .tk-enter small{margin-top:2.4cqi;font-family:var(--font-mono);font-size:2cqi;letter-spacing:.08em;text-transform:uppercase;color:var(--tk-mute)}
        .tk-enter:hover svg{transform:translate(.8cqi,.8cqi)}
        .tk-tear{height:2.2cqi;margin-top:-1px;background-color:var(--tk-paper);background-image:var(--tk-noise);background-size:180px 180px;
          -webkit-mask:radial-gradient(circle at 50% 100%,#0000 1.05cqi,#000 calc(1.05cqi + .5px)) 50% 0/3cqi 100% repeat-x;
          mask:radial-gradient(circle at 50% 100%,#0000 1.05cqi,#000 calc(1.05cqi + .5px)) 50% 0/3cqi 100% repeat-x}

        /* Back */
        .tk-bhead{--r:2cqi;padding:12cqi 4.6cqi 4.4cqi}
        .tk-band{aspect-ratio:100/33}
        .tk-bmain{flex:1;display:flex;flex-direction:column;justify-content:flex-start;gap:5cqi;padding:5.5cqi 6.5cqi}
        .tk-btitle{margin:0 0 .5cqi;font-size:9cqi;font-weight:700;line-height:1;letter-spacing:-.045em}
        .tk-group h3{display:flex;align-items:center;gap:1.8cqi;margin:0 0 2cqi;font-family:var(--font-mono);font-size:max(7px,2.4cqi);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--tk-mute)}
        .tk-group h3 span{color:var(--tk-ink)}
        .tk-group ul{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0;padding:0;list-style:none}
        .tk-group li{padding:1.2cqi 2.9cqi;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(22,21,19,.5);font-size:max(10px,3.2cqi);font-weight:500;line-height:1.2;letter-spacing:-.01em}
        .tk-group li.is-year{background:var(--tk-ink);color:var(--tk-paper);box-shadow:none}
        .tk-group ul.is-stack{flex-direction:column;align-items:flex-start}
        .tk-group li.is-strong{order:-1;padding:.4cqi 0 0;box-shadow:none;font-weight:700;font-size:max(11px,3.6cqi);letter-spacing:-.02em}
        .tk-group li.is-year{order:2}
        .tk-bsign{--rb:0px;padding:9cqi 6.5cqi 3.4cqi}
        .tk-sigbox{position:relative;padding-left:5cqi}
        .tk-x{position:absolute;left:0;bottom:5.6cqi;font-size:4.4cqi;line-height:1;color:var(--tk-mute)}
        .tk-sig{position:relative;z-index:1;margin:0 0 -3.6cqi;font-family:var(--font-signature),cursive;font-size:15cqi;line-height:1.1;color:#1a2a6c;
          transform:rotate(-5deg);transform-origin:0 100%;white-space:nowrap;text-shadow:0 0 .3px rgba(26,42,108,.6)}
        .tk-flourish{display:block;width:72%;height:6cqi;margin:0 0 .4cqi 6cqi;overflow:visible}
        .tk-flourish path{fill:none;stroke:#1a2a6c;stroke-width:1.5px;stroke-linecap:round;vector-effect:non-scaling-stroke;}
        .tk-sigline{display:flex;justify-content:space-between;margin:0 0 0 -5cqi;padding-top:1.4cqi;border-top:1px solid var(--tk-ink);font-family:var(--font-mono);font-size:max(7px,2.2cqi);letter-spacing:.08em;text-transform:uppercase;color:var(--tk-mute)}
        .tk-found-label{margin:3.6cqi 0 .8cqi;font-size:max(9px,2.6cqi);color:var(--tk-mute)}
        .tk-found{display:flex;justify-content:space-between;align-items:baseline;gap:2cqi;margin:0;font-size:max(9px,2.8cqi);line-height:1.4}
        .tk-found a{color:var(--tk-ink);font-weight:600;text-decoration:underline;text-decoration-color:rgba(22,21,19,.3);text-underline-offset:.6cqi;transition:text-decoration-color .3s}
        .tk-found a:hover{text-decoration-color:currentColor}

      `}</style>
    </div>
  );
}
