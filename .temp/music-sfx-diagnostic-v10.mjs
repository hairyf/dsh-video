import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Evaluate only the existing timing declarations; do not import Film's browser/render side effects.
export function sourceSfx() {
  const film = readFileSync("src/Film.tsx", "utf8");
  const ast = ts.createSourceFile("Film.tsx", film, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = ["B", "SECTIONS", "FPS", "srcTimes", "ENDING", "SFX_CUES"];
  const declarations = names.map(name => {
    const declaration = ast.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.getText(ast) === name);
    assert(declaration?.initializer, `Missing timing declaration: ${name}`);
    return `const ${name} = ${declaration.initializer.getText(ast)};`;
  });
  const duration = film.match(/const SoundEffects:[^\n]*durationInFrames=\{(\d+)\}/);
  assert(duration, "SFX Sequence duration must remain explicit");
  const timeline = ts.transpileModule(readFileSync("src/demo-timeline.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const timing = ts.transpileModule(`${declarations.join("\n")}\nresult = { cues: SFX_CUES, fps: FPS };`, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, result: null };
  runInNewContext(timeline, context);
  Object.assign(context, context.exports);
  runInNewContext(timing, context);
  const durations = new Map();
  return context.result.cues.map(cue => {
    if (!durations.has(cue.sound)) durations.set(cue.sound, Number(execFileSync(resolve(".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffprobe.exe"), ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `public/sfx/coopanion-${cue.sound}.wav`], { encoding: "utf8" }).trim()));
    const seconds = durations.get(cue.sound);
    assert(Number.isFinite(seconds) && seconds > 0, `Invalid SFX duration: ${cue.sound}`);
    return { ...cue, start: cue.frame / context.result.fps, end: cue.frame / context.result.fps + Math.min(Number(duration[1]) / context.result.fps, seconds) };
  });
}

// Both nearest clean sides, chosen from source timing alone; two AAC blocks guard codec edges.
export function cleanWindows(anchor, cues) {
  const rate = 48000, length = .35 * rate, target = anchor * rate;
  const spans = cues.map(c => [Math.round(c.start * rate) - 2048, Math.ceil(c.end * rate) + 2048]);
  const clear = start => start >= 0 && !spans.some(([a, b]) => start < b && start + length > a);
  if (clear(target)) return [anchor];
  const candidates = spans.flatMap(([a, b]) => [a - length, b]).filter(clear);
  const before = Math.max(...candidates.filter(start => start < target)), after = Math.min(...candidates.filter(start => start > target));
  assert([before, after].every(start => Number.isFinite(start) && Math.abs(start - target) <= rate), `No clean bracketing windows within 1s of ${anchor}s`);
  return [before / rate, after / rate];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const film = "out/film-simulated-v10-4k.mp4", source = "public/decisive-battle-original.mp3";
  const bin = resolve(".temp/tools/ffmpeg-unpacked/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe"), rate = 48000;
  const pcm = (path, start, seconds) => execFileSync(bin, ["-v", "error", "-i", path, "-ss", String(start), "-t", String(seconds), "-vn", "-ac", "1", "-ar", String(rate), "-f", "f32le", "-"], { maxBuffer: 96 * 1024 * 1024 });
  const stats = (a, b) => {
    assert.equal(a.length, b.length);
    let dot = 0, aa = 0, bb = 0;
    for (let i = 0; i < a.length; i += 4) { const x = a.readFloatLE(i), y = b.readFloatLE(i); dot += x * y; aa += x * x; bb += y * y; }
    return { correlation: dot / Math.sqrt(aa * bb), gain: dot / bb };
  };
  for (const path of [film, source, "src/Film.tsx", "src/demo-timeline.ts", "HANDOFF.md", ".temp/check-deliverables-v7-4k.mjs"])
    console.log("PROTECTED", JSON.stringify({ path, bytes: readFileSync(path).length, sha256: createHash("sha256").update(readFileSync(path)).digest("hex") }));
  const sample = [{ start: 10, end: 10.2 }], guard = 2048 / rate;
  assert.deepEqual(cleanWindows(8, sample), [8]);
  assert.deepEqual(cleanWindows(10, sample), [(10 * rate - 2048 - .35 * rate) / rate, Math.ceil(10.2 * rate + 2048) / rate]);
  assert.throws(() => cleanWindows(10, [{ start: 8, end: 12 }]));
  const cues = sourceSfx();
  const plan = [31, 63, 68, 70, 72, 76, 79, 85, 98, 120, 139].map(anchor => ({ anchor, starts: cleanWindows(anchor, cues) }));
  for (const row of plan) for (const start of row.starts) assert(!cues.some(c => start < c.end + guard && start + .35 > c.start - guard), `SFX overlap at ${start}`);
  console.log("SOURCE_DERIVED_PLAN", JSON.stringify(plan));
  console.log("SFX_95_101", JSON.stringify(cues.filter(c => c.end > 95 && c.start < 101)));
  console.log("SFX_70_80", JSON.stringify(cues.filter(c => c.end > 70 && c.start < 80)));
  for (const start of [97.8, 98, 99.3]) console.log("SAME_TIME", JSON.stringify({ start, seconds: .35, ...stats(pcm(film, start, .35), pcm(source, start, .35)) }));
  const a = pcm(film, 98, .35), music = pcm(source, 98, .35), expected = Buffer.from(music);
  const land = cues.find(c => c.sound === "land" && c.start >= 98 && c.start < 99);
  assert(land, "Expected source-derived land near 98s");
  const sfx = pcm("public/sfx/coopanion-land.wav", 0, land.end - land.start);
  for (let i = 0; i < expected.length / 4; i++) {
    const j = i - Math.round((land.start - 98) * rate);
    expected.writeFloatLE(.32 * music.readFloatLE(i * 4) + (j >= 0 && j * 4 < sfx.length ? land.volume * 5 * 1.35 * sfx.readFloatLE(j * 4) : 0), i * 4);
  }
  console.log("MUSIC_PLUS_SOURCE_LAND", JSON.stringify({ ...land, sfxGain: land.volume * 5 * 1.35, ...stats(a, expected) }));
}
