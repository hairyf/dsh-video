const task = await taskSpace(9);
const page = task.page("p1");
await page.goto("http://localhost:3210/Demo-doc");
await page.waitForSelector(".sim-body");
console.log(await page.snapshot());
console.log(await page.evaluate(() => ({helpers: Object.keys(window).filter(k => /remotion|frame/i.test(k)), font: getComputedStyle(document.querySelector(".sim-body")).fontFamily, rects: [...document.querySelectorAll(".sim-composer,.sim-send")].map(e => ({class: e.className, rect: e.getBoundingClientRect().toJSON()}))})));
