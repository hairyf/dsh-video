// 量化参考片的“节奏感”：镜头切换频率、静止帧比例、运动强度、主色。
// 用法：node .temp/motion-stats.mjs <video> [...]
import { execFileSync } from "node:child_process";

const ff = ".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe";
const W = 96;
const H = 54;

for (const file of process.argv.slice(2)) {
  // 统一缩到 96x54 灰度、15fps，逐帧差分。
  const buf = execFileSync(ff, ["-v", "error", "-i", file, "-vf", `fps=15,scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 30 });
  const n = buf.length / (W * H);
  const diffs = [];
  for (let f = 1; f < n; f++) {
    let d = 0;
    for (let i = 0; i < W * H; i++) d += Math.abs(buf[f * W * H + i] - buf[(f - 1) * W * H + i]);
    diffs.push(d / (W * H));
  }
  const cuts = [];
  for (let i = 0; i < diffs.length; i++) if (diffs[i] > 30 && (cuts.length === 0 || i - cuts.at(-1) > 4)) cuts.push(i);
  const still = diffs.filter((d) => d < 0.4).length / diffs.length;
  const gentle = diffs.filter((d) => d >= 0.4 && d < 3).length / diffs.length;
  const sorted = [...diffs].sort((a, b) => a - b);
  // 最长连续静止时长（秒）
  let run = 0;
  let longest = 0;
  for (const d of diffs) { run = d < 0.4 ? run + 1 : 0; longest = Math.max(longest, run); }
  // 每 2 秒的平均运动量，看节奏起伏
  const per2 = [];
  for (let s = 0; s < diffs.length; s += 30) per2.push((diffs.slice(s, s + 30).reduce((a, b) => a + b, 0) / Math.min(30, diffs.length - s)).toFixed(1));
  const dur = n / 15;
  console.log(`\n== ${file}  ${dur.toFixed(1)}s`);
  console.log(`hard cuts: ${cuts.length}  (avg shot ${(dur / (cuts.length + 1)).toFixed(2)}s)`);
  console.log(`still frames: ${(still * 100).toFixed(0)}%  gentle-motion: ${(gentle * 100).toFixed(0)}%  longest still: ${(longest / 15).toFixed(1)}s`);
  console.log(`motion median ${sorted[Math.floor(sorted.length / 2)].toFixed(2)}  p90 ${sorted[Math.floor(sorted.length * 0.9)].toFixed(2)}`);
  console.log(`motion per 2s: ${per2.join(" ")}`);
}
