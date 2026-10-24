const task = await taskSpace(12);
const native = task.page('p2');
await native.click('loc=role:menuitem[name="dsh-video"]');
console.log(await native.snapshot());
console.log(await native.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>/访问模式|本地|标准模式/.test(e.textContent+' '+e.getAttribute('aria-label'))).map(e=>({html:e.outerHTML,css: Object.fromEntries(['fontSize','fontWeight','lineHeight','color','gap','padding','height'].map(k=>[k,getComputedStyle(e)[k]]))}))));
