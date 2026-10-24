// 整首 BGM 的低频起音（同 beats2.mjs 的算法）+ 每 2 秒响度，用来给完整片定段落切点。
import { execFileSync } from "node:child_process";

const ff = ".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe";
const RATE = 22050;
const pcm = execFileSync(ff, ["-v", "error", "-i", "material/bgm/decisive-battle.m4a", "-ac", "1", "-ar", String(RATE), "-f", "s16le", "-"], { maxBuffer: 1 << 28 });
const n = pcm.length / 2;
const samples = new Float32Array(n);
for (let i = 0; i < n; i++) samples[i] = pcm.readInt16LE(i * 2) / 32768;

const low = new Float32Array(n);
let prev = 0;
for (let i = 0; i < n; i++) low[i] = prev = prev + 0.06 * (samples[i] - prev);

const hop = 256;
const win = 1024;
const frames = Math.floor((n - win) / hop);
const energy = new Float64Array(frames);
for (let f = 0; f < frames; f++) {
  let sum = 0;
  for (let i = 0; i < win; i++) sum += low[f * hop + i] ** 2;
  energy[f] = Math.sqrt(sum / win);
}
const flux = new Float64Array(frames);
for (let f = 1; f < frames; f++) flux[f] = Math.max(0, energy[f] - energy[f - 1]);
const mean = flux.reduce((a, b) => a + b, 0) / frames;
const std = Math.sqrt(flux.reduce((a, b) => a + (b - mean) ** 2, 0) / frames);
const peaks = [];
let last = -99;
const gap = Math.round((0.1 * RATE) / hop);
for (let f = 1; f < frames - 1; f++) {
  if (flux[f] < mean + 1.6 * std || flux[f] < flux[f - 1] || flux[f] < flux[f + 1]) continue;
  if (f - last < gap) {
    if (peaks.length && flux[f] > peaks.at(-1).s) peaks[peaks.length - 1] = { t: (f * hop) / RATE, s: flux[f] };
    last = f;
    continue;
  }
  peaks.push({ t: (f * hop) / RATE, s: flux[f] });
  last = f;
}
const max = Math.max(...peaks.map((p) => p.s));
console.log("strong onsets after 24s (frame@30fps, rel):");
console.log(peaks.filter((p) => p.t > 24 && p.s / max > 0.55).map((p) => `${Math.round(p.t * 30)}:${(p.s / max).toFixed(2)}`).join(" "));

console.log("\nRMS per 2s (full band):");
const seg = 2 * RATE;
const rows = [];
for (let i = 0; i < n; i += seg) {
  let a = 0;
  const end = Math.min(n, i + seg);
  for (let j = i; j < end; j++) a += samples[j] ** 2;
  rows.push(`${(i / RATE).toFixed(0)}s:${Math.sqrt(a / (end - i)).toFixed(3)}`);
}
console.log(rows.join(" "));
