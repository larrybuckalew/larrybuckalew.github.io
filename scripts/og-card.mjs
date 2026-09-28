/**
 * Renders the 1200x630 social card for the hub to assets/img/og.png.
 *
 *   node scripts/og-card.mjs
 *
 * Committed as a real PNG: an extensionless file would be served as
 * application/octet-stream, which social scrapers refuse to preview.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const imgDir = new URL("../assets/img/", import.meta.url).pathname.replace(
  /^\/(\w:)/,
  "$1",
);
mkdirSync(imgDir, { recursive: true });

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @import url("https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500&display=swap");
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; position: relative; overflow: hidden;
    background: radial-gradient(120% 90% at 75% -10%, #1b1440 0%, #0a0c1f 45%, #04050c 100%);
    color: #e8ecf8; font-family: Inter, system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 72px;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(124,92,255,0.10) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,92,255,0.10) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(90% 70% at 50% 0%, #000 10%, transparent 78%);
  }
  .orb { position: absolute; border-radius: 50%; filter: blur(60px); }
  .orb.a { width: 480px; height: 480px; top: -60px; right: -40px;
    background: radial-gradient(circle, #7c5cff, transparent 65%); opacity: .6; }
  .orb.b { width: 300px; height: 300px; bottom: -60px; left: 40%;
    background: radial-gradient(circle, #22d3ee, transparent 65%); opacity: .4; }
  .row { display: flex; align-items: center; gap: 16px; position: relative; }
  .mark { width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, #c4f24a, #22d3ee 55%, #7c5cff); }
  .name { font-family: Sora, Inter, sans-serif; font-size: 32px; font-weight: 600; }
  h1 {
    font-family: Sora, Inter, sans-serif; font-size: 74px; font-weight: 700;
    line-height: 1.06; letter-spacing: -0.025em; position: relative; max-width: 15ch;
  }
  .grad { background: linear-gradient(96deg, #c4f24a, #22d3ee 60%, #7c5cff);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { margin-top: 22px; font-size: 27px; color: rgba(232,236,248,0.62); position: relative; }
  .links { display: flex; gap: 14px; position: relative; }
  .pill { font-size: 22px; color: rgba(232,236,248,0.7);
    border: 1px solid rgba(232,236,248,0.18); border-radius: 999px;
    padding: 8px 20px; background: rgba(232,236,248,0.05); }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="orb a"></div>
  <div class="orb b"></div>

  <div class="row"><div class="mark"></div><div class="name">Larry Buckalew</div></div>

  <div>
    <h1>I build <span class="grad">AI automation</span> and <span class="grad">immersive web</span>.</h1>
    <div class="sub">Four live sites you can click through right now.</div>
  </div>

  <div class="links">
    <div class="pill">Helio — 3D hero</div>
    <div class="pill">Grand Planetarium</div>
    <div class="pill">Living Planet</div>
  </div>
</body>
</html>`;

async function launch() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: `${imgDir}og.png` });
await browser.close();
console.log(`wrote ${imgDir}og.png`);
