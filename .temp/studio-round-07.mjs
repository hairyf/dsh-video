const task = await taskSpace(9);
const page = task.page("p1");
await page.evaluate(() => window.remotion_setFrame(100, "Demo-fullwindow", 0));
await page.waitForSelector(".sim-preview.full");
console.log(await page.evaluate(() => ({rail:!!document.querySelector('.sim-rail'), full:document.querySelector('.sim-preview.full').getBoundingClientRect().width, body:document.querySelector('.sim-body').getBoundingClientRect().width, text:document.querySelector('.sim-preview.full').textContent.slice(0,100)})));
