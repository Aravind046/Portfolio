#!/usr/bin/env node
/**
 * Visual + layout smoke test. Run against a production server:
 *   npm run build && npm start   (in another terminal)
 *   npm run check                 # or: node scripts/check.mjs http://localhost:3000
 *
 * Uses playwright-core with the system Google Chrome (no browser download).
 * Saves full-page screenshots to screenshots/ and fails if any viewport has
 * horizontal overflow or the page logs console errors.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "small", width: 360, height: 740, isMobile: true, hasTouch: true },
];

mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
let failed = false;

for (const vp of viewports) {
  const { name, ...opts } = vp;
  const ctx = await browser.newContext({ viewport: { width: opts.width, height: opts.height }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle" });

  // Walk every section so reveal-on-scroll and lazy content settle.
  const overflow = await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const bad = [];
    for (const s of document.querySelectorAll("main > section")) {
      s.scrollIntoView();
      await wait(500);
      const sw = document.documentElement.scrollWidth;
      if (sw !== window.innerWidth) bad.push(`${s.id}: scrollWidth ${sw} ≠ ${window.innerWidth}`);
    }
    window.scrollTo(0, 0);
    await wait(1200);
    return bad;
  });

  const video = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { src: v.currentSrc.split("/").pop(), paused: v.paused, loop: v.loop } : null;
  });

  await page.screenshot({ path: `screenshots/${name}-hero.png` });
  await page.screenshot({ path: `screenshots/${name}-full.png`, fullPage: true });

  const ok = overflow.length === 0 && errors.length === 0;
  failed ||= !ok;
  console.log(`${ok ? "✓" : "✗"} ${name} ${opts.width}×${opts.height}  video=${JSON.stringify(video)}`);
  overflow.forEach((o) => console.log("   overflow:", o));
  errors.forEach((e) => console.log("   console error:", e));
  await ctx.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
