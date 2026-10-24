import assert from 'node:assert/strict';
const task = await taskSpace(11);
const page = task.page('p1');
const seek = async frame => {
  await page.evaluate(async frame => {window.remotion_setFrame(frame, 'Film', 0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}, frame);
  await page.waitForFunction(()=>!window.remotion_delayRenderHandles.length, undefined, {timeout:20000});
};
await seek(2593);
const target = await page.evaluate(()=>{
  const root=[...document.querySelectorAll('.sim-surface')].find(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true}));
  const button=root.querySelector('.sim-annotation-rail > b');
  const cursor=root.querySelector('.demo-pointer');
  const p=new DOMPoint(5,4).matrixTransform(cursor.getScreenCTM()),r=button.getBoundingClientRect();
  return {x:p.x,y:p.y,inside:p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom};
});
assert(target.inside, 'Staging-send cursor misses visible button');
for(const frame of [3001,3018,3050,3127]) {
  await seek(frame);
  const state=await page.evaluate(()=>{
    const w=[...document.querySelectorAll('.film-window')].find(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true}));
    const roots=[...w.querySelectorAll('.sim-surface')].filter(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true}));
    return {roots:roots.length,shells:[...w.querySelectorAll('.sim-shell')].filter(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true})).length,original:roots[0].querySelectorAll('.sim-original-window .sim-preview').length,detached:!!roots[0].querySelector('.sim-detached-window'),background:getComputedStyle(w).backgroundColor,border:getComputedStyle(w).borderWidth};
  });
  assert.equal(state.roots,1);
  assert.equal(state.shells,frame<3008?1:2);
  assert.equal(state.original,1);
  assert.equal(state.detached,frame>=3008);
  assert.equal(state.background,'rgba(0, 0, 0, 0)');
  assert.equal(state.border,'0px');
  console.log({frame,...state});
}
console.log({stagingSendTarget:target});
await seek(4320);
console.log(await page.snapshot());
