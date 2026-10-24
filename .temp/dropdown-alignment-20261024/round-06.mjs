import assert from 'node:assert/strict';
const task = await taskSpace(12);
const page = task.page('p1');
for (const [name,frames] of [['doc',[0,300,600]],['ops',[0,200]]]) {
  await page.goto(`http://localhost:3210/Demo-${name}`);
  await page.waitForFunction(()=>typeof window.remotion_setFrame==='function'&&!!document.querySelector('.sim-composer'));
  for (const frame of frames) {
    await page.evaluate(({frame,name})=>window.remotion_setFrame(frame,`Demo-${name}`,0),{frame,name});
    await page.waitForFunction(()=>!window.remotion_delayRenderHandles.length);
    const state=await page.evaluate(()=>{
      const composer=document.querySelector('.sim-composer');
      const cy=e=>{const r=e.getBoundingClientRect();return r.y+r.height/2;};
      const visible=e=>e.getBoundingClientRect().height>0;
      const controls=[...document.querySelectorAll('.sim-composer-select,.sim-model > .sim-muted,.sim-workspace > span')].filter(visible);
      const model=composer.querySelector('.sim-model').getBoundingClientRect();
      const send=composer.querySelector('.sim-send').getBoundingClientRect();
      return {controls:controls.map(e=>({label:e.textContent,svg:e.lastElementChild?.tagName,error:Math.abs(cy(e)-cy(e.lastElementChild))})),textArrow:document.querySelector('.sim-body').textContent.includes('⌄'),overflow:send.right-composer.getBoundingClientRect().right,overlap:model.right-send.left};
    });
    assert(!state.textArrow);
    for (const control of state.controls) {assert.equal(control.svg,'svg');assert(control.error<.1,`${control.label} arrow off center`);}
    assert(state.overflow<=0,'Composer overflows');
    assert(state.overlap<=0,'Model overlaps send button');
    console.log({name,frame,...state});
  }
}
await page.goto('http://localhost:3210/Demo-doc');
await page.waitForFunction(()=>typeof window.remotion_setFrame==='function'&&!!document.querySelector('.sim-composer'));
await page.evaluate(()=>window.remotion_setFrame(0,'Demo-doc',0));
await page.waitForFunction(()=>!!document.querySelector('.sim-home'));
console.log(await page.screenshot({path:'E:/projects/dsh-video/.temp/dropdown-alignment-20261024/after-all.png'}));
