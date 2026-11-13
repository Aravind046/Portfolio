import type { MiniUI as Kind } from "@/lib/data";

/** Grayscale, pure-CSS sketches that hint at each piece of work. Not screenshots. */
export default function MiniUI({ kind }: { kind: Kind }) {
  return (
    <div className={`mui mui-${kind}`} aria-hidden="true">
      {kind === "hub" && (
        <div className="mui-win">
          <div className="mui-bar">
            <i />
            <i />
            <i />
          </div>
          <div className="hub">
            <div className="hub-side">
              <b className="mui-lbl">Businesses</b>
              {[0, 1, 2].map((i) => (
                <div key={i} className={`hub-biz${i === 0 ? " on" : ""}`}>
                  <span className="mui-av" />
                  <span className="mui-ln w60" />
                </div>
              ))}
              <div className="hub-add">+</div>
            </div>
            <div className="hub-main">
              <div className="hub-stats">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="mui-tile">
                    <span className="mui-ln w40" />
                    <span className="mui-num" />
                  </div>
                ))}
              </div>
              <b className="mui-lbl">Team</b>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="hub-row">
                  <span className="mui-av sm" />
                  <span className="mui-ln w50" />
                  <span className="mui-pill" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {kind === "bank" && (
        <div className="bank">
          <div className="mui-phone">
            <div className="bank-card">
              <span className="mui-ln w30 inv" />
              <span className="bank-amt" />
              <span className="mui-ln w50 inv" />
            </div>
            <div className="bank-acts">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="hub-row">
                <span className="mui-av sm" />
                <span className="mui-ln w50" />
                <span className="mui-ln w20" />
              </div>
            ))}
          </div>
          <div className="bank-poc">
            <b className="mui-lbl">POC</b>
            <div className="bank-chart">
              {[40, 64, 52, 80, 70, 92].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {kind === "rebrand" && (
        <div className="reb">
          <div className="reb-old">
            <span className="reb-mark sq" />
            <b className="mui-lbl">Before</b>
          </div>
          <div className="reb-arrow">→</div>
          <div className="reb-new">
            <span className="reb-mark" />
            <b className="mui-lbl">After</b>
          </div>
          <div className="reb-spec">
            <span className="reb-aa">Aa</span>
            <div className="reb-sw">
              {["#0d0d0d", "#3a3a3a", "#77756f", "#a9a6a0", "#e9e6e0"].map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {kind === "apps" && (
        <div className="apps">
          <div className="mui-win apps-sched">
            <b className="mui-lbl">Shifts</b>
            <div className="sched">
              {Array.from({ length: 21 }).map((_, i) => (
                <span key={i} className={[2, 5, 8, 9, 13, 17, 19].includes(i) ? "on" : ""} />
              ))}
            </div>
          </div>
          <div className="apps-badge">
            <span className="mui-av lg" />
            <b className="mui-lbl">Visitor</b>
            <span className="mui-ln w60" />
            <span className="apps-qr" />
          </div>
          <div className="apps-jobs">
            {[0, 1, 2].map((i) => (
              <div key={i} className="mui-tile row">
                <span className="mui-av sm sq" />
                <span className="mui-ln w50" />
                <span className="mui-pill" />
              </div>
            ))}
          </div>
        </div>
      )}

      {kind === "motion" && (
        <div className="mot">
          <div className="mot-screen">
            <span className="mot-play" />
          </div>
          <div className="mot-tl">
            <span className="mot-head" />
            {[30, 18, 26, 14].map((w, i) => (
              <span key={i} className="mot-clip" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="mot-micro">
            <span className="mot-toggle" />
            <span className="mot-heart">♥</span>
            <span className="mot-load" />
          </div>
        </div>
      )}

      {kind === "banners" && (
        <div className="ban">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`ban-post b${i}`}>
              <span className="ban-shape" />
              <span className="mui-ln w60 inv" />
              <span className="mui-ln w40 inv" />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .mui{position:relative;width:100%;height:100%;display:grid;place-items:center;padding:clamp(16px,2.4vw,32px);background:#f3f2ef;border-radius:20px;overflow:hidden}
        .mui *{box-sizing:border-box}
        .mui-win{width:100%;max-width:440px;background:#fff;border-radius:14px;box-shadow:var(--hair),0 24px 50px -30px rgba(13,13,13,.4);overflow:hidden}
        .mui-bar{display:flex;gap:5px;padding:9px 12px;border-bottom:1px solid var(--line)}
        .mui-bar i{width:7px;height:7px;border-radius:50%;background:#d6d4cf}
        .mui-lbl{display:block;font-family:var(--font-mono);font-weight:400;font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:var(--mute);margin:2px 0 8px}
        .mui-ln{display:block;height:6px;border-radius:6px;background:#dcdad5}
        .mui-ln.inv{background:rgba(255,255,255,.55)}
        .w20{width:20%}.w30{width:30%}.w40{width:40%}.w50{width:50%}.w60{width:60%}
        .mui-av{flex:none;width:22px;height:22px;border-radius:50%;background:#cfccc6}
        .mui-av.sm{width:18px;height:18px}.mui-av.lg{width:46px;height:46px}.mui-av.sq{border-radius:6px}
        .mui-pill{margin-left:auto;width:34px;height:14px;border-radius:999px;background:#efede9;box-shadow:var(--hair)}
        .mui-tile{background:#fff;border-radius:10px;padding:10px;box-shadow:var(--hair);display:flex;flex-direction:column;gap:8px}
        .mui-tile.row{flex-direction:row;align-items:center}
        .mui-num{display:block;width:60%;height:14px;border-radius:4px;background:var(--ink)}
        .hub{display:grid;grid-template-columns:38% 1fr;min-height:250px}
        .hub-side{padding:12px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:6px}
        .hub-biz{display:flex;align-items:center;gap:8px;padding:7px;border-radius:9px}
        .hub-biz.on{background:var(--ink)}.hub-biz.on .mui-ln{background:rgba(255,255,255,.5)}.hub-biz.on .mui-av{background:#fff}
        .hub-add{margin-top:auto;height:26px;border-radius:9px;border:1px dashed #c9c6c0;display:grid;place-items:center;color:var(--mute);font-size:13px}
        .hub-main{padding:12px;display:flex;flex-direction:column;gap:7px}
        .hub-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
        .hub-stats .mui-tile{padding:8px;background:#f7f6f3}
        .hub-row{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line)}
        .bank{display:flex;align-items:center;gap:20px}
        .mui-phone{width:190px;padding:14px 12px;border-radius:26px;background:#fff;box-shadow:var(--hair),0 24px 50px -30px rgba(13,13,13,.45);display:flex;flex-direction:column;gap:8px}
        .bank-card{height:96px;border-radius:14px;background:var(--ink);padding:12px;display:flex;flex-direction:column;gap:9px}
        .bank-amt{display:block;width:70%;height:16px;border-radius:4px;background:#fff;margin-top:auto}
        .bank-acts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:4px 0}
        .bank-acts span{aspect-ratio:1;border-radius:10px;background:#f1efeb;box-shadow:var(--hair)}
        .bank-poc{width:150px;background:#fff;border-radius:14px;padding:12px;box-shadow:var(--hair)}
        .bank-chart{height:110px;display:flex;align-items:flex-end;gap:6px}
        .bank-chart span{flex:1;border-radius:4px 4px 0 0;background:#cfccc6}
        .bank-chart span:last-child{background:var(--ink)}
        .reb{display:grid;grid-template-columns:1fr auto 1fr;grid-template-rows:auto auto;gap:18px;align-items:center;width:100%;max-width:440px}
        .reb-old,.reb-new{background:#fff;border-radius:16px;box-shadow:var(--hair);aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
        .reb-old{opacity:.55}
        .reb-mark{width:52px;height:52px;border-radius:50%;box-shadow:inset 0 0 0 10px var(--ink)}
        .reb-mark.sq{border-radius:8px;box-shadow:inset 0 0 0 4px #9b9893;transform:rotate(12deg)}
        .reb-arrow{font-size:22px;color:var(--mute)}
        .reb-spec{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:16px;box-shadow:var(--hair);padding:14px 18px}
        .reb-aa{font-family:var(--font-serif);font-style:italic;font-size:40px;line-height:1}
        .reb-sw{display:flex;gap:6px}.reb-sw span{width:26px;height:26px;border-radius:50%;box-shadow:var(--hair)}
        .apps{display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:auto auto;gap:12px;width:100%;max-width:460px}
        .apps-sched{padding:12px}
        .sched{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
        .sched span{height:22px;border-radius:5px;background:#efede9}.sched span.on{background:var(--ink)}
        .apps-badge{grid-row:span 2;background:#fff;border-radius:14px;box-shadow:var(--hair);padding:16px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .apps-badge .mui-lbl{margin:4px 0 0}
        .apps-qr{margin-top:auto;width:58px;height:58px;border-radius:6px;background:repeating-conic-gradient(var(--ink) 0 25%,#fff 0 50%) 0 0/14px 14px;box-shadow:var(--hair)}
        .apps-jobs{display:flex;flex-direction:column;gap:6px}
        .apps-jobs .mui-tile{padding:8px;gap:8px}
        .mot{width:100%;max-width:440px;display:flex;flex-direction:column;gap:12px}
        .mot-screen{aspect-ratio:16/9;border-radius:14px;background:#e4e2dd;display:grid;place-items:center;box-shadow:var(--hair)}
        .mot-play{width:54px;height:54px;border-radius:50%;background:var(--ink);position:relative;animation:breathe 2.4s var(--ease) infinite}
        .mot-play::after{content:"";position:absolute;left:21px;top:17px;border-left:16px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent}
        @keyframes breathe{50%{transform:scale(1.08)}}
        .mot-tl{position:relative;display:flex;gap:4px;padding:8px;border-radius:10px;background:#fff;box-shadow:var(--hair)}
        .mot-clip{height:20px;border-radius:5px;background:#d6d3ce}
        .mot-clip:nth-child(3){background:#a9a6a0}
        .mot-head{position:absolute;top:2px;bottom:2px;left:8px;width:2px;background:var(--ink);animation:scrub 4s linear infinite}
        @keyframes scrub{to{left:calc(100% - 10px)}}
        .mot-micro{display:flex;gap:12px;align-items:center;justify-content:center;background:#fff;border-radius:12px;padding:12px;box-shadow:var(--hair)}
        .mot-toggle{width:44px;height:24px;border-radius:999px;background:#d6d3ce;position:relative;animation:tbg 2.4s steps(1) infinite}
        .mot-toggle::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:tknob 2.4s var(--ease) infinite}
        @keyframes tknob{0%,40%{transform:none}50%,90%{transform:translateX(20px)}}
        @keyframes tbg{0%{background:#d6d3ce}45%{background:var(--ink)}90%{background:#d6d3ce}}
        .mot-heart{font-size:20px;animation:beat 1.2s var(--ease) infinite}
        @keyframes beat{30%{transform:scale(1.3)}}
        .mot-load{width:24px;height:24px;border-radius:50%;border:2.5px solid #e2dfda;border-top-color:var(--ink);animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ban{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:420px}
        .ban-post{aspect-ratio:1;border-radius:12px;padding:12px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;background:#3a3a3a;position:relative;overflow:hidden}
        .ban-post.b1,.ban-post.b5{background:#0d0d0d}.ban-post.b2{background:#77756f}.ban-post.b3{background:#a9a6a0}.ban-post.b4{background:#55534f}
        .ban-shape{position:absolute;top:12px;right:12px;width:34%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.22)}
        .b1 .ban-shape,.b4 .ban-shape{border-radius:6px;transform:rotate(18deg)}
        @media (max-width:520px){.bank-poc{display:none}.apps{grid-template-columns:1fr}.apps-badge{display:none}}
      `}</style>
    </div>
  );
}
