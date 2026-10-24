const task = await taskSpace(11);
const page = task.page("p1");
await page.goto("http://localhost:3210/Demo-revise");
await page.waitForFunction(() => typeof window.remotion_setFrame === "function" && !!document.querySelector(".sim-body"));
for (const frame of [54, 94, 120, 170, 208, 256, 284, 306, 426, 485, 500, 660, 700]) {
  await page.evaluate(frame => window.remotion_setFrame(frame, "Demo-revise", 0), frame);
  await page.waitForFunction(() => !window.remotion_delayRenderHandles.length);
  console.log(await page.evaluate(frame => {
    const root = document.querySelector(".sim-body");
    const base = root.getBoundingClientRect();
    const scale = base.width / 1400;
    const rect = e => { const r = e.getBoundingClientRect(); return { c: e.className.baseVal ?? e.className, text: e.textContent.slice(0, 90), x: +((r.x-base.x)/scale).toFixed(1), y: +((r.y-base.y)/scale).toFixed(1), w: +(r.width/scale).toFixed(1), h: +(r.height/scale).toFixed(1) }; };
    return { frame, elements: [...root.querySelectorAll(".sim-paragraph-highlight, .sim-selection-region, .sim-annotation, .sim-annotation > b, .sim-annotation-rail, .sim-annotation-rail > *, .sim-annotation-message, .sim-file-card")].map(rect), composer: root.querySelector(".sim-input")?.textContent, restyled: Boolean(root.querySelector(".restyled")) };
  }, frame));
}
await page.goto("http://localhost:3210/Film");
await page.waitForFunction(() => typeof window.remotion_setFrame === "function");
for (const frame of [975, 1050, 1200, 2162, 2392, 2534, 2593, 2610, 2700, 3050]) {
  await page.evaluate(frame => window.remotion_setFrame(frame, "Film", 0), frame);
  await page.waitForFunction(() => !window.remotion_delayRenderHandles.length);
  console.log(await page.evaluate(frame => {
    const w = document.querySelector(".film-window");
    return { frame, scale: w?.style.scale, translate: w?.style.translate, content: w?.textContent.slice(-160), navs: w?.querySelectorAll(".sim-shell").length };
  }, frame));
}
console.log(await page.screenshot({ path: "E:/projects/dsh-video/out/video-review-current.png" }));
