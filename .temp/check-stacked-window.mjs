import assert from "node:assert/strict";
const task = await taskSpace("dsh-video-window-review-20261024");
const page = task.page("p1");
await page.goto("http://localhost:3210/Demo-fullwindow");
await page.waitForSelector(".sim-original-window");
for (const frame of [65, 81, 110, 190]) {
  await page.evaluate(frame => window.remotion_setFrame(frame, "Demo-fullwindow", 0), frame);
  await page.waitForFunction(frame => {
    const original = document.querySelector(".sim-original-window");
    const detached = document.querySelector(".sim-detached-window");
    return original && !window.remotion_delayRenderHandles.length && (frame < 72 ? !detached : detached && Math.abs(Number(detached.style.opacity) - 1) < .001);
  }, frame);
  const result = await page.evaluate(() => {
    const root = document.querySelector(".sim-surface");
    const original = root.querySelector(".sim-original-window");
    const front = root.querySelector(".sim-detached-window");
    const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom }; };
    return { root: rect(root), original: rect(original), front: front && rect(front), shells: root.querySelectorAll(".sim-shell").length, originalPreviews: original.querySelectorAll(".sim-preview").length, chat: Boolean(original.querySelector(".sim-chat .sim-file-card")), expanded: Boolean(front?.querySelector(".sim-preview.full")), rootBackground: getComputedStyle(root).backgroundColor };
  });
  assert(result.chat && result.originalPreviews === 1, `frame ${frame}: original chat/preview removed`);
  assert.equal(result.shells, frame < 72 ? 1 : 2, `frame ${frame}: title bars missing`);
  assert.equal(result.rootBackground, "rgba(0, 0, 0, 0)", "Opaque backing behind stacked windows");
  if (result.front) {
    assert(result.expanded, "Document does not fill detached preview");
    assert(result.front.x > result.original.x && result.front.y > result.original.y, "Original window is hidden by replacement");
    assert(result.front.x < result.original.right && result.front.y < result.original.bottom, "Windows do not overlap");
    assert(result.front.right <= result.root.right + 2 && result.front.bottom <= result.root.bottom + 2, "Detached window is clipped");
  }
  console.log(`Demo-fullwindow ${frame}: original retained, ${result.shells} title bar(s), overlap/bounds passed`);
}
await page.goto("http://localhost:3210/Film");
await page.waitForSelector(".sim-body");
await page.evaluate(() => window.remotion_setFrame(2690, "Film", 0));
await page.waitForSelector(".sim-detached-window");
const backing = await page.evaluate(() => {
  const svg = document.querySelector(".sim-window-stack").closest("svg");
  const outer = svg.parentElement.parentElement;
  return { background: getComputedStyle(outer).backgroundColor, border: getComputedStyle(outer).borderWidth, title: document.body.textContent.includes("新窗叠加预览") };
});
assert.equal(backing.background, "rgba(0, 0, 0, 0)", "Film still has an opaque backing");
assert.equal(backing.border, "0px", "Film still frames both windows as one app");
assert(backing.title, "Film caption does not describe the stacked preview");
console.log("Film 2690: two independent windows, transparent outer frame, caption passed");
console.log(await page.screenshot({ path: "E:/projects/dsh-video/out/stacked-window-studio.png" }));
await task.finish({ keep: [] });
