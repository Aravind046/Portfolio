# Aravind Prakash — Portfolio

A "talking-video" personal portfolio: a looping intro video in the hero, then one calm, continuous scroll in white, black and gray.
All copy comes from the résumé (`public/Aravind-Prakash-Resume.pdf`) and lives in one file: [`src/lib/data.ts`](src/lib/data.ts).

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Lenis.
There's no GSAP, no WebGL and no runtime third-party scripts. Fonts are self-hosted.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
npm run lint
npm run check -- http://localhost:3000   # with `npm start` running
```

`npm run check` ([`scripts/check.mjs`](scripts/check.mjs)) uses Playwright (`playwright-core` with your installed Google Chrome) to visit the page at 1440×900, 390×844 and 360×740. It scrolls through every section, fails on horizontal overflow (`scrollWidth !== innerWidth`) or console errors, and saves screenshots to `screenshots/`.

Last verified (production build): first-load JS 128 kB. Lighthouse desktop Performance 100 and Accessibility 100. Lighthouse mobile Performance 95 and Accessibility 100.

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) in production so Open Graph URLs are absolute.

## Sections

| # | Section | Component | Interaction |
|---|---------|-----------|-------------|
| — | Hero | `hero/Hero.tsx` | Seamless looping video (multiply-blended), sound unlocks on first interaction, pauses when < 35 % visible, ▶ / ❚❚ button |
| 01 | About | `sections/About.tsx`, `ui/IdCard.tsx` | Lanyard ID card: pointer-driven damped pendulum, idle sway, flips on hover / tap / Enter–Space |
| 02 | Skills | `sections/Skills.tsx`, `ui/TechLogo.tsx` | Periodic table, diagonal wave reveal, family filters, sticky inspector with logo |
| 03 | Work | `sections/Work.tsx`, `ui/MiniUI.tsx` | Expanding accordion; illustrative grayscale mini-UIs (clip-path wipe). Vertical accordion on mobile |
| 04 | Certifications | `sections/Certifications.tsx` | Ink-flood rows |
| 05 | Experience | `sections/Experience.tsx` | Education + work timeline; the spine draws with scroll and stops light up |
| 06 | Contact | `sections/Contact.tsx`, `sections/Footer.tsx` | Letter-hop heading, copy-email chip (aria-live), spinning badge |

Navigation (`Navigation.tsx`) has a scroll-progress bar, a frosted pill after scrolling, a sliding active indicator and a full-screen mobile menu.

**Omitted on purpose.** The résumé has no achievements, ranks or awards, so there is no Achievements section. It also has no GitHub link, so there are no GitHub buttons.

The Work panels are the named pieces of work from the résumé's experience bullets, because the résumé has no separate projects list.

## Rebuilding the hero video

```bash
python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python scripts/build-hero-assets.py "intro video .mp4"
# options: --crop W:H:X:Y  --knee 0.8  --seconds 10  --fade 0.5  --photo me.jpg
```

The script:

1. **Detects and crops.** It finds the person and crops tightly around them, centred. If the crop is wider than 4:5, it pads white on top. It then scales to 768×960.
2. **Whitens the backdrop.** It applies `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`, then a highlight-only curve. The curve's knee is measured from the backdrop, so a grey vignette clips to pure white and blends into the page.
3. **Makes the loop seamless.** It cross-fades the last 0.5 s of picture into the first 0.5 s with `xfade`. It does the same equal-power cross-fade on the audio, sample-accurately in numpy. Nothing is retimed, so lips stay in sync.
4. **Exports the files:**
   - `public/hero/hero.mp4`: H.264, CRF 24, preset slow, AAC 96k, `+faststart`
   - `public/hero/hero.webm`: VP9, CRF 36, Opus 80k
   - `public/hero/poster.webp`
   - `public/portrait-bust.webp`: 480×600, taken from the sharpest frame
   - `public/og.jpg`: 1200×630

It uses `ffmpeg` from your PATH, or the binary from `imageio-ffmpeg`.

## Credits & licences

| Asset | Source | Licence |
|-------|--------|---------|
| Figma, Sketch, Webflow logos (`public/logos/devicon/`) | [devicon](https://github.com/devicons/devicon) "original" SVGs | MIT, see `public/logos/devicon/LICENSE` |
| Miro, Framer logos (`public/logos/simple-icons/`) | [Simple Icons](https://simpleicons.org) paths with their brand hex | CC0 1.0, see `public/logos/simple-icons/LICENSE.md` and `DISCLAIMER.md` |
| InVision | Not available in either set, so a neutral monogram is drawn instead | — |
| Inter Tight, Instrument Serif, JetBrains Mono (`src/fonts/`) | Fontsource | SIL OFL 1.1, see `src/fonts/LICENSE.md` |

Brand logos are trademarks of their owners and are used only to show which tools are in use.
