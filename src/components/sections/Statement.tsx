/** Big centred intro that leads into the Work section. */
export default function Statement() {
  return (
    <section className="st" aria-label="Statement">
      <div className="wrap">
        <h2 className="st-title">
          <span className="rv-mask">
            <span>Welcome to my</span>
          </span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
            <span>work section</span>
          </span>
        </h2>
        <p className="st-sub rv" style={{ ["--i" as string]: 2 }}>
          I design digital products that make complex things feel simple. From early ideas to polished interfaces
        </p>
      </div>

      <style>{`
        .st{padding:clamp(72px,12vh,140px) 0 clamp(32px,4vw,56px);text-align:center}
        .st + .section{padding-top:clamp(24px,3vw,40px)}
        .st-title{margin:0;font-size:clamp(46px,9.2vw,150px);font-weight:700;line-height:1;letter-spacing:-.045em;color:#050505}
        .st-sub{max-width:62ch;margin:clamp(24px,3vw,44px) auto 0;font-size:clamp(17px,1.6vw,23px);font-weight:400;line-height:1.45;letter-spacing:-.01em;color:#1c1c1c}
      `}</style>
    </section>
  );
}
