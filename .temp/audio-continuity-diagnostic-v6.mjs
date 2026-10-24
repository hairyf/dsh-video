import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const bin = resolve('.temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin');
const film = 'out/film-simulated-v6.mp4', source = 'public/decisive-battle-original.mp3', rate = 48000;
const windows = [31, 63, 68, 70, 72, 76, 79, 85, 98, 120, 139];
const sourcePaths = dir => readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory() ? sourcePaths(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
const protectedPaths = [film, source, '.temp/verify-sim.mjs', '.temp/render-sim.mjs', ...sourcePaths('src')];
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const before = Object.fromEntries(protectedPaths.map(p => [p, hash(p)]));
console.log('BEFORE_SHA256', JSON.stringify(before));
const ff = args => execFileSync(resolve(bin, 'ffmpeg.exe'), ['-v', 'error', ...args], {maxBuffer: 96 * 1024 * 1024});
const floats = bytes => { const a = new Float32Array(bytes.length / 4); for (let i = 0; i < a.length; i++) a[i] = bytes.readFloatLE(i * 4); return a; };
const full = path => floats(ff(['-i', path, '-map', '0:a:0', '-t', '145', '-vn', '-ac', '1', '-ar', String(rate), '-f', 'f32le', '-']));
const seek = (path, start, seconds = .35) => floats(ff(['-ss', String(start), '-i', path, '-t', String(seconds), '-vn', '-ac', '1', '-ar', String(rate), '-f', 'f32le', '-']));
function stats(a, b, ai, bi, n, step = 1) {
  assert(ai >= 0 && bi >= 0 && ai + n <= a.length && bi + n <= b.length, 'PCM bounds');
  let ab = 0, aa = 0, bb = 0;
  for (let i = 0; i < n; i += step) { const x = a[ai + i], y = b[bi + i]; ab += x * y; aa += x * x; bb += y * y; }
  const correlation = ab / Math.sqrt(aa * bb), gain = ab / bb;
  return {correlation, gain, residualFraction: Math.sqrt(Math.max(0, 1 - correlation * correlation))};
}
// Positive lag means film content is delayed: compare film[t + lag] against source[t].
function best(a, b, ai, bi, n, bound = 1440) {
  let lag = 0, score = -Infinity;
  for (let k = -bound; k <= bound; k++) { const r = stats(a, b, ai + k, bi, n, 4).correlation; if (r > score) {score = r; lag = k;} }
  let result = {lagSamples: lag, ...stats(a, b, ai + lag, bi, n)};
  for (let k = Math.max(-bound, lag - 3); k <= Math.min(bound, lag + 3); k++) { const s = stats(a, b, ai + k, bi, n); if (s.correlation > result.correlation) result = {lagSamples: k, ...s}; }
  return {...result, lagMs: result.lagSamples / rate * 1000};
}
const testB = Float32Array.from({length: 800}, (_, i) => Math.sin(i * i * .7));
const testA = Float32Array.from({length: 800}, (_, i) => i >= 5 ? .4 * testB[i - 5] : 0);
assert.equal(best(testA, testB, 100, 100, 400, 20).lagSamples, 5);
assert(Math.abs(stats(testA, testB, 105, 100, 400).gain - .4) < 1e-7);
for (const path of [film, source]) {
  const meta = JSON.parse(execFileSync(resolve(bin, 'ffprobe.exe'), ['-v', 'error', '-select_streams', 'a:0', '-show_streams', '-show_format', '-of', 'json', path], {encoding: 'utf8'}));
  console.log('AUDIO_METADATA', path, JSON.stringify(meta));
}
const text = readFileSync('.temp/verify-sim.mjs', 'utf8').split('\n');
for (const line of [55, 58]) console.log('VERIFIER_CHAR_CODES', line, JSON.stringify([...text[line - 1]].map(c => c.codePointAt(0))));
const a = full(film), b = full(source), n = Math.round(.35 * rate);
console.log('FULL_SAMPLES', JSON.stringify({film: a.length, source: b.length}));
const allTimes = process.argv.includes('--dense') ? [...new Set([...windows, ...Array.from({length: 41}, (_, i) => 70 + i / 4)])].sort((x, y) => x - y) : windows;
const fullRows = [];
for (const t of allTimes) {
  const pos = Math.round(t * rate), zero = stats(a, b, pos, pos, n), aligned = best(a, b, pos, pos, n);
  const row = {time: t, zero, best: aligned}; fullRows.push(row); console.log('FULL_WINDOW', JSON.stringify(row));
}
for (const t of windows) {
  const x = seek(film, t), y = seek(source, t), xp = seek(film, t - .04, .43), yp = seek(source, t - .04, .43), pad = Math.round(.04 * rate), pos = Math.round(t * rate);
  const row = {time: t, zero: stats(x, y, 0, 0, Math.min(x.length, y.length)), paddedBest: best(xp, yp, pad, pad, n), seekFilmVsFull: best(xp, a, pad, pos, n), seekSourceVsFull: best(yp, b, pad, pos, n)};
  console.log('SEEK_WINDOW', JSON.stringify(row));
}
const lagCounts = {};
for (const row of fullRows) lagCounts[row.best.lagSamples] = (lagCounts[row.best.lagSamples] ?? 0) + 1;
console.log('LAG_COUNTS', JSON.stringify(lagCounts));
const after = Object.fromEntries(protectedPaths.map(p => [p, hash(p)]));
assert.deepEqual(after, before, 'Protected input bytes changed during diagnosis');
console.log('AFTER_SHA256', JSON.stringify(after));
console.log('PROTECTED_BYTES_UNCHANGED', protectedPaths.length);
