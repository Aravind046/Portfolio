"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  // Refs mirror state for the event handlers / observer below.
  const wantsSound = useRef(true); // visitor hasn't muted it themselves
  const visible = useRef(true);
  const userPaused = useRef(false); // visitor pressed ❚❚ — stay frozen until they press ▶

  useEffect(() => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section) return;
    const reduced = prefersReducedMotion();

    const play = (withSound: boolean) => {
      v.muted = !withSound;
      return v.play().then(
        () => {
          setSoundOn(withSound);
          setBlocked(false);
          return true;
        },
        () => false,
      );
    };

    // 1. Autoplay: try with sound, fall back to muted. (Reduced motion: wait for the visitor.)
    if (!reduced) {
      play(true).then((ok) => {
        if (ok) return;
        setBlocked(true);
        v.muted = true;
        v.play().catch(() => {});
      });
    } else {
      wantsSound.current = false;
    }

    // 2. Unlock sound on the first real interaction (unless it was on the sound button itself).
    const unlock = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return remove();
      if (!wantsSound.current || reduced || userPaused.current) return remove();
      if (!visible.current) return; // wait until the hero is back in view
      play(true).then((ok) => ok && remove());
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const remove = () => evs.forEach((ev) => window.removeEventListener(ev, unlock, true));
    evs.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));

    // 3. Pause when < 35 % of the hero is visible, resume when back.
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (!userPaused.current && (!reduced || !v.muted)) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(section);

    return () => {
      remove();
      io.disconnect();
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      // ❚❚ — freeze the picture and the voice.
      userPaused.current = true;
      wantsSound.current = false;
      v.pause();
      setSoundOn(false);
    } else {
      // ▶ — play again, with sound.
      userPaused.current = false;
      wantsSound.current = true;
      v.muted = false;
      v.play().then(
        () => {
          setSoundOn(true);
          setBlocked(false);
        },
        () => {
          // Sound refused: at least resume the picture.
          v.muted = true;
          v.play().catch(() => {});
        },
      );
    }
  };

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        <p className="hero-ghost" aria-hidden="true">
          {PROFILE.firstName.toUpperCase()}
        </p>
        <div className="hero-video-wrap">
          <video
            ref={videoRef}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero/poster.webp"
            width={768}
            height={960}
            aria-label={`Video introduction by ${PROFILE.name}, ${PROFILE.role}`}
          >
            {/* H.264 first: hardware-decoded almost everywhere (VP9 is often software-decoded on phones). */}
            <source src="/hero/hero.mp4" type="video/mp4" />
            <source src="/hero/hero.webm" type="video/webm" />
          </video>
          <button
            ref={btnRef}
            type="button"
            className={`hero-sound${blocked ? " is-blocked" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Pause the intro video" : "Play the intro video with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
                <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="hero-copy wrap">
        <div className="hero-left">
          <p className="tag hero-in" style={{ ["--d" as string]: "0.1s" }}>
            <b>{PROFILE.name}</b>
            <i aria-hidden="true" />
            {PROFILE.location}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line">
              <span style={{ ["--d" as string]: "0.15s" }}>UI/UX</span>
            </span>
            <span className="hero-line">
              <span style={{ ["--d" as string]: "0.25s" }}>
                <span className="accent">Designer.</span>
              </span>
            </span>
          </h1>
        </div>
        <div className="hero-right hero-in" style={{ ["--d" as string]: "0.4s" }}>
          <p className="hero-sub">
            {PROFILE.yearsExperience} years of experience delivering intuitive and impactful web and mobile products.
          </p>
          <div className="hero-ctas">
            <a href="#work" className="btn btn-primary" onClick={(e) => go(e, "#work")}>
              Explore work
            </a>
            <a href="#contact" className="btn btn-ghost" onClick={(e) => go(e, "#contact")}>
              Let&apos;s talk
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .hero{position:relative;min-height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}
        .hero-stage{position:absolute;inset:0;display:flex;justify-content:center;align-items:flex-end;pointer-events:none}
        .hero-ghost{position:absolute;left:50%;top:clamp(84px,16vh,180px);transform:translateX(-50%);margin:0;font-weight:800;font-size:clamp(84px,20vw,340px);letter-spacing:-.06em;line-height:.8;color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.16);white-space:nowrap;user-select:none;animation:ghostIn 1.6s var(--ease) both}
        @keyframes ghostIn{from{opacity:0;transform:translate(-50%,40px)}to{opacity:1;transform:translate(-50%,0)}}
        .hero-video-wrap{position:relative;height:min(96svh,1040px);aspect-ratio:768/960;max-width:100%;pointer-events:auto}
        .hero-video{width:100%;height:100%;object-fit:cover;object-position:50% 100%;mix-blend-mode:multiply;-webkit-mask-image:linear-gradient(to bottom,#000 78%,transparent 100%);mask-image:linear-gradient(to bottom,#000 78%,transparent 100%);animation:vidIn 1.4s var(--ease) both}
        @keyframes vidIn{from{opacity:0;transform:translateY(24px) scale(.985)}to{opacity:1;transform:none}}
        .hero-sound{position:absolute;right:12%;top:42%;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:#fff;box-shadow:0 12px 28px -12px rgba(13,13,13,.6);transition:transform .5s var(--ease)}
        .hero-sound:hover{transform:scale(1.08)}
        .hero-sound.is-blocked::before,.hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:ping 2.2s var(--ease) infinite;pointer-events:none}
        .hero-sound.is-blocked::after{animation-delay:1.1s}
        @keyframes ping{from{transform:scale(1);opacity:.55}to{transform:scale(1.9);opacity:0}}
        .hero-copy{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:flex-end;gap:32px;padding-bottom:clamp(28px,6vh,64px);pointer-events:none}
        .hero-copy a,.hero-copy button{pointer-events:auto}
        .hero-left{max-width:min(30vw,420px)}
        .hero-title{margin:14px 0 0;font-weight:700;letter-spacing:-.05em;line-height:.92;font-size:clamp(56px,7.6vw,128px)}
        .hero-title .accent{letter-spacing:-.035em}
        .hero-line{display:block;overflow:hidden;padding-bottom:.06em}
        .hero-line>span{display:block;animation:lineUp 1.2s var(--ease) both;animation-delay:var(--d)}
        @keyframes lineUp{from{transform:translateY(105%)}to{transform:none}}
        .hero-in{animation:fadeUp 1.1s var(--ease) both;animation-delay:var(--d)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .hero-right{max-width:min(28vw,360px)}
        .hero-sub{margin:0 0 20px;color:var(--ink-2);font-size:16px;line-height:1.55}
        .hero-ctas{display:flex;flex-wrap:wrap;gap:10px}
        @media (max-width:1100px){
          .hero{justify-content:flex-start;padding-top:72px}
          .hero-stage{position:relative;inset:auto;height:auto}
          .hero-video-wrap{height:min(62svh,640px)}
          .hero-ghost{top:4svh}
          .hero-copy{flex-direction:column;align-items:flex-start;gap:20px;margin-top:0}
          .hero-left,.hero-right{max-width:none}
          .hero-sound{right:6%}
        }
        @media (max-width:520px){.hero-ctas .btn{height:44px;padding:0 18px}}
      `}</style>
    </section>
  );
}
