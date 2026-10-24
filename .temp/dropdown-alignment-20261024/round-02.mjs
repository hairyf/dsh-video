const task = await taskSpace(12);
const page = task.page('p1');
await page.evaluate(()=>window.remotion_setFrame(0,'Demo-doc',0));
const native = task.page('p2');
await native.click('loc=role:button[name="选择工作区"]');
console.log(await native.snapshot());
console.log({simulation: await page.screenshot({path:'E:/projects/dsh-video/.temp/dropdown-alignment-20261024/before.png'})});
console.log(await native.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.textContent.includes('标准模式')).map(e=>e.outerHTML)));
