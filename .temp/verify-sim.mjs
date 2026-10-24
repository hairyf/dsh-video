import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanWindows, sourceSfx } from "./music-sfx-diagnostic-v10.mjs";
const bin = resolve(".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin");
const ffmpeg = (args, encoding = "utf8") => execFileSync(resolve(bin, "ffmpeg.exe"), args, { encoding, maxBuffer: 96 * 1024 * 1024 });
const film = "out/film-simulated-v11-4k.mp4", mainSeconds = 145, totalSeconds = 175;
const originals = { install: 210, doc: 1077, pdf: 930, ppt: 891, xlsx: 888, revise: 1248, fullwindow: 600, ops: 480 };
const report = [];
for (const [name, frames] of [["Film", totalSeconds * 30], ...Object.entries(originals)]) {
  const path = name === "Film" ? film : `out/simulated-originals/${name}.mp4`;
  const meta = JSON.parse(execFileSync(resolve(bin, "ffprobe.exe"), ["-v", "error", "-show_streams", "-show_format", "-of", "json", path], { encoding: "utf8" }));
  const video = meta.streams.find(s => s.codec_type === "video"), audio = meta.streams.filter(s => s.codec_type === "audio");
  assert.equal(video.codec_name, "h264", path); assert.equal(video.pix_fmt, "yuv420p", path);
  assert.equal(video.width, name === "Film" ? 3840 : 1400, path); assert.equal(video.height, name === "Film" ? 2160 : 900, path);
  assert.equal(video.avg_frame_rate, "30/1", path); assert.equal(Number(video.nb_frames), frames, path);
  assert(Math.abs(Number(video.duration) - frames / 30) < .001, path);
  assert.equal(audio.length, name === "Film" ? 1 : 0, path);
  if (name === "Film") { assert.equal(audio[0].codec_name, "aac"); assert.equal(audio[0].channels, 2); assert(Math.abs(Number(audio[0].duration) - Number(video.duration)) < .03); }
  assert.match(meta.format.tags.comment, /Scripted DSH UI demonstration/);
  ffmpeg(["-v", "error", "-xerror", "-i", path, "-f", "null", "-"]);
  report.push({ name, path, frames, width: video.width, height: video.height, seconds: Number(video.duration), bytes: Number(meta.format.size), audio: audio.map(s => s.codec_name), decode: "passed" });
  console.log(`${name}: ${video.width}x${video.height}, ${frames} frames, ${(frames / 30).toFixed(2)}s, full decode passed`);
}
// Output-side seek preserves MP3 decoder warmup for same-time comparisons.
const pcm = (path, start, seconds, channels = 1) => ffmpeg(["-v", "error", "-i", path, "-ss", String(start), "-t", String(seconds), "-vn", "-ac", String(channels), "-ar", "48000", "-f", "f32le", "-"], null);
const volume = (start, seconds, channels = 1) => {
  const data = pcm(film, start, seconds, channels);
  assert(data.length > 0, "Empty audio range");
  let sum = 0, peak = 0, samplesAtOrAboveFullScale = 0;
  for (let i = 0; i < data.length; i += 4) { const s = data.readFloatLE(i); assert(Number.isFinite(s)); sum += s * s; peak = Math.max(peak, Math.abs(s)); if (Math.abs(s) >= 1) samplesAtOrAboveFullScale++; }
  return { rms: Math.sqrt(sum / (data.length / 4)), peak, peakDbfs: peak ? 20 * Math.log10(peak) : null, samplesAtOrAboveFullScale };
};
const body = volume(15, 1), mainEnding = volume(139, .3), mainTail = volume(144.7, .25), ending = volume(173, .3), tail = volume(174.8, .18);
const mix = { whole: volume(0, totalSeconds, 2), afterIntro: volume(15, mainSeconds - 15, 2), credits: volume(mainSeconds, 30, 2) };
assert(mix.afterIntro.peak < 1 && mix.credits.peak < 1, "Post-intro mix exceeds digital full scale");
assert(body.rms > .001, "Missing music after intro");
assert(mainEnding.rms > .001 && mainTail.rms < mainEnding.rms * .2, "Main music does not end quietly");
assert(ending.rms > .001 && tail.rms < ending.rms * .2, "Credits music does not fade out");
console.log("Decoded stereo mix:", JSON.stringify(mix));
const source = "public/decisive-battle-original.mp3";
const sha256 = createHash("sha256").update(readFileSync(source)).digest("hex");
assert.equal(sha256, "8270e5d7c0b6bb9cec5db11d933dc43f29148d761ff77aec3152c867a1738191", "Original music differs from user upload");
// Correlate encoded audio against the same source times; a back-splice or drift fails these windows.
const continuity = [], sfx = sourceSfx();
// Pick from source cue/WAV occupancy before decoding, never from measured correlation.
// A contaminated anchor gets BOTH nearest clean sides (within 1s), preserving local coverage.
for (const anchor of [31, 63, 68, 70, 72, 76, 79, 85, 98, 120, 139]) {
  for (const start of cleanWindows(anchor, sfx)) {
    const a = pcm(film, start, .35), b = pcm(source, start, .35);
    assert.equal(a.length, .35 * 48000 * 4, `Incomplete film PCM at ${start}s`);
    assert.equal(b.length, a.length, `Incomplete source PCM at ${start}s`);
    const count = a.length / 4;
    let dot = 0, aa = 0, bb = 0;
    for (let i = 0; i < count * 4; i += 4) { const x = a.readFloatLE(i), y = b.readFloatLE(i); dot += x * y; aa += x * x; bb += y * y; }
    const correlation = dot / Math.sqrt(aa * bb), gain = dot / bb;
    assert(correlation > .98, `Main music discontinuity at ${start}s: ${correlation}`);
    assert(gain > .3 && gain < .6, `Unexpected main music gain at ${start}s: ${gain}`);
    const row = { anchor, start, seconds: count / 48000, correlation, gain };
    continuity.push(row);
    console.log("Music continuity:", JSON.stringify(row));
  }
}
const last = ffmpeg(["-v", "error", "-i", film, "-vf", "select=eq(n\\,5249),scale=16:9", "-frames:v", "1", "-pix_fmt", "gray", "-f", "rawvideo", "-"], null);
assert(last.length === 144 && Math.max(...last) < 8, "Final frame is not black");
const result = { files: report, audio: { body, mainEnding, mainTail, ending, tail, mix, original: { source, sha256, continuity } }, finalBlackFrame: true };
writeFileSync("out/simulation-verification-v11-4k.json", JSON.stringify(result, null, 2) + "\n");
console.log("Continuous original music, stereo peaks, fades and final black frame passed. Saved out/simulation-verification-v11-4k.json");
