#!/usr/bin/env python3
"""
Build the hero assets from the raw intro video.

  python3 scripts/build-hero-assets.py [path/to/intro.mp4] [--photo portrait.jpg]
                                       [--crop W:H:X:Y] [--seconds 10] [--fade 0.5]

Outputs
  public/hero/hero.mp4      H.264 yuv420p, CRF 24, preset slow, AAC 96k, +faststart
  public/hero/hero.webm     VP9 CRF 36, Opus 80k
  public/hero/poster.webp   first frame of the loop (video poster)
  public/portrait-bust.webp 480x600 head-to-shirt crop from the sharpest frame
  public/og.jpg             1200x630 social card

Pipeline
  1. Detect the person (pixels clearly darker than the backdrop) and crop tightly
     around them, centred. If the crop is wider than 4:5 the frame is padded with
     white at the top, so it stays 768x960 without cutting off the shoulders.
  2. Whiten the backdrop: colorlevels=rimax=0.98:gimax=0.98:bimax=0.98, then a
     highlight-only curve whose knee is measured from the backdrop, so a grey
     vignette turns pure white while skin and clothing keep their midtones.
  3. Seamless loop: the last FADE seconds of picture are cross-faded into the first
     FADE seconds (ffmpeg xfade). The audio gets the same cross-fade, sample-accurate,
     in numpy. Nothing is stretched or retimed, so lips stay in sync.

Requirements: numpy, pillow, and ffmpeg on PATH (or `pip install imageio-ffmpeg`).
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_W, OUT_H = 768, 960
SR = 48000


def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it (brew install ffmpeg) or `pip install imageio-ffmpeg`.")


FF = ffmpeg_bin()


def run(args: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run([FF, "-hide_banner", "-v", "error", "-y", *args], check=True, **kw)


def probe(src: Path) -> tuple[float, int, int, float]:
    info = subprocess.run([FF, "-hide_banner", "-i", str(src)], capture_output=True, text=True).stderr
    d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
    v = re.search(r"Video:.*?(\d{3,5})x(\d{3,5}).*?([\d.]+) fps", info)
    if not d or not v:
        sys.exit("Could not read video duration/size.")
    dur = int(d[1]) * 3600 + int(d[2]) * 60 + float(d[3])
    return dur, int(v[1]), int(v[2]), float(v[3])


def frames(src: Path, w: int, h: int, fps: float = 2, scale: int = 4) -> np.ndarray:
    sw, sh = w // scale, h // scale
    raw = run(
        ["-i", str(src), "-vf", f"fps={fps},scale={sw}:{sh}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, sh, sw, 3).astype(np.float32)


def detect(src: Path, w: int, h: int) -> tuple[tuple[int, int, int, int], float]:
    """Return a crop (W, H, X, Y) around the person and the whitening knee (0-1)."""
    scale = 4
    f = frames(src, w, h, scale=scale)
    lum = f.mean(axis=(0, 3))
    edge = max(4, lum.shape[1] // 20)
    bg_ref = np.concatenate([lum[:, :edge].ravel(), lum[:, -edge:].ravel()])
    mask = lum < np.median(bg_ref) - 35
    ys, xs = np.where(mask)
    if xs.size == 0:
        sys.exit("Could not find the person. Pass --crop W:H:X:Y.")
    x0, x1 = xs.min() * scale, (xs.max() + 1) * scale
    y0 = ys.min() * scale
    margin = int(0.02 * w)
    cw = min(w, (x1 - x0) + 2 * margin)
    cw -= cw % 2
    cx = (x0 + x1) // 2
    x = int(np.clip(cx - cw // 2, 0, w - cw))
    y = max(0, y0 - margin)
    y -= y % 2
    ch = h - y
    # Knee: darkest 2 % of the backdrop, a touch lower so the whole vignette clips to white.
    knee = float(np.percentile(lum[~mask], 2)) / 255.0 * 0.98 - 0.02
    return (cw, ch, x, y), min(max(knee, 0.6), 0.97)


def video_chain(crop: tuple[int, int, int, int], knee: float) -> str:
    cw, ch, x, y = crop
    k = f"{knee:.3f}"
    mid = f"{knee * 0.6:.3f}/{knee * 0.6 * 1.02:.3f}"
    chain = [
        f"crop={cw}:{ch}:{x}:{y}",
        "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98",
        f"curves=all='0/0 {mid} {k}/1 1/1'",
    ]
    target_h = round(cw * OUT_H / OUT_W)
    if target_h > ch:  # too wide for 4:5 → pad white on top, person stays grounded
        chain.append(f"pad={cw}:{target_h + target_h % 2}:0:{target_h - ch + target_h % 2}:white")
    chain += [f"scale={OUT_W}:{OUT_H}:flags=lanczos", "setsar=1", "format=yuv420p"]
    return ",".join(chain)


def read_audio(src: Path, seconds: float) -> np.ndarray:
    raw = run(
        ["-i", str(src), "-t", f"{seconds}", "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def loop_audio(a: np.ndarray, dur: float, fade: float) -> np.ndarray:
    """out = a[fade : dur-fade] + crossfade(a[dur-fade : dur] → a[0 : fade]).

    The output is dur-fade long and its end flows straight into its start."""
    n, f = int(round(dur * SR)), int(round(fade * SR))
    a = np.pad(a, ((0, max(0, n - len(a))), (0, 0)))[:n]
    t = np.linspace(0, np.pi / 2, f, dtype=np.float32)[:, None]
    tail = a[n - f :] * np.cos(t) + a[:f] * np.sin(t)  # equal-power
    return np.concatenate([a[f : n - f], tail]).clip(-1, 1)


def write_wav(path: Path, a: np.ndarray) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((a * 32767).astype("<i2").tobytes())


def sharpest_frame(path: Path, tmp: Path) -> Path:
    import PIL.Image as Image

    out = tmp / "frames"
    out.mkdir(exist_ok=True)
    run(["-i", str(path), "-vf", "fps=4", str(out / "f%03d.png")])
    best, score = None, -1.0
    for p in sorted(out.glob("*.png")):
        g = np.asarray(Image.open(p).convert("L"), np.float32)
        h = g[: int(g.shape[0] * 0.55), g.shape[1] // 4 : g.shape[1] * 3 // 4]  # face region
        lap = np.abs(4 * h[1:-1, 1:-1] - h[:-2, 1:-1] - h[2:, 1:-1] - h[1:-1, :-2] - h[1:-1, 2:])
        s = float(lap.var())
        if s > score:
            best, score = p, s
    assert best
    return best


def make_stills(frame: Path, photo: Path | None, name: str, role: str) -> None:
    from PIL import Image, ImageDraw, ImageFont, ImageOps

    src = Image.open(photo or frame).convert("RGB")
    # Head-to-shirt bust: find the person's top and horizontal centre, then crop 4:5.
    g = np.asarray(src.convert("L"), np.float32)
    ys, xs = np.where(g < np.median(g[:, :20]) - 35)
    top = int(ys.min()) if ys.size else 0
    cx = int(np.median(xs)) if xs.size else src.width // 2
    bh = int(src.height * 0.62) if not photo else src.height
    bw = int(bh * 0.8)
    box = (cx - bw // 2, max(0, top - int(bh * 0.06)), cx + bw // 2, max(0, top - int(bh * 0.06)) + bh)
    bust = ImageOps.pad(src.crop(box), (480, 600), color=(255, 255, 255), centering=(0.5, 1))
    bust.save(ROOT / "public/portrait-bust.webp", "WEBP", quality=84, method=6)

    paper = (244, 242, 238)
    og = Image.new("RGB", (1200, 630), paper)
    person = ImageOps.contain(src, (720, 630))
    pm = Image.new("RGB", og.size, (255, 255, 255))
    pm.paste(person, (1200 - person.width + 60, 630 - person.height))
    og = Image.fromarray((np.asarray(og, np.float32) * np.asarray(pm, np.float32) / 255).astype(np.uint8))
    d = ImageDraw.Draw(og)

    def font(size: int) -> ImageFont.ImageFont:
        for f in ("/System/Library/Fonts/HelveticaNeue.ttc", "/System/Library/Fonts/Helvetica.ttc",
                  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
            try:
                return ImageFont.truetype(f, size, index=1 if f.endswith(".ttc") else 0)
            except OSError:
                continue
        return ImageFont.load_default()

    first, *rest = name.split(" ")
    d.text((72, 200), first, font=font(104), fill=(13, 13, 13))
    d.text((72, 310), " ".join(rest), font=font(104), fill=(13, 13, 13))
    d.text((76, 448), role, font=font(36), fill=(119, 117, 111))
    d.line((76, 520, 156, 520), fill=(13, 13, 13), width=2)
    og.save(ROOT / "public/og.jpg", "JPEG", quality=86, optimize=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src", nargs="?", help="intro video (defaults to the first .mp4/.mov in the repo root)")
    ap.add_argument("--crop", help="W:H:X:Y override for the person crop")
    ap.add_argument("--knee", type=float, help="whitening knee 0-1 override")
    ap.add_argument("--seconds", type=float, default=10.0)
    ap.add_argument("--fade", type=float, default=0.5)
    ap.add_argument("--photo", help="optional photo for portrait-bust.webp / og.jpg")
    ap.add_argument("--name", default="Aravind Prakash")
    ap.add_argument("--role", default="UI/UX Designer")
    args = ap.parse_args()

    src = Path(args.src) if args.src else next(
        (p for p in sorted(ROOT.iterdir()) if p.suffix.lower() in (".mp4", ".mov")), None
    )
    if not src or not src.exists():
        sys.exit("Pass the intro video path.")
    dur_full, w, h, fps = probe(src)
    dur = min(args.seconds, dur_full)
    # Whole frames only, so video and audio cut at exactly the same instants.
    dur = int(dur * fps) / fps
    fade = round(args.fade * fps) / fps

    crop, knee = detect(src, w, h)
    if args.crop:
        crop = tuple(int(v) for v in args.crop.split(":"))  # type: ignore[assignment]
    if args.knee:
        knee = args.knee
    print(f"source {w}x{h} @ {fps:g}fps, {dur_full:.2f}s → using {dur:.3f}s, fade {fade:.3f}s")
    print(f"crop={crop[0]}:{crop[1]}:{crop[2]}:{crop[3]}  knee={knee:.3f}")

    out_dir = ROOT / "public/hero"
    out_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        chain = video_chain(crop, knee)
        # main = [fade, dur), head = [0, fade); xfade main→head over the last `fade` seconds.
        graph = (
            f"[0:v]trim=0:{dur},setpts=PTS-STARTPTS,fps={fps},{chain},split[a][b];"
            f"[a]trim=start={fade},setpts=PTS-STARTPTS[main];"
            f"[b]trim=end={fade},setpts=PTS-STARTPTS[head];"
            f"[main][head]xfade=transition=fade:duration={fade}:offset={dur - 2 * fade:.6f}[v]"
        )
        loop_v = tmp / "loop.mkv"
        run(["-i", str(src), "-filter_complex", graph, "-map", "[v]", "-an",
             "-c:v", "libx264", "-crf", "12", "-preset", "fast", str(loop_v)])

        audio = loop_audio(read_audio(src, dur), dur, fade)
        wav = tmp / "loop.wav"
        write_wav(wav, audio)
        print(f"loop length {len(audio) / SR:.3f}s (video {dur - fade:.3f}s)")

        run(["-i", str(loop_v), "-i", str(wav), "-map", "0:v", "-map", "1:a",
             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "slow",
             "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
             str(out_dir / "hero.mp4")])
        run(["-i", str(loop_v), "-i", str(wav), "-map", "0:v", "-map", "1:a",
             "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
             "-c:a", "libopus", "-b:a", "80k", "-shortest", str(out_dir / "hero.webm")])

        # Poster = first frame of the loop, so there is no jump when playback starts.
        run(["-i", str(loop_v), "-frames:v", "1", "-c:v", "libwebp", "-quality", "80",
             str(out_dir / "poster.webp")])

        frame = sharpest_frame(loop_v, tmp)
        make_stills(frame, Path(args.photo) if args.photo else None, args.name, args.role)

    for p in [out_dir / "hero.mp4", out_dir / "hero.webm", out_dir / "poster.webp", ROOT / "public/portrait-bust.webp", ROOT / "public/og.jpg"]:
        print(f"  {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
