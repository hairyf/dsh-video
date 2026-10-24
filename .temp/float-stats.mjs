// 估计参考片里“窗口微微拂动”的幅度/周期，以及转场时长。
// 全局位移：在 1/4 分辨率上做小范围块匹配（±6px），只对中心区域。
import { execFileSync } from "node:child_process";

const ff = ".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe";
const [file, startArg = "0", durArg = "20"] = process.argv.slice(2);
const W = 320;
const H = 180;
const buf = execFileSync(ff, ["-v", "error", "-ss", startArg, "-t", durArg, "-i", file, "-vf", `fps=30,scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 30 });
const n = buf.length / (W * H);
const px = (f, x, y) => buf[f * W * H + y * W + x];

// 运动段：连续 diff>2 的区间 = 转场/动画时长
const diff = [];
for (let f = 1; f < n; f++) {
  let d = 0;
  for (let i = 0; i < W * H; i += 4) d += Math.abs(buf[f * W * H + i] - buf[(f - 1) * W * H + i]);
  diff.push(d / (W * H / 4));
}
const segs = [];
let s = -1;
diff.forEach((d, i) => {
  if (d > 2 && s < 0) s = i;
  if (d <= 2 && s >= 0) { segs.push([s, i - s, Math.max(...diff.slice(s, i)).toFixed(1)]); s = -1; }
});
console.log(`motion bursts (start s / length frames / peak): ${segs.filter((x) => x[1] >= 3).map(([a, l, p]) => `${(a / 30 + +startArg).toFixed(1)}/${l}/${p}`).join("  ")}`);

// 全局位移：帧 f 相对帧 0 在中心 160x90 区域的最佳 (dx,dy)
const R = 6;
const shifts = [];
for (let f = 0; f < n; f += 3) {
  let best = [0, 0, Infinity];
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
    let e = 0;
    for (let y = 45; y < 135; y += 3) for (let x = 80; x < 240; x += 3) e += Math.abs(px(f, x + dx, y + dy) - px(0, x, y));
    if (e < best[2]) best = [dx, dy, e];
  }
  shifts.push(`${best[0]},${best[1]}`);
}
console.log(`global shift vs first frame every 0.1s (x,y in 1/4-res px):\n${shifts.join(" ")}`);
