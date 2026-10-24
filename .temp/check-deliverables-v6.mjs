import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
const archive = "out/dsh-simulated-originals-v6.zip", tar = "C:/Windows/System32/tar.exe";
const expected = ["README.md", "install.mp4", "doc.mp4", "pdf.mp4", "ppt.mp4", "xlsx.mp4", "revise.mp4", "fullwindow.mp4", "ops.mp4"];
const entries = execFileSync(tar, ["-tf", archive], { encoding: "utf8" }).trim().split(/\r?\n/);
assert.deepEqual([...entries].sort(), [...expected].sort(), "Unexpected archive contents");
for (const name of expected) {
  const extracted = execFileSync(tar, ["-xOf", archive, name], { maxBuffer: 16 * 1024 * 1024 });
  assert.deepEqual(extracted, readFileSync(`out/simulated-originals/${name}`), `Archive bytes differ: ${name}`);
}
const report = JSON.parse(readFileSync("out/simulation-verification-v6.json", "utf8"));
assert.equal(report.files.length, 9); assert.equal(report.files[0].frames, 5250); assert.equal(report.finalBlackFrame, true);
assert(report.audio.original.continuity.every(row => row.correlation > .98 && row.gain > .3 && row.gain < .6));
console.log("Archive: exactly README + 8 raw videos, all bytes match local originals; media report parsed and passed.");
for (const path of ["out/film-simulated-v6.mp4", archive]) console.log(JSON.stringify({ path, bytes: statSync(path).size, sha256: createHash("sha256").update(readFileSync(path)).digest("hex") }));
