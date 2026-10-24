const task = await taskSpace(12);
const page = task.page('p2');
await page.click('loc=css:button[aria-label^="访问模式"]');
console.log(await page.snapshot());
console.log(await page.evaluate(()=>[...document.querySelectorAll('[role="menuitem"],[role="menuitemradio"]')].filter(e=>e.textContent.includes('工作区内修改')).map(e=>e.outerHTML)));
await page.keyboard.press('Escape');
console.log(await page.evaluate(()=>{const b=document.querySelector('button[aria-label="工作模式"]'); return {parent:b.parentElement.outerHTML,caption:getComputedStyle(b.querySelector('span:last-child')).color};}));
console.log(await page.evaluate(()=>Object.keys(window.__ModuleLoader__.create('@deepseek-ai/dsh-client-ui-primitives')).filter(k=>/PermissionIconWorkspace/.test(k))));
