// 完整片关键帧检查：出界、Pet 透明、气泡与窗口重叠、落版。
import { execFileSync } from "node:child_process";

const ff = ".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe";
const W = 1920;
const H = 1080;
const raw = (file, x = 0, y = 0, w = W, h = H) =>
  execFileSync(ff, ["-v", "error", "-i", file, "-vf", `crop=${w}:${h}:${x}:${y}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 26 });
const avg = (file, x, y, w, h) => {
  const b = raw(file, x, y, w, h);
  const s = [0, 0, 0];
  for (let i = 0; i < b.length; i += 3) for (let c = 0; c < 3; c++) s[c] += b[i + c];
  return s.map((v) => Math.round(v / (b.length / 3)));
};
// Count dark (text-like) pixels in a region; ink is #1b1747, desktop ink #0f1115.
const dark = (file, x, y, w, h) => {
  const b = raw(file, x, y, w, h);
  let n = 0;
  for (let i = 0; i < b.length; i += 3) if (b[i] < 90 && b[i + 1] < 90) n++;
  return n;
};
// Edge strips: background is light lavender; a window/text hitting the edge shows white or dark.
const edges = (file) => ["right", "left", "bottom", "top"].map((side) => {
  const [x, y, w, h] = { right: [1916, 0, 4, H], left: [0, 0, 4, H], bottom: [0, 1076, W, 4], top: [0, 0, W, 4] }[side];
  return `${side}:${avg(file, x, y, w, h).join(",")}`;
}).join(" ");

const frames = [700, 800, 900, 1060, 1200, 1480, 1750, 2000, 2150, 2450, 2600, 2700, 2800, 2950, 3100, 3200, 3290];
for (const f of frames) {
  const file = `out/film-keys/f${f}.png`;
  console.log(`f${f} ${edges(file)} | caption-dark ${dark(file, 70, 180, 520, 560)} | window-centre ${avg(file, 1100, 500, 200, 100).join(",")}`);
}
// Pet bottom-left (scaled 0.54): box x 40..342, y 770..1072. Corner vs background.
for (const f of [1200, 2450, 3200]) {
  const file = `out/film-keys/f${f}.png`;
  console.log(`f${f} pet corner ${avg(file, 45, 1050, 15, 15)} bg-ref ${avg(file, 380, 1050, 15, 15)} pet-centre ${avg(file, 170, 900, 40, 40)}`);
}
// Bubble above Pet in body: left 40+20*0.54, top 770-170*0.54 ≈ 678 → region x 50..600 y 670..760.
for (const f of [1060, 1480, 2150]) {
  const file = `out/film-keys/f${f}.png`;
  console.log(`f${f} bubble region dark px ${dark(file, 50, 670, 560, 90)} white ${avg(file, 60, 690, 200, 40)}`);
}
// Compare scene f2450: two windows at x 90 and 1010, w 820, must not overlap the Pet column much.
console.log("f2450 before window centre", avg("out/film-keys/f2450.png", 400, 600, 100, 60), "after", avg("out/film-keys/f2450.png", 1350, 600, 100, 60));
