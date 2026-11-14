"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

/** How far (px) around the button the goo can reach for the cursor. */
const PAD = 150;
/** Distance from the button edge at which tendrils start reaching. */
const REACH = 100;
/** Pull the cursor this far from the button and the goo lets go. */
const SNAP = 140;

type Strand = {
  x: number; // tip position (overlay coords)
  y: number;
  vx: number;
  vy: number;
  k: number; // spring stiffness
  damp: number;
  spread: number; // base offset along the edge
  ox: number; // tip offset around the cursor
  oy: number;
  w: number; // base width
  phase: number;
};

const STRANDS: Omit<Strand, "x" | "y" | "vx" | "vy">[] = [
  { k: 0.16, damp: 0.72, spread: -22, ox: -5, oy: 3, w: 6.5, phase: 0 },
  { k: 0.12, damp: 0.74, spread: 0, ox: 1, oy: -4, w: 7.5, phase: 2.1 },
  { k: 0.09, damp: 0.76, spread: 22, ox: 5, oy: 3, w: 6, phase: 4.2 },
];

/** Tendrils that crawl out of the pill's edges while it is hovered: [fraction along, edge (-1 top / 1 bottom), phase, speed]. */
const SPIKES: [number, -1 | 1, number, number][] = [
  [0.14, -1, 0, 3.1],
  [0.42, -1, 1.7, 2.6],
  [0.78, -1, 3.4, 3.4],
  [0.24, 1, 0.9, 2.8],
  [0.58, 1, 2.6, 3.6],
  [0.88, 1, 4.4, 2.4],
];

/** A tapered quadratic strand as a filled outline, plus a thin highlight along one side. */
function strandPath(bx: number, by: number, cx: number, cy: number, tx: number, ty: number, w0: number, w1: number) {
  const n = 16;
  const L: string[] = [];
  const R: string[] = [];
  const hi: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const x = u * u * bx + 2 * u * t * cx + t * t * tx;
    const y = u * u * by + 2 * u * t * cy + t * t * ty;
    const dx = 2 * u * (cx - bx) + 2 * t * (tx - cx);
    const dy = 2 * u * (cy - by) + 2 * t * (ty - cy);
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    // thick at the base, thin through the middle, a little fuller at the tip
    const w = (w0 * (1 - t) ** 1.6 + w1 + Math.sin(t * Math.PI) * 0.6) / 2;
    L.push(`${(x + nx * w).toFixed(1)} ${(y + ny * w).toFixed(1)}`);
    R.unshift(`${(x - nx * w).toFixed(1)} ${(y - ny * w).toFixed(1)}`);
    if (i > 2 && i < n - 1) hi.push(`${(x + nx * w * 0.45).toFixed(1)} ${(y + ny * w * 0.45).toFixed(1)}`);
  }
  return { body: `M${L.join("L")}L${R.join("L")}Z`, hi: hi.length ? `M${hi.join("L")}` : "" };
}

/**
 * "See my work" as a liquid, symbiote-like button. When the cursor comes
 * within REACH, black tendrils stretch out of the pill and grab it; on the
 * button they arch over and hold the cursor while tendrils crawl out of the
 * edges. Pull far enough away and everything snaps back into the body.
 * Fine pointers only; a plain glossy pill everywhere else.
 */
