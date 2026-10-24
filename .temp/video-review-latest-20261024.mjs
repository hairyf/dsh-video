const task = await taskSpace(11);
const page = task.page("p1");
await page.reload();
await page.waitForFunction(() => typeof window.remotion_setFrame === "function" && !!document.querySelector(".film-window"));
await page.evaluate(() => window.remotion_setFrame(2534, "Film", 0));
await page.waitForFunction(() => Boolean(document.querySelector(".sim-annotation-summary")), undefined, {timeout: 15000});
console.log(await page.evaluate(() => ({summary: document.querySelector(".sim-annotation-summary").textContent, duration: document.querySelector("button[aria-label='Duration']")?.textContent, scale: document.querySelector(".film-window")?.style.scale})));
console.log(await page.screenshot({path: "E:/projects/dsh-video/out/video-review-latest.png"}));
