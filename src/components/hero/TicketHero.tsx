"use client";

import DesignerTicket from "./DesignerTicket";
import HeroIntro from "./HeroIntro";

/** Hero: hanging designer pass (left) + editorial introduction (right). */
export default function TicketHero() {
  return (
    <section id="top" className="th" aria-labelledby="hero-title">
      <div className="th-grid wrap">
        <div className="th-ticket">
          <DesignerTicket />
        </div>
        <HeroIntro />
      </div>

      <style>{`
        .th{--hero-bg:#fbfbfa;position:relative;overflow:hidden;min-height:100svh;display:flex;align-items:center;
          padding:clamp(104px,14vh,150px) 0 clamp(64px,10vh,110px);
          background:linear-gradient(var(--hero-bg) 85%,var(--paper))}
        .th-grid{display:grid;grid-template-columns:clamp(270px,min(25vw,calc((100svh - 190px) / 2.25)),350px) minmax(0,1fr);align-items:center;column-gap:clamp(48px,8vw,140px)}
        .th-ticket{position:relative;z-index:1}

        @media (max-width:1023px){
          .th-grid{grid-template-columns:clamp(220px,30vw,280px) minmax(0,1fr);column-gap:clamp(32px,5vw,56px)}
        }
        @media (max-width:719px){
          .th{min-height:0;padding-top:96px}
          .th-grid{grid-template-columns:minmax(0,1fr);row-gap:56px}
          .th-ticket{width:min(300px,76vw);margin-inline:auto}
        }
      `}</style>
    </section>
  );
}
