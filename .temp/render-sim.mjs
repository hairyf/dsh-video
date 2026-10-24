import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve("@remotion/cli/package.json"));
const { bundle } = cliRequire("@remotion/bundler");
const { openBrowser, selectComposition, renderStill, renderMedia } = cliRequire("@remotion/renderer");
const mode = process.argv[2] || "stills";
if (!["stills", "raw", "film"].includes(mode)) throw new Error("Expected stills, raw or film");
const out = resolve("out", mode === "raw" ? "simulated-originals" : mode === "stills" ? "simulated-keys-v11-4k" : ".");
await mkdir(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts"), enableCaching: false, rspack: false, webpackOverride: config => ({ ...config, cache: false }) });
const browser = await openBrowser("chrome", { logLevel: "error" });
const port = mode === "stills" ? 3222 : mode === "raw" ? 3223 : 3224;
try {
  const shots = [
    ["Demo-install", [150, 174, 195]], ["Demo-doc", [30, 170, 540]],
    ["Demo-pdf", [390]], ["Demo-ppt", [340, 385, 430, 680]],
    ["Demo-xlsx", [350]], ["Demo-revise", [54, 94, 120, 170, 208, 256, 284, 306, 378, 426, 485, 500, 660, 700]],
    ["Demo-fullwindow", [65, 110]], ["Demo-ops", [80, 145]],
    ["Film", [650, 670, 950, 1000, 4776, 4863, 5010]],
  ];
  const jobs = mode === "stills" ? shots : mode === "raw" ? shots.filter(([id]) => id !== "Film").map(([id]) => [id, null]) : [["Film", null]];
  const selected = process.argv.slice(3);
  if (selected.some(id => !jobs.some(([candidate]) => candidate === id))) throw new Error("Unknown composition for this mode");
  for (const [id, frames] of jobs.filter(([id]) => !selected.length || selected.includes(id))) {
    const inputProps = mode === "stills" && id !== "Film" ? { pointer: true } : {};
    const composition = await selectComposition({ serveUrl, port, id, inputProps, puppeteerInstance: browser, logLevel: "error" });
    if (frames) {
      for (const frame of frames) {
        const output = resolve(out, `${id}-${frame}.png`);
        await renderStill({ serveUrl, port, composition, inputProps, frame, output, scale: id === "Film" ? 2 : 1, puppeteerInstance: browser, imageFormat: "png", logLevel: "error" });
        console.log(`${id} frame ${frame} -> ${output}`);
      }
    } else {
      const outputLocation = resolve(out, mode === "film" ? "film-simulated-v11-4k.mp4" : `${id.slice(5)}.mp4`);
      let last = -1;
      await renderMedia({ serveUrl, port, composition, inputProps, codec: "h264", imageFormat: "png", scale: mode === "film" ? 2 : 1, crf: mode === "film" ? 14 : 16, x264Preset: "slow", pixelFormat: "yuv420p", outputLocation, puppeteerInstance: browser, concurrency: mode === "film" ? 4 : 6, overwrite: true, logLevel: "error", metadata: { comment: "Scripted DSH UI demonstration. No live model execution or measured performance claims." }, onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${id}: ${p * 10}%`); } } });
      console.log(`Completed ${outputLocation}`);
    }
  }
} finally {
  await browser.close({ silent: true });
}
