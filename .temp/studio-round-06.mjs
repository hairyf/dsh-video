const task = await taskSpace(9);
const page = task.page("p1");
console.log({url:await page.url()});
await page.waitForSelector(".sim-body");
console.log(await page.evaluate(() => ({text:document.querySelector('.sim-body').textContent.slice(0,100), frames:Object.keys(window).filter(k => k.includes('setFrame'))})));
