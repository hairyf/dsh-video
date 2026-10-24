const task = await taskSpace(11);
const page = task.page("p1");
await page.goto("http://localhost:3210/Demo-revise");
await page.waitForSelector(".sim-body");
await page.evaluate(() => window.remotion_setFrame(170, "Demo-revise", 0));
await page.waitForFunction(() => !window.remotion_delayRenderHandles.length);
console.log(await page.evaluate(() => ({ text: document.querySelector(".sim-main").textContent, annotation: Boolean(document.querySelector(".sim-annotation-rail")), rects: [...document.querySelectorAll(".sim-document p, .sim-doc-channel, .sim-annotation, .sim-annotation-rail > *")].map(e => { const r = e.getBoundingClientRect(); return { c: e.className, text: e.textContent, x: r.x, y: r.y, w: r.width, h: r.height }; }) })));
console.log(await page.screenshot({ path: "E:/projects/dsh-video/out/revise-studio-review.png" }));
