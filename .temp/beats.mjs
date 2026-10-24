// 从 22050Hz 单声道 s16le 原始 PCM 里找重拍。
// 用途：给片头文字定卡点。只做一次性的离线分析，不进仓库。
import { readFileSync } from 'node:fs'

const RATE = 22050
const buf = readFileSync('.temp/beat-30s.raw')
const n = buf.length / 2
const samples = new Float32Array(n)
for (let i = 0; i < n; i++) samples[i] = buf.readInt16LE(i * 2) / 32768

// 低频能量更能代表鼓点：一阶低通后再取窗能量
const alpha = 0.06
const low = new Float32Array(n)
let prev = 0
for (let i = 0; i < n; i++) {
  prev = prev + alpha * (samples[i] - prev)
  low[i] = prev
}

const hop = 256 // ≈11.6ms
const win = 1024
const frames = Math.floor((n - win) / hop)
const energy = new Float64Array(frames)
for (let f = 0; f < frames; f++) {
  let sum = 0
  const start = f * hop
  for (let i = 0; i < win; i++) {
    const v = low[start + i]
    sum += v * v
  }
  energy[f] = Math.sqrt(sum / win)
}

// 谱通量式的一阶差分，正增量才算起音
const flux = new Float64Array(frames)
for (let f = 1; f < frames; f++) flux[f] = Math.max(0, energy[f] - energy[f - 1])

const mean = flux.reduce((a, b) => a + b, 0) / frames
const std = Math.sqrt(flux.reduce((a, b) => a + (b - mean) ** 2, 0) / frames)
const threshold = mean + 1.6 * std

const peaks = []
let lastFrame = -99
const minGapFrames = Math.round((0.10 * RATE) / hop) // 100ms 最小间隔
for (let f = 1; f < frames - 1; f++) {
  if (flux[f] < threshold) continue
  if (flux[f] < flux[f - 1] || flux[f] < flux[f + 1]) continue
  if (f - lastFrame < minGapFrames) {
    if (peaks.length > 0 && flux[f] > peaks[peaks.length - 1].strength) {
      peaks[peaks.length - 1] = { time: (f * hop) / RATE, strength: flux[f] }
      lastFrame = f
    }
    continue
  }
  peaks.push({ time: (f * hop) / RATE, strength: flux[f] })
  lastFrame = f
}

const strong = peaks.filter((p) => p.time <= 26).sort((a, b) => b.strength - a.strength)
const top = strong.slice(0, 40).sort((a, b) => a.time - b.time)

console.log('mean flux', mean.toFixed(5), 'std', std.toFixed(5), 'threshold', threshold.toFixed(5))
console.log('all onsets <=26s:', peaks.filter((p) => p.time <= 26).length)
console.log('\n-- strongest 40 onsets in 0-26s (time / strength / frame@30fps) --')
for (const p of top) {
  console.log(p.time.toFixed(3).padStart(7), p.strength.toFixed(4).padStart(8), Math.round(p.time * 30))
}

// 自相关粗估 BPM，帮助确认卡点是否 4/4 小节对齐
const seg = energy.slice(Math.round((1 * RATE) / hop), Math.round((21 * RATE) / hop))
const segMean = seg.reduce((a, b) => a + b, 0) / seg.length
const x = Float64Array.from(seg, (v) => v - segMean)
let best = { lag: 0, score: -Infinity }
for (let lag = Math.round((0.25 * RATE) / hop); lag < Math.round((2 * RATE) / hop); lag++) {
  let s = 0
  for (let i = 0; i + lag < x.length; i++) s += x[i] * x[i + lag]
  s /= x.length - lag
  if (s > best.score) best = { lag, score: s }
}
const lagSec = (best.lag * hop) / RATE
console.log('\nbest autocorr lag', lagSec.toFixed(3), 's =>', (60 / lagSec).toFixed(1), 'BPM (or its multiple/division)')