export default function VenomButton({ href, children }: { href: string; children: React.ReactNode }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Keep the goo pill the same size as the button (attributes, for Safari).
  useEffect(() => {
    const btn = btnRef.current;
    const pill = svgRef.current?.querySelector(".vn-pill");
    if (!btn || !pill) return;
    const ro = new ResizeObserver(() => {
      pill.setAttribute("width", String(btn.offsetWidth));
      pill.setAttribute("height", String(btn.offsetHeight));
    });
    ro.observe(btn);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    const svg = svgRef.current;
    if (!btn || !svg || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const bodies = [...svg.querySelectorAll<SVGPathElement>(".vn-strand")];
    const highs = [...svg.querySelectorAll<SVGPathElement>(".vn-hi")];
    const blob = svg.querySelector<SVGCircleElement>(".vn-blob")!;
    const spikes = [...svg.querySelectorAll<SVGPathElement>(".vn-spike")];
    const strands: Strand[] = STRANDS.map((s) => ({ ...s, x: 0, y: 0, vx: 0, vy: 0 }));

    let px = -9999;
    let py = -9999;
    let attached = false;
    let over = false; // cursor is on the button itself
    let heat = 0; // 0..1, eases in while hovered: drives the crawling edge tendrils
    let raf = 0;
    let anchor = { x: 0, y: 0, tx: 1, ty: 0 }; // base point on the pill edge + edge tangent

    const geometry = () => {
      const r = btn.getBoundingClientRect();
      const lx = px - (r.left - PAD);
      const ly = py - (r.top - PAD);
      // nearest point on the pill (a capsule) to the cursor, in overlay coords
      const left = PAD + r.height / 2;
      const right = PAD + r.width - r.height / 2;
      const cy = PAD + r.height / 2;
      const cxp = Math.min(right, Math.max(left, lx));
      const dx = lx - cxp;
      const dy = ly - cy;
      const d = Math.hypot(dx, dy) || 1;
      const rad = r.height / 2 - 3; // start just inside the edge so the goo melts it in
      const g = { lx, ly, w: r.width, h: r.height, dist: d - r.height / 2, bx: cxp + (dx / d) * rad, by: cy + (dy / d) * rad, tx: -dy / d, ty: dx / d };
      // On the button: rise out of the top edge above the cursor, then curl down onto it.
      if (over) Object.assign(g, { bx: Math.min(right, Math.max(left, lx)), by: PAD + 3, tx: 1, ty: 0 });
      return g;
    };

    const step = () => {
      raf = 0;
      const g = geometry();
      if (attached) anchor = { x: g.bx, y: g.by, tx: g.tx, ty: g.ty };
      const time = performance.now() / 1000;
      let moving = false;
      let tipX = 0;
      let tipY = 0;
      let reach = 0;

      strands.forEach((s, i) => {
        const baseX = anchor.x + anchor.tx * s.spread;
        const baseY = anchor.y + anchor.ty * s.spread;
        const goalX = attached ? g.lx + s.ox : baseX;
        const goalY = attached ? g.ly + s.oy : baseY;
        const k = attached ? s.k : 0.22; // retracts faster than it reaches
        s.vx = (s.vx + (goalX - s.x) * k) * s.damp;
        s.vy = (s.vy + (goalY - s.y) * k) * s.damp;
        s.x += s.vx;
        s.y += s.vy;

        const len = over && attached ? Math.max(30, Math.hypot(s.x - baseX, s.y - baseY)) : Math.hypot(s.x - baseX, s.y - baseY);
        if (len > 0.5 || Math.abs(s.vx) + Math.abs(s.vy) > 0.05) moving = true;
        const grow = Math.min(1, len / 26); // thins to nothing as it retracts
        // a little sag and a slow wobble so the strand looks alive
        const nx = -(s.y - baseY) / (len || 1);
        const ny = (s.x - baseX) / (len || 1);
        const bend = Math.sin(time * 2.4 + s.phase) * Math.min(14, len * 0.12) + len * 0.08;
        let cx = (baseX + s.x) / 2 + nx * bend;
        let cy = (baseY + s.y) / 2 + ny * bend + len * 0.06;
        if (over && attached) {
          // arch up over the top of the pill before wrapping the cursor
          cx = baseX + s.spread * 0.6 + Math.sin(time * 2.4 + s.phase) * 6;
          cy = PAD - 42 - Math.abs(s.spread) * 0.5 + Math.sin(time * 1.8 + s.phase) * 5;
        }
        const { body, hi } = strandPath(baseX, baseY, cx, cy, s.x, s.y, s.w * grow, 4.4 * grow);
        bodies[i].setAttribute("d", len < 1 ? "" : body);
        highs[i].setAttribute("d", len < 14 || over ? "" : hi);
        tipX += s.x / strands.length;
        tipY += s.y / strands.length;
        reach = Math.max(reach, len);
      });

      blob.setAttribute("cx", tipX.toFixed(1));
      blob.setAttribute("cy", tipY.toFixed(1));
      blob.setAttribute("r", (reach > 20 ? Math.min(7, reach / 12) : 0).toFixed(1));
      btn.classList.toggle("is-grabbing", attached && !over);

      // Edge tendrils: crawl out while hovered, sink back in afterwards.
      heat += ((over ? 1 : 0) - heat) * 0.08;
      SPIKES.forEach(([f, side, ph, sp], i) => {
        const amp = heat * (7 + 11 * Math.abs(Math.sin(time * sp + ph)));
        if (amp < 0.6) return spikes[i].setAttribute("d", "");
        const bx = PAD + 24 + (g.w - 48) * f;
        const by = side < 0 ? PAD + 3 : PAD + g.h - 3;
        const sway = Math.sin(time * sp * 0.7 + ph) * 6 * heat;
        const tx = bx + sway;
        const ty = by + side * amp;
        spikes[i].setAttribute("d", strandPath(bx, by, bx + sway * 0.3, by + side * amp * 0.5, tx, ty, 9 * heat, 5 * heat).body);
      });

      if (attached || moving || heat > 0.01) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      over = btn.matches(":hover");
      const g = geometry();
      if (!attached && (over || (g.dist > 6 && g.dist < REACH))) {
        // grow out of the pill from the side facing the cursor
        anchor = { x: g.bx, y: g.by, tx: g.tx, ty: g.ty };
        strands.forEach((s) => {
          s.x = anchor.x + anchor.tx * s.spread;
          s.y = anchor.y + anchor.ty * s.spread;
          s.vx = s.vy = 0;
        });
        attached = true;
      } else if (attached && !over && g.dist > SNAP) attached = false; // pulled away: snap back
      kick();
    };
    const onLeave = () => {
      attached = false;
      over = false;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      className="vn"
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget(href);
      }}
    >
      <svg ref={svgRef} className="vn-layer" aria-hidden="true" focusable="false">
        <defs>
          <filter id="vn-goo" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="atop" />
          </filter>
        </defs>
        <g filter="url(#vn-goo)" fill="#0b0b0c">
          <rect className="vn-pill" x={PAD} y={PAD} rx="24" ry="24" />
          <path className="vn-strand" />
          <path className="vn-strand" />
          <path className="vn-strand" />
          <circle className="vn-blob" r="0" />
          {SPIKES.map((_, i) => (
            <path key={i} className="vn-spike" />
          ))}
        </g>
        <g>
          <path className="vn-hi" />
          <path className="vn-hi" />
          <path className="vn-hi" />
        </g>
      </svg>
      <span className="vn-label">{children}</span>

      <style>{`
        .vn{position:relative;isolation:isolate;display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 28px;
          border-radius:999px;color:#fff;font-size:15px;font-weight:600;letter-spacing:-.01em;white-space:nowrap;
          box-shadow:0 14px 28px -14px rgba(13,13,13,.7),0 2px 4px -2px rgba(13,13,13,.4);transition:transform .5s cubic-bezier(.3,1.5,.5,1)}
        .vn-layer{position:absolute;left:-${PAD}px;top:-${PAD}px;width:calc(100% + ${PAD * 2}px);height:calc(100% + ${PAD * 2}px);z-index:-1;overflow:visible;pointer-events:none}
        .vn-hi{fill:none;stroke:rgba(255,255,255,.42);stroke-width:1.1;stroke-linecap:round}
        .vn-label{position:relative}
        /* wet highlight across the top of the pill */
        .vn::after{content:"";position:absolute;left:14px;right:14px;top:4px;height:42%;border-radius:999px;pointer-events:none;
          background:linear-gradient(rgba(255,255,255,.13),rgba(255,255,255,0))}
        .vn:hover{transform:scale(1.03,.97)}
        .vn.is-grabbing{transform:scale(.985)}
        .vn:active{transform:scale(.96)}
      `}</style>
    </a>
  );
}
