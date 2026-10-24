import assert from 'node:assert/strict';
const task = await taskSpace(12);
const page = task.page('p1');
await page.reload();
await page.waitForFunction(()=>typeof window.remotion_setFrame==='function'&&!!document.querySelector('.sim-composer-select'));
for (const frame of [0, 300, 600]) {
  await page.evaluate(frame=>window.remotion_setFrame(frame,'Demo-doc',0),frame);
  await page.waitForFunction(()=>!window.remotion_delayRenderHandles.length);
  const state=await page.evaluate(()=>{
    const composer=document.querySelector('.sim-composer');
    const selects=[...composer.querySelectorAll('.sim-composer-select')];
    const shown=selects.filter(e=>getComputedStyle(e).display!=='none');
    const cy=e=>{const r=e.getBoundingClientRect();return r.y+r.height/2;};
    const send=composer.querySelector('.sim-send').getBoundingClientRect();
    const model=composer.querySelector('.sim-model').getBoundingClientRect();
    return {labels:shown.map(e=>e.textContent),arrows:shown.map(e=>({tag:e.lastElementChild.tagName,centerError:Math.abs(cy(e)-cy(e.lastElementChild)),fontSize:getComputedStyle(e).fontSize,gap:getComputedStyle(e).gap})),textArrow:selects.some(e=>e.textContent.includes('⌄')),overflow:send.right-composer.getBoundingClientRect().right,overlap:model.right-send.left,preview:!!document.querySelector('.with-preview')};
  });
  assert(!state.textArrow);
  assert.deepEqual(state.labels,state.preview?['工作区内修改']:['工作区内修改','本地']);
  for (const arrow of state.arrows) {assert.equal(arrow.tag,'svg');assert(arrow.centerError<.1);assert.equal(arrow.fontSize,'13px');assert.equal(arrow.gap,'4px');}
  assert(state.overflow<=0,'Composer overflows');
  assert(state.overlap<=0,'Model overlaps send button');
  console.log({frame,...state});
}
await page.evaluate(()=>window.remotion_setFrame(0,'Demo-doc',0));
console.log(await page.screenshot({path:'E:/projects/dsh-video/.temp/dropdown-alignment-20261024/after.png'}));
console.log(await task.page('p2').evaluate(()=>({menus:document.querySelectorAll('[role="menu"]').length,permission:document.querySelector('button[aria-label^="访问模式"]')?.textContent})));
