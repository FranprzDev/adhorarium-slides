// Renders the built deck with a local Chromium: slide screenshots, the slides PDF and the speaker script PDF.
// Usage: node scripts/capture.mjs <shots|gpu|pdf> [outDir]
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const CHROMIUM = process.env.CHROMIUM_PATH ?? "/usr/bin/chromium";
const DIST = pathToFileURL(resolve("dist/index.html")).href;
const [mode = "shots", outArg = "../slides-scratch/shots"] = process.argv.slice(2);
const outDir = resolve(outArg);
await mkdir(outDir, { recursive: true });

const gpuArgs = [
  "--enable-unsafe-webgpu",
  "--enable-features=Vulkan",
  "--use-vulkan=swiftshader",
  "--use-angle=swiftshader",
  "--use-webgpu-adapter=swiftshader",
  "--enable-unsafe-swiftshader",
];

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  args: ["--no-sandbox", ...(mode === "gpu" ? gpuArgs : [])],
});

async function waitForImages(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((img) => (img.complete ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = img.onerror = r; }))),
    );
  });
}

try {
  if (mode === "shots" || mode === "gpu") {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on("console", (msg) => console.log(`[console] ${msg.text()}`));
    const query = mode === "gpu" ? "" : "?static";
    await page.goto(`${DIST}${query}#1`);
    await waitForImages(page);
    const count = await page.evaluate(() => document.querySelectorAll(".stage .slide").length);
    for (let i = 1; i <= count; i += 1) {
      await page.evaluate((n) => { window.location.hash = `#${n}`; }, i);
      await page.waitForTimeout(mode === "gpu" ? 1800 : 150);
      const file = `${outDir}/${mode === "gpu" ? "gpu-" : ""}s${String(i).padStart(2, "0")}.png`;
      await page.screenshot({ path: file });
    }
    const renderer = await page.evaluate(() => document.documentElement.dataset.renderer);
    console.log(`captured ${count} slides, renderer=${renderer}`);
  }
  if (mode === "pdf") {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(`${DIST}?print`);
    await waitForImages(page);
    await page.pdf({ path: `${outDir}/AdHorarium-Presentacion.pdf`, preferCSSPageSize: true, printBackground: true });
    const script = await browser.newPage();
    await script.goto(`${DIST}?script`);
    await waitForImages(script);
    await script.pdf({
      path: `${outDir}/AdHorarium-Guion-Presentacion.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: '<div style="width:100%;font-size:9px;color:#6b7280;text-align:center;font-family:Arial">AdHorarium · Guion de la presentación · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    });
    console.log("PDFs written");
  }
} finally {
  await browser.close();
}
