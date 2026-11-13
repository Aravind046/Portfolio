"use client";

import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-row">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <a
          href="#top"
          className="foot-top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#top");
          }}
        >
          Back to top <span aria-hidden="true">↑</span>
        </a>
        <p className="mono">Built with Next.js</p>
      </div>
      <style>{`
        .foot{border-top:1px solid var(--line)}
        .foot-row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px 24px;padding-block:28px;font-size:13.5px;color:var(--mute)}
        .foot-row p{margin:0}
        .foot-row .mono{font-size:12px}
        .foot-top{color:var(--ink);font-weight:500}
        .foot-top span{display:inline-block;transition:transform .5s var(--ease)}
        .foot-top:hover span{transform:translateY(-3px)}
      `}</style>
    </footer>
  );
}
