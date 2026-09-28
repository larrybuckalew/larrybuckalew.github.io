/**
 * Regenerates the project thumbnails from the live sites.
 *
 *   node scripts/shoot-thumbs.mjs
 *
 * Screenshots go to assets/img/projects/<slug>.jpg and are committed, so the hub
 * never loads four WebGL sites in iframes (which would be a slideshow of jank).
 * JPEGs keep the page weight sane: a PNG screenshot of a WebGL scene is ~1.5 MB.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const SHOTS = [
  { slug: "grand-planetarium", url: "https://larrybuckalew.github.io/grand-planetarium/" },
  { slug: "living-planet", url: "https://larrybuckalew.github.io/living-planet/" },
  {
    slug: "consulting",
    url: "https://larrybuckalew.github.io/larrybuckalew-consulting/",
  },
  { slug: "hero3d-landing", url: "https://larrybuckalew.github.io/hero3d-landing/" },
];

const dir = new URL("../assets/img/projects/", import.meta.url).pathname.replace(
  /^\/(\w:)/,
  "$1",
);
mkdirSync(dir, { recursive: true });

const gpuArgs = [
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
];

async function launch() {
  try {
    return await chromium.launch({ channel: "chrome", args: gpuArgs });
  } catch {
    return await chromium.launch({ args: gpuArgs });
  }
}

const browser = await launch();

for (const { slug, url } of SHOTS) {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 750 },
    deviceScaleFactor: 1,
  });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    // Let the 3D scene actually render before the shutter.
    await page.waitForTimeout(6000);
    await page.screenshot({ path: `${dir}${slug}.jpg`, type: "jpeg", quality: 72 });
    console.log(`shot ${slug}`);
  } catch (err) {
    console.error(`FAILED ${slug}: ${err.message}`);
  }
  await page.close();
}

await browser.close();
console.log("done");
