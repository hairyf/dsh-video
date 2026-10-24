const task = await taskSpace(12);
const page = task.page('p2');
await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(e=>e.getAttribute('aria-label')?.includes('访问模式')||e.textContent==='本地'),undefined,{timeout:15000}).catch(e=>console.log(e.message));
console.log(await page.snapshot());
console.log(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>/访问模式|权限|本地/.test(e.textContent+' '+e.getAttribute('aria-label'))).map(e=>({html:e.outerHTML,css: Object.fromEntries(['fontSize','fontWeight','lineHeight','color','gap','padding','height'].map(k=>[k,getComputedStyle(e)[k]]))}))));
console.log(await page.screenshot({path:'E:/projects/dsh-video/.temp/dropdown-alignment-20261024/native.png'}));
console.log(await page.evaluate(()=>[...document.scripts].map(s=>s.src)));
 console.log(await page.evaluate(()=>Object.keys(window.__ModuleLoader__||{})));
