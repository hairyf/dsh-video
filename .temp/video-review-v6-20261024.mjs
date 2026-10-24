import assert from 'node:assert/strict';
const task = await taskSpace(11);
const page = task.page('p1');
await page.goto('http://localhost:3210/Film');
await page.waitForFunction(()=>typeof window.remotion_setFrame==='function', undefined, {timeout:20000});
const seek = async frame => {
  await page.evaluate(async frame => {window.remotion_setFrame(frame,'Film',0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},frame);
  await page.waitForFunction(()=>!window.remotion_delayRenderHandles.length,undefined,{timeout:20000});
};
for (const frame of [975,1050,1200,1620,1886,2140,2410,2612,2678,2814,2842,2984,3043,3060,3150,3620,3890]) {
  await seek(frame);
  const state=await page.evaluate(()=>{
    const visible=e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true});
    const w=[...document.querySelectorAll('.film-window')].find(visible);
    const c=[...document.querySelectorAll('.film-section-caption')].find(visible);
    if(!w||!c) return {missing:true};
    const wr=w.getBoundingClientRect(),cr=c.getBoundingClientRect();
    return {outerScale:getComputedStyle(w).scale,innerScale:getComputedStyle(w.querySelector('.film-window-camera')).scale,overflow:getComputedStyle(w).overflow,left:wr.left,captionRight:cr.right,captionOpacity:getComputedStyle(c).opacity};
  });
  assert(!state.missing,`Missing feature at ${frame}`);
  assert.equal(state.outerScale,'1');
  assert.equal(state.overflow,'hidden');
  assert(state.left>state.captionRight,`Window obscures caption at ${frame}`);
  assert.equal(state.captionOpacity,'1');
  assert.equal(Number(state.innerScale),frame===975?1.32:1,`Result/annotation zoomed at ${frame}`);
  console.log({frame,...state});
}
for (const frame of [3577,3596,3620,3757]) {
  await seek(frame);
  const state=await page.evaluate(()=>{
    const root=[...document.querySelectorAll('.sim-surface')].find(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true}));
    const main=root.querySelector('.sim-original-window .sim-main'),chat=main.querySelector('.sim-chat');
    return {originalPreviews:root.querySelectorAll('.sim-original-window .sim-preview').length,detached:!!root.querySelector('.sim-detached-window'),chatWidth:chat.getBoundingClientRect().width,mainWidth:main.getBoundingClientRect().width,shells:[...root.querySelectorAll('.sim-shell')].filter(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true})).length};
  });
  assert.equal(state.originalPreviews,frame<3578?1:0);
  assert.equal(state.detached,frame>=3578);
  assert.equal(state.shells,frame<3578?1:2);
  if(frame>=3578) assert(Math.abs(state.chatWidth-state.mainWidth)<1,'Old chat does not fill window');
  console.log({frame,...state});
}
await seek(3043);
assert(await page.evaluate(()=>{
  const root=[...document.querySelectorAll('.sim-surface')].find(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true}));
  const r=root.querySelector('.sim-annotation-rail > b').getBoundingClientRect(),svg=root.querySelector('.demo-pointer');
  const p=new DOMPoint(5,4).matrixTransform(svg.getScreenCTM());
  return p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;
}),'Staging send cursor misses button');
const masks=[];
for(const frame of [4380,4530,4680,4830,5010]) {
  await seek(frame);
  const state=await page.evaluate(()=>({mask:getComputedStyle(document.querySelector('.credit-dot-ripples')).maskImage,updates:document.querySelectorAll('.credit-update').length,avatars:[...document.querySelectorAll('.credit-person img')].filter(i=>i.complete&&i.naturalWidth>0).length}));
  assert(state.mask.includes('repeating-radial-gradient'));
  if(frame<4800) assert.equal(state.updates,4);
  if(frame===5010) assert.equal(state.avatars,45);
  masks.push(state.mask);console.log({frame,...state});
}
assert.notEqual(masks[0],masks[1],'Dot ripple is not frame-driven');
console.log('v6: bounded input focus, normal-size results/annotations, collapsed old preview, two windows, 45 avatars and animated dot ripple passed.');
console.log(await page.snapshot());
