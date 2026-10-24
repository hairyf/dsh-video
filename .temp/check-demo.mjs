import assert from "node:assert/strict";
import ts from "typescript";
import { readFileSync } from "node:fs";
const load = async source => {
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const source = readFileSync(new URL("../src/demo-timeline.ts", import.meta.url), "utf8");
const { DEMOS, OFFICE, REVISE, ANNOTATION_REGION, INSTALL_HOME, pointerAt, pointerMoves, cameraAt, soundCues, typed } = await load(source);
for (const [name, d] of Object.entries(DEMOS)) {
  assert(d.send > 0 && d.result > d.send && d.duration >= d.result + (name === "install" ? 60 : 300), `${name}: invalid timeline`);
  for (const move of pointerMoves(name)) {
    const p = pointerAt(name, move.click);
    assert(p && p.press === !move.hover && Math.abs(p.x - move.x) < .001 && Math.abs(p.y - move.y) < .001, `${name}: cursor misses target`);
    assert.equal(pointerAt(name, (move.hide ?? move.click + 5) + 1)?.press ?? false, false);
    assert.equal(soundCues(name).filter(cue => cue.frame === move.click).length, move.hover ? 0 : 1, `${name}: click sound duplicated/missing`);
  }
  for (let f = 0; f < d.duration; f++) {
    const c = cameraAt(name, f);
    assert(Object.values(c).every(Number.isFinite) && c.zoom >= 1 && c.zoom <= 1.33, `${name}: invalid camera`);
    if (name === "revise" || f >= d.result) assert(c.zoom === 1 && c.x === 0 && c.y === 0, `${name}: annotation/result must stay normal size`);
  }
}
for (const d of Object.values(OFFICE)) assert.equal(typed(d.prompt, d.send - 20, 51, d.send - 20), d.prompt);
const drag = pointerAt("revise", REVISE.release);
assert.equal(drag.x, ANNOTATION_REGION.x + ANNOTATION_REGION.w);
assert.equal(drag.y, ANNOTATION_REGION.y + ANNOTATION_REGION.h);
assert.equal(drag.press, false);
assert(pointerAt("revise", REVISE.drag + 10).press);
assert(cameraAt("doc", 90).zoom > 1.3 && cameraAt("doc", 240).zoom === 1 && cameraAt("doc", 560).zoom === 1);
assert.equal(soundCues("revise").filter(c => c.frame === REVISE.send).length, 1);
// Evaluate only the pure film constants; no DOM, font loader or React runtime needed.
const filmText = readFileSync(new URL("../src/Film.tsx", import.meta.url), "utf8");
const film = ts.createSourceFile("Film.tsx", filmText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const music = film.statements.find(s => ts.isVariableStatement(s) && s.declarationList.declarations[0].name.getText(film) === "Music").getText(film);
assert.equal((music.match(/<Html5Audio\b/g) || []).length, 1, "Main music must have one continuous source");
assert(music.includes('staticFile("decisive-battle-original.mp3")'));
assert(!/trimBefore|startFrom|playbackRate|\bloop\b|<Sequence/.test(music), "Main music must not splice, loop or retime");
const simulation = readFileSync(new URL("../src/Simulation.tsx", import.meta.url), "utf8");
assert(INSTALL_HOME > DEMOS.install.result && INSTALL_HOME + 30 <= DEMOS.install.duration);
assert(pointerMoves("install").some(move => move.click === INSTALL_HOME - 4));
assert(simulation.includes('name === "install" && frame < INSTALL_HOME'));
assert(simulation.includes('saved={annotationFrame >= REVISE.addParagraph}'));
assert(simulation.includes('sim-selection-region ${frame >= REVISE.addRegion ? "saved" : ""}'));
assert(filmText.includes('src={REVISE.summary / FPS} speed={0} pointer={false}'));
assert(filmText.includes('durationInFrames={87}') && filmText.includes('staticFile("pet/helltaker.webm")'));
const people = JSON.parse(readFileSync(new URL("../public/credits/contributors.json", import.meta.url)));
const names = new Set(["MAIN_FRAMES", "CREDITS", "FILM_FRAMES", "OPENING_FRAMES", "B", "WIPE_LEN", "SECTIONS", "FPS", "srcTimes", "COMPARE", "ENDING", "SFX_CUES", "SFX_GAIN", "SFX_BOOST", "WIPES", "clamp", "musicVolume", "CREDIT_PEOPLE", "CREDIT_ANONYMOUS", "creditRippleMask"]);
const constants = film.statements.filter(s => ts.isVariableStatement(s) && names.has(s.declarationList.declarations[0].name.getText(film))).map(s => s.getText(film)).join("\n");
const { B, OPENING_FRAMES, WIPE_LEN, SECTIONS, FPS, srcTimes, COMPARE, ENDING, SFX_CUES, SFX_GAIN, SFX_BOOST, WIPES, musicVolume, MAIN_FRAMES, CREDITS, FILM_FRAMES, CREDIT_PEOPLE, CREDIT_ANONYMOUS, creditRippleMask } = await load(`import { interpolate } from ${JSON.stringify(import.meta.resolve("remotion"))}; const contributors = ${JSON.stringify(people)};` + source + "\n" + constants + "\nexport { B, OPENING_FRAMES, WIPE_LEN, SECTIONS, FPS, srcTimes, COMPARE, ENDING, SFX_CUES, SFX_GAIN, SFX_BOOST, WIPES, musicVolume, MAIN_FRAMES, CREDITS, CREDIT_PEOPLE, CREDIT_ANONYMOUS, creditRippleMask };");
for (const s of SECTIONS) {
  const starts = srcTimes(s).map(t => Math.round(t * FPS));
  assert.equal(s.steps[0].at - s.from, 30, `${s.id}: allow window and transition to settle`);
  assert.equal(s.steps[0].speed ?? 1, 1, `${s.id}: input must play at original speed`);
  assert((s.to - s.steps.at(-1).at) >= 120 && (s.to - s.steps.at(-1).at) <= 210, `${s.id}: result hold should be 4–7 seconds`);
  if (s.steps.length === 3) {
    assert.equal(starts[1], DEMOS[s.clip].send, `${s.id}: send cut discontinuous`);
    assert.equal(starts[2], DEMOS[s.clip].result, `${s.id}: result cut discontinuous`);
  }
  const last = s.steps.length - 1;
  assert(starts[last] + (s.to - s.steps[last].at) * (s.steps[last].speed ?? 1) <= DEMOS[s.clip].duration, `${s.id}: source exhausted`);
  assert(SFX_CUES.some(c => c.frame >= s.from && c.frame < s.to), `${s.id}: missing sounds`);
}
assert.equal(WIPE_LEN, 48);
assert.equal(OPENING_FRAMES, B.end);
assert.equal(SECTIONS[0].from, OPENING_FRAMES);
assert(B.montage[0] - 6 - B.install >= DEMOS.install.duration, "Installation must show the whole original-speed workflow");
for (const cue of soundCues("install")) assert(SFX_CUES.some(c => c.frame === B.install + cue.frame && c.sound === cue.sound), "Installation sounds must follow original-speed clicks");
assert.deepEqual(Object.values(OFFICE).map(d => d.label), ["文档", "PDF 文档", "演示文稿", "电子表格"]);
assert.deepEqual(Object.values(OFFICE).map(d => d.command), ["documents", "pdf", "presentations", "spreadsheets"]);
assert(Object.values(OFFICE).every(d => d.description.length > 0));
assert.equal(SECTIONS[4].to, COMPARE.from);
assert.equal(COMPARE.to, SECTIONS[5].from);
assert.equal(SECTIONS[6].to, ENDING.from);
assert.equal(MAIN_FRAMES, 4350);
assert.equal(CREDITS.from, MAIN_FRAMES);
assert.equal(CREDITS.page * 3, CREDITS.roles);
assert(CREDITS.roles < CREDITS.people && CREDITS.people < CREDITS.fade && CREDITS.fade < CREDITS.duration);
assert.equal(FILM_FRAMES, 5250);
const updates = JSON.parse(readFileSync(new URL("../public/credits/updates-v0.25.0.json", import.meta.url)));
assert.equal(people.contributors.length, 45);
assert.equal(people.anonymous.length, 5);
assert.equal(CREDIT_PEOPLE.length, 43);
assert.equal(CREDIT_ANONYMOUS.length, 4);
assert(CREDIT_PEOPLE.every(c => c.type !== "Bot" && c.login !== "web-flow" && !c.login.endsWith("[bot]")));
assert(CREDIT_ANONYMOUS.every(c => c.name !== "dsh-bot"));
const rippleStops = frame => [...creditRippleMask(frame).matchAll(/(-?[\d.]+)px/g)].map(m => Number(m[1]));
assert.deepEqual(rippleStops(0), [-1000, -500, 0]);
assert.deepEqual(rippleStops(120), [-750, -250, 250], "Ripple must expand outward slowly");
assert.equal(creditRippleMask(0), creditRippleMask(480), "16s ripple loop must be seamless");
assert.equal(creditRippleMask(150), creditRippleMask(630));
assert(Math.abs(1000 - rippleStops(479)[2] - 1000 / 480) < 1e-9, "Loop seam must advance by one normal frame");
assert.equal(updates.version, "v0.25.0");
assert.deepEqual(updates.groups.map(g => g.items.length), [4, 4, 4]);
assert(filmText.includes('title: "标注修改", sub: "段落吸附 · 区域框选 · 直接发送"'));
assert.deepEqual(WIPES.map(w => w.label), ["01 · 文档", "02 · PDF", "03 · 演示文稿", "04 · 电子表格", "05 · 标注修改", "06 · 新窗口", "07 · DSH Ops"]);
assert.equal(musicVolume(B.install), .4);
assert.equal(musicVolume(B.install + 18), .32);
assert.equal(musicVolume(ENDING.logo + 30), .4);
assert.equal(musicVolume(MAIN_FRAMES - 12), 0);
assert.equal(SFX_BOOST, 1.35);
assert(SFX_CUES.every(c => c.volume * SFX_GAIN[c.sound] * (c.frame >= B.install ? SFX_BOOST : 1) > 0 && c.volume * SFX_GAIN[c.sound] * SFX_BOOST < 100));
assert(SFX_CUES.every(c => c.frame >= 0 && c.frame + 30 < FILM_FRAMES && c.volume > 0 && c.volume <= 1));
assert.equal(SFX_CUES.filter(c => c.frame === SECTIONS[4].steps[1].at).length, 1, "staging send must occur once");
console.log(`8 timelines, original-speed install/input, 1.6s transitions, 4–7s results, Office labels, continuous cuts, ${SFX_CUES.length} synchronized sound cues and 30s credits (43 non-bot avatars + 4 anonymous; sparse outward 16s ripple loop) passed.`);
