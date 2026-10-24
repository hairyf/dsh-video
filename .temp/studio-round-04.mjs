const task = await taskSpace(9);
const page = task.page("p1");
console.log(await page.evaluate(() => ({setFrame: String(window.remotion_setFrame), url: location.href})));
