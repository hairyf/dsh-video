const task = await taskSpace(11);
const page = task.page('p1');
await page.goto('http://localhost:3210/Film');
await page.waitForFunction(() => typeof window.remotion_setFrame === 'function', undefined, {timeout:20000});
await page.evaluate(async () => {window.remotion_setFrame(3050, 'Film', 0);await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));});
await page.waitForSelector('.sim-detached-window');
console.log(await page.evaluate(() => [...document.querySelectorAll('.film-window')].map(w => ({style:w.getAttribute('style'),shells:[...w.querySelectorAll('.sim-shell')].map(e=>({text:e.textContent,ancestors:[e.parentElement,e.parentElement.parentElement,e.parentElement.parentElement.parentElement].map(p=>({tag:p.tagName,class:p.className?.baseVal??p.className,style:p.getAttribute('style')}))})),surfaces:[...w.querySelectorAll('.sim-surface')].map(e=>e.getAttribute('style'))}))));
console.log(await page.snapshot());
