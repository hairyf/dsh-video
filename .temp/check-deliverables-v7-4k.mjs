import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, readFileSync, statSync } from "node:fs";
const version = process.argv[2] || "v7";
assert(["v7", "v8", "v9", "v10", "v11"].includes(version), "Expected v7, v8, v9, v10 or v11");
const archive = `out/dsh-simulated-originals-${version === "v11" ? "v11" : ["v9", "v10"].includes(version) ? "v9" : "v6"}.zip`, tar = "C:/Windows/System32/tar.exe";
const expected = ["README.md", "install.mp4", "doc.mp4", "pdf.mp4", "ppt.mp4", "xlsx.mp4", "revise.mp4", "fullwindow.mp4", "ops.mp4"];
const entries = execFileSync(tar, ["-tf", archive], { encoding: "utf8" }).trim().split(/\r?\n/);
assert.deepEqual([...entries].sort(), [...expected].sort(), "Unexpected archive contents");
for (const name of expected) {
  const extracted = execFileSync(tar, ["-xOf", archive, name], { maxBuffer: 16 * 1024 * 1024 });
  assert.deepEqual(extracted, readFileSync(`out/simulated-originals/${name}`), `Archive bytes differ: ${name}`);
}
const report = JSON.parse(readFileSync(`out/simulation-verification-${version}-4k.json`, "utf8"));
assert.equal(report.files.length, 9); assert.equal(report.files[0].frames, 5250); assert.equal(report.files[0].width, 3840); assert.equal(report.files[0].height, 2160); assert.equal(report.finalBlackFrame, true);
assert(report.audio.original.continuity.every(row => row.correlation > .98 && row.gain > .3 && row.gain < .6));
console.log("4K report passed; raw archive contains exactly README + 8 videos and matches local originals byte for byte.");
for (const path of [`out/film-simulated-${version}-4k.mp4`, archive]) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  console.log(JSON.stringify({ path, bytes: statSync(path).size, sha256: hash.digest("hex") }));
}
