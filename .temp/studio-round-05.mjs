const task = await taskSpace(9);
const page = task.page("p1");
for (const [name, frames] of [["install", [25, 55, 85]], ["doc", [25, 120, 480, 515]], ["revise", [10, 65, 110, 295]], ["ppt", [455]], ["fullwindow", [50, 100]]]) {
  await page.goto(`http://localhost:3210/Demo-${name}`);
  await page.waitForSelector(".sim-body");
  for (const frame of frames) {
    await page.evaluate(({name, frame}) => window.remotion_setFrame(frame, `Demo-${name}`, 0), {name, frame});
    await page.waitForFunction(({name, frame}) => !window.remotion_delayRenderHandles.length && document.querySelector(".sim-body"), {name, frame});
    console.log(name, frame, await page.evaluate(() => {
      const base = document.querySelector(".sim-body").getBoundingClientRect();
      const scale = base.width / 1400;
      const sels = [".sim-preset:nth-child(4) .sim-toggle", ".sim-preset:nth-child(5) .sim-toggle", ".sim-install-buttons b", ".sim-input", ".sim-skill-menu .selected", ".sim-send", ".sim-file-card", ".sim-preview-actions svg", ".sim-doc-channel", ".sim-annotation strong", ".sim-slide-next"];
      return sels.flatMap(s => [...document.querySelectorAll(s)].map(e => {
        const r = e.getBoundingClientRect();
        return {selector:s, text:e.textContent, x:Math.round((r.x + r.width / 2-base.x)/scale), y:Math.round((r.y + r.height / 2-base.y)/scale), w:Math.round(r.width/scale), h:Math.round(r.height/scale)};
      }));
    }));
  }
}
