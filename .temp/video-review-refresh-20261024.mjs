const task = await taskSpace(11);
const page = task.page("p1");
console.log({url: await page.url(), scripts: await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean))});
await page.cdp("Network.setCacheDisabled", {cacheDisabled: true});
await page.reload();
await page.waitForFunction(() => typeof window.remotion_setFrame === "function");
await page.evaluate(() => window.remotion_setFrame(2392, "Film", 0));
console.log(await page.snapshot());
