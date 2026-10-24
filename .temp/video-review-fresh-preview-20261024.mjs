const task = await taskSpace(11);
const page = task.page("p1");
await page.goto("http://localhost:3210/Demo-revise");
await page.waitForFunction(() => typeof window.remotion_setFrame === "function" && !!document.querySelector('.sim-body'), undefined, {timeout: 20000});
await page.evaluate(() => window.remotion_setFrame(170, "Demo-revise", 0));
await page.waitForFunction(() => !!document.querySelector('.sim-annotation-rail'), undefined, {timeout: 10000});
console.log(await page.snapshot());
