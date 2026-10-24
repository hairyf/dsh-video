// Pixel checks: Pet card layout/alpha, navbar height and text presence, window content.
import { execFileSync } from "node:child_process";

const ff = ".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe";
const W = 1920;
const H = 1080;
const gray = (file, x = 0, y = 0, w = W, h = H) =>
  execFileSync(ff, ["-v", "error", "-i", file, "-vf", `crop=${w}:${h}:${x}:${y}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"], { maxBuffer: 1 << 26 });
const rgbAvg = (file, x, y, w, h) => {
  const b = execFileSync(ff, ["-v", "error", "-i", file, "-vf", `crop=${w}:${h}:${x}:${y}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
  const s = [0, 0, 0];
  for (let i = 0; i < b.length; i += 3) for (let c = 0; c < 3; c++) s[c] += b[i + c];
  return s.map((v) => Math.round(v / (b.length / 3)));
};
// Bounding box of pixels brighter than threshold inside a region.
const box = (file, x, y, w, h, thr) => {
  const b = gray(file, x, y, w, h);
  let [x0, y0, x1, y1] = [w, h, -1, -1];
  for (let p = 0; p < b.length; p++) if (b[p] > thr) {
    const px = p % w;
    const py = (p / w) | 0;
    x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py);
  }
  return x1 < 0 ? "empty" : `x ${x + x0}..${x + x1} y ${y + y0}..${y + y1}`;
};

const f340 = "out/keyframes/f340.png";
console.log("f340 left text box", box(f340, 0, 0, 1100, H, 60));
console.log("f340 pet box", box(f340, 1100, 0, 820, H, 20), "| pet img corner", rgbAvg(f340, 1150, 240, 30, 30), "centre", rgbAvg(f340, 1460, 560, 40, 40));

// Install window at f500: x 700 y 200 w 1100 → navbar 55 px tall.
const f500 = "out/keyframes/f500.png";
const rows = gray(f500, 1000, 195, 1, 80);
let edge = -1;
for (let i = 1; i < rows.length; i++) if (Math.abs(rows[i] - rows[i - 1]) > 4 && i > 8) { edge = 195 + i; break; }
console.log("f500 navbar bottom edge near y", edge, "(expected ~255) navbar bg", rgbAvg(f500, 1100, 210, 200, 10));
console.log("f500 menu text box", box(f500, 700, 200, 400, 56, 255 - 120 === 0 ? 0 : -1).toString(), "(any)");
const dark = (file, x, y, w, h) => { const b = gray(file, x, y, w, h); let n = 0; for (const v of b) if (v < 120) n++; return n; };
console.log("f500 dark px in navbar left (menus)", dark(f500, 702, 202, 400, 52), "right (controls)", dark(f500, 1650, 202, 148, 52));
const f720 = "out/keyframes/f720.png";
console.log("f720 dark px in focused navbar left", dark(f720, 622, 152, 400, 60), "right", dark(f720, 1700, 152, 158, 60));
