import { readFileSync } from 'node:fs'

const RATE = 22050
const buf = readFileSync('.temp/beat-30s.raw')
const n = buf.length / 2
const samples = new Float32Array(n)
for (let i = 0; i < n; i++) samples[i] = buf.readInt16LE(i * 2) / 32768

const alpha = 0.06
const low = new Float32Array(n)
let prev = 0
for (let i = 0; i < n; i++) {
  prev = prev + alpha * (samples[i] - prev)
  low[i] = prev
}

const hop = 256
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

const flux = new Float64Array(frames)
for (let f = 1; f < frames; f++) flux[f] = Math.max(0, energy[f] - energy[f - 1])

const mean = flux.reduce((a, b) => a + b, 0) / frames
const std = Math.sqrt(flux.reduce((a, b) => a + (b - mean) ** 2, 0) / frames)
const threshold = mean + 1.6 * std

const peaks = []
let lastFrame = -99
const minGapFrames = Math.round((0.10 * RATE) / hop)
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

const inRange = peaks.filter((p) => p.time <= 26.2)
const maxStrength = Math.max(...inRange.map((p) => p.strength))
console.log('idx  time   frame  strength  rel')
inRange.forEach((p, i) => {
  const frame = Math.round(p.time * 30)
  const rel = p.strength / maxStrength
  console.log(
    String(i).padStart(3),
    p.time.toFixed(3).padStart(7),
    String(frame).padStart(5),
    p.strength.toFixed(4).padStart(8),
    rel.toFixed(2).padStart(5),
    rel > 0.75 ? '***' : rel > 0.55 ? '**' : '',
  )
})

console.log('\n-- intervals --')
const iv = []
for (let i = 1; i < inRange.length; i++) iv.push(inRange[i].time - inRange[i - 1].time)
console.log(iv.map((v) => v.toFixed(3)).join(' '))
const sorted = [...iv].sort((a, b) => a - b)
console.log('median interval', sorted[Math.floor(sorted.length / 2)].toFixed(3), 's')
