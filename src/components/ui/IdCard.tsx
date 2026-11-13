"use client";

import { useEffect, useRef, useState } from "react";
import { ID_CARD, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

/** Deterministic barcode bars from the name. */
function bars(seed: string) {
  const out: number[] = [];
  for (let i = 0; i < 44; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    out.push(1 + (c % 3));
  }
  return out;
}

/**
 * A lanyard ID card. Damped pendulum driven by pointer velocity, idle sway,
 * 3D flip on hover (mouse) / tap (touch) / Enter–Space (keyboard).
 */
export default function IdCard({ zoneRef }: { zoneRef: React.RefObject<HTMLElement | null> }) {
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  useEffect(() => {
    const zone = zoneRef.current;
    const el = swingRef.current;
    if (!zone || !el || prefersReducedMotion()) return;
    let angle = 0;
    let vel = 0;
    let lastX: number | null = null;
    let lastT = 0;
    let lastMove = 0;
    let raf = 0;
    let running = false;
    let t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now - lastT < 80) {
        const vx = (e.clientX - lastX) / Math.max(1, now - lastT); // px/ms
        vel += Math.max(-1.2, Math.min(1.2, vx)) * 0.9;
      }
      lastX = e.clientX;
      lastT = now;
      lastMove = now;
    };
    const step = (now: number) => {
      const dt = Math.min(32, now - t0) / 16.67;
      t0 = now;
      const idle = now - lastMove > 1400;
      const target = idle ? Math.sin(now / 1400) * 1.6 : 0;
      const acc = -0.045 * (angle - target) - 0.085 * vel;
      vel += acc * dt;
      angle += vel * dt;
      angle = Math.max(-16, Math.min(16, angle));
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        t0 = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(zone);
    zone.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      zone.removeEventListener("pointermove", onMove);
    };
  }, [zoneRef]);

  const strapText = `${PROFILE.name} · ${PROFILE.role} · `.toUpperCase();

  return (
    <div className="lan">
      <div className="lan-swing" ref={swingRef}>
        <div className="lan-strap" aria-hidden="true">
          <div className="lan-strap-text">
            <span>{strapText.repeat(4)}</span>
            <span>{strapText.repeat(4)}</span>
          </div>
        </div>
        <div className="lan-clip" aria-hidden="true">
          <span />
        </div>
        <div
          className={`idc${flipped ? " is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
          onClick={() => lastPointer.current !== "mouse" && setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <span className="sr-only-focusable">Flip ID card. </span>
          <div className="idc-inner">
            {/* Front */}
            <div className="idc-face idc-front">
              <div className="idc-band">
                <span>{ID_CARD.band}</span>
                <span className="idc-hole" aria-hidden="true" />
              </div>
              <div className="idc-photo">
                <div className="idc-halo" aria-hidden="true" />
                <div className="idc-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/portrait-bust.webp" width={480} height={600} alt={`Portrait of ${PROFILE.name}`} loading="lazy" />
                </div>
              </div>
              <p className="idc-name">{PROFILE.name}</p>
              <p className="idc-role">{PROFILE.role}</p>
              <dl className="idc-rows">
                {ID_CARD.rows.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="idc-foot" aria-hidden="true">
                <div className="idc-barcode">
                  {bars(PROFILE.name).map((w, i) => (
                    <i key={i} style={{ width: w, opacity: i % 5 === 0 ? 0.5 : 1 }} />
                  ))}
                </div>
                <div className="idc-holo" />
              </div>
            </div>
            {/* Back */}
            <div className="idc-face idc-back">
              <p className="idc-back-title mono">What I am</p>
              <ul>
                {ID_CARD.back.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <div className="idc-sign">
                <span className="accent">{PROFILE.name}</span>
                <i aria-hidden="true" />
                <small className="mono">Signature</small>
              </div>
              <p className="idc-found mono">
                If found, say hello · <span>{PROFILE.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lan{position:relative;display:flex;justify-content:center;height:100%;min-height:540px}
        .lan-swing{position:relative;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
        .lan-strap{position:relative;width:30px;height:calc(var(--section-pad) + 56px);margin-top:calc(var(--section-pad) * -1);background:#1a1a1a;overflow:hidden;box-shadow:inset 2px 0 0 rgba(255,255,255,.08),inset -2px 0 0 rgba(0,0,0,.4)}
        .lan-strap-text{position:absolute;left:0;top:0;width:30px;display:flex;flex-direction:column;animation:strap 22s linear infinite}
        .lan-strap-text span{writing-mode:vertical-rl;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:rgba(255,255,255,.72);line-height:30px;white-space:nowrap}
        @keyframes strap{to{transform:translateY(-50%)}}
        .lan-clip{position:relative;width:38px;height:30px;margin-top:-2px;border-radius:6px 6px 10px 10px;background:linear-gradient(180deg,#d9d9d9,#8f8f8f 55%,#c9c9c9);box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 3px 6px rgba(0,0,0,.25)}
        .lan-clip span{position:absolute;left:50%;bottom:-12px;width:12px;height:18px;transform:translateX(-50%);border:3px solid #9a9a9a;border-top:0;border-radius:0 0 8px 8px}
        .idc{position:relative;margin-top:6px;width:300px;height:404px;perspective:1400px;cursor:pointer;border-radius:22px;outline-offset:6px}
        .idc-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
        .idc.is-flipped .idc-inner{transform:rotateY(180deg)}
        .idc-face{position:absolute;inset:0;border-radius:22px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -36px rgba(13,13,13,.45),0 10px 24px -14px rgba(13,13,13,.2);-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}
        .idc-front{display:flex;flex-direction:column;align-items:center;text-align:center}
        .idc-band{width:100%;height:46px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;letter-spacing:.32em;position:relative}
        .idc-hole{position:absolute;top:8px;left:50%;width:34px;height:6px;border-radius:6px;transform:translateX(-50%);background:var(--paper);opacity:.9;display:none}
        .idc-photo{position:relative;margin-top:20px}
        .idc-halo{position:absolute;inset:-22px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.09),transparent);filter:blur(6px)}
        .idc-frame{position:relative;width:128px;height:156px;border-radius:18px;padding:3px;background:linear-gradient(145deg,#e8e8e8,#9b9b9b 45%,#f0f0f0 70%,#7a7a7a);box-shadow:0 14px 28px -16px rgba(13,13,13,.55)}
        .idc-frame img{width:100%;height:100%;object-fit:cover;border-radius:15px;background:#fff;transition:transform .9s var(--ease)}
        .idc:hover .idc-frame img{transform:scale(1.06)}
        .idc-frame{overflow:hidden}
        .idc-name{margin:14px 0 0;font-weight:700;font-size:20px;letter-spacing:-.03em}
        .idc-role{margin:2px 0 0;font-size:13px;color:var(--mute)}
        .idc-rows{width:calc(100% - 44px);margin:14px 0 0;padding:0;border-top:1px solid var(--line)}
        .idc-rows div{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--line);font-size:12px}
        .idc-rows dt{font-family:var(--font-mono);color:var(--mute);font-size:10.5px;text-transform:uppercase;letter-spacing:.06em}
        .idc-rows dd{margin:0;font-weight:500}
        .idc-foot{margin-top:auto;width:calc(100% - 44px);display:flex;align-items:center;justify-content:space-between;padding-bottom:16px}
        .idc-barcode{display:flex;align-items:stretch;gap:1.5px;height:26px}
        .idc-barcode i{display:block;background:var(--ink)}
        .idc-holo{width:34px;height:34px;border-radius:50%;background:conic-gradient(from 30deg,#f5f5f5,#b8b8b8,#ededed,#8d8d8d,#e2e2e2,#c4c4c4,#f5f5f5);box-shadow:inset 0 0 0 1px rgba(13,13,13,.08);animation:holo 8s linear infinite}
        @keyframes holo{to{transform:rotate(360deg)}}
        .idc-back{transform:rotateY(180deg);padding:26px 24px 20px;display:flex;flex-direction:column;text-align:left}
        .idc-back-title{margin:0;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--mute)}
        .idc-back ul{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:9px}
        .idc-back li{position:relative;padding-left:16px;font-size:13px;line-height:1.4;color:var(--ink-2)}
        .idc-back li::before{content:"";position:absolute;left:0;top:.58em;width:7px;height:1px;background:var(--ink)}
        .idc-sign{margin-top:auto;display:flex;flex-direction:column}
        .idc-sign .accent{font-size:28px;color:var(--ink);line-height:1}
        .idc-sign i{display:block;height:1px;background:var(--ink);margin:6px 0 4px;opacity:.5}
        .idc-sign small{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
        .idc-found{margin:12px 0 0;font-size:10px;color:var(--mute);line-height:1.5;word-break:break-all}
        .idc-found span{color:var(--ink)}
        @media (max-width:980px){.lan{min-height:0;padding-bottom:12px}.lan-strap{height:96px;margin-top:0}}
        @media (max-width:360px){.idc{width:280px;height:390px}}
      `}</style>
    </div>
  );
}
