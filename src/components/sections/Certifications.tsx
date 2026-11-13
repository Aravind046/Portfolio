import { CERTIFICATIONS, SECTION_INDEX } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import Heading from "../ui/Heading";

export default function Certifications() {
  if (!CERTIFICATIONS.length) return null;
  const issuers = [...new Set(CERTIFICATIONS.map((c) => c.issuer))];
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <div className="wrap certs-grid">
        <div className="certs-left">
          <SectionTag index={SECTION_INDEX.certifications} label="Certifications" />
          <Heading id="certs-title" className="certs-title" lines={["Always"]} accent="learning." />
          <p className="certs-count mono rv">
            {String(CERTIFICATIONS.length).padStart(2, "0")} certifications · {issuers.join(", ")}
          </p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => {
            const body = (
              <>
                <span className="cert-i mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="cert-t">{c.title}</span>
                <span className="cert-by mono">{c.issuer}</span>
                <span className="cert-arrow" aria-hidden="true">
                  ↗
                </span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ ["--i" as string]: i }}>
                {c.href ? (
                  <a className="cert" href={c.href} target="_blank" rel="noopener noreferrer">
                    {body}
                  </a>
                ) : (
                  <div className="cert" tabIndex={0}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        .certs{background:#fff;border-block:1px solid var(--line)}
        .certs-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
        .certs-left{position:sticky;top:110px}
        .certs-title{margin:22px 0 18px}
        .certs-count{margin:0;font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em}
        .certs-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
        .certs-list li{border-bottom:1px solid var(--line)}
        .cert{position:relative;display:grid;grid-template-columns:56px minmax(0,1fr) auto 32px;align-items:center;gap:16px;padding:clamp(22px,3vw,34px) 18px;overflow:hidden;isolation:isolate;border-radius:0}
        .cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
        .cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
        .cert:focus-visible{outline-offset:-2px}
        .cert>span{transition:color .45s var(--ease),transform .6s var(--ease),opacity .45s}
        .cert:hover>span,.cert:focus-visible>span{color:#fff}
        .cert-i{font-size:12px;color:var(--mute)}
        .cert-t{font-weight:600;font-size:clamp(22px,2.4vw,34px);letter-spacing:-.035em;line-height:1.1}
        .cert:hover .cert-t,.cert:focus-visible .cert-t{transform:translateX(8px)}
        .cert-by{font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        .cert-arrow{font-size:20px;opacity:0;transform:translate(-12px,12px)}
        .cert:hover .cert-arrow,.cert:focus-visible .cert-arrow{opacity:1;transform:none}
        @media (max-width:860px){
          .certs-grid{grid-template-columns:minmax(0,1fr)}
          .certs-left{position:relative;top:auto}
          .cert{grid-template-columns:36px minmax(0,1fr) 24px;padding-inline:8px}
          .cert-by{grid-column:2;grid-row:2;margin-top:-8px}
          .cert-arrow{grid-column:3;grid-row:1}
        }
      `}</style>
    </section>
  );
}
