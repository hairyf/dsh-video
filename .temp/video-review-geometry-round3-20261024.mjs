import assert from 'node:assert/strict';
const task = await taskSpace(11);
const page = task.page('p1');
const seek = async (id, frame) => {
  await page.evaluate(async ({id, frame}) => {
    window.remotion_setFrame(frame, id, 0);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, {id, frame});
  await page.waitForFunction(() => !window.remotion_delayRenderHandles.length, undefined, {timeout: 20000});
};
await page.goto('http://localhost:3210/Demo-revise');
await page.waitForFunction(() => typeof window.remotion_setFrame === 'function' && !!document.querySelector('.sim-body'), undefined, {timeout: 20000});
for (const frame of [54, 94, 120, 170, 207, 208, 256, 284, 306, 401, 426, 485, 486, 500, 660, 700]) {
  await seek('Demo-revise', frame);
  const state = await page.evaluate(frame => {
    const root = document.querySelector('.sim-body');
    const base = root.getBoundingClientRect(), scale = base.width / 1400;
    const rect = e => {const r = e.getBoundingClientRect(); return {text:e.textContent.slice(0,100), x:+((r.x-base.x)/scale).toFixed(1), y:+((r.y-base.y)/scale).toFixed(1), w:+(r.width/scale).toFixed(1), h:+(r.height/scale).toFixed(1)};};
    return {frame, highlight:[...root.querySelectorAll('.sim-paragraph-highlight')].map(rect), region:[...root.querySelectorAll('.sim-selection-region')].map(rect), pill:[...root.querySelectorAll('.sim-annotation, .sim-annotation > b')].map(rect), rail:[...root.querySelectorAll('.sim-annotation-rail, .sim-annotation-rail > *')].map(rect), file:[...root.querySelectorAll('.sim-file-card')].map(rect), notes:root.querySelectorAll('.sim-annotation-message p').length, composer:root.querySelector('.sim-input').textContent, restyled:!!root.querySelector('.restyled')};
  }, frame);
  assert.equal(state.notes, frame >= 486 ? 2 : 0);
  assert.equal(state.restyled, frame >= 672);
  assert(state.composer.includes('描述你想要构建'));
  console.log(JSON.stringify(state));
}
await page.goto('http://localhost:3210/Film');
await page.waitForFunction(() => typeof window.remotion_setFrame === 'function', undefined, {timeout: 20000});
for (const frame of [975, 1050, 1200, 2162, 2392, 2534, 2593, 2610, 2700, 3050]) {
  await seek('Film', frame);
  await page.waitForSelector('.film-window', {state:'attached', timeout:20000});
  console.log(await page.evaluate(frame => {
    const w = document.querySelector('.film-window');
    return {frame, scale:w.style.scale, translate:w.style.translate, navs:w.querySelectorAll('.sim-shell').length, pointer:!!w.querySelector('.demo-pointer'), detached:!!w.querySelector('.sim-detached-window')};
  }, frame));
}
for (const frame of [3690, 3840, 3990, 4140, 4320, 4500]) {
  await seek('Film', frame);
  await page.waitForSelector('.film-credits', {state:'attached', timeout:20000});
  const state = await page.evaluate(frame => {
    const root = document.querySelector('.film-credits'), base=root.getBoundingClientRect(), scale=base.width/1920;
    const rect=e=>{const r=e.getBoundingClientRect();return{x:+((r.x-base.x)/scale).toFixed(1),y:+((r.y-base.y)/scale).toFixed(1),w:+(r.width/scale).toFixed(1),h:+(r.height/scale).toFixed(1)}};
    const people=[...root.querySelectorAll('.credit-person')];
    return {frame,text:root.textContent,updates:[...root.querySelectorAll('.credit-update')].map(e=>({text:e.textContent,...rect(e)})),avatars:people.length,unloaded:people.filter(e=>{const i=e.querySelector('img');return !i.complete||!i.naturalWidth}).length,grid:root.querySelector('.credit-avatars')?rect(root.querySelector('.credit-avatars')):null,overflowNames:people.filter(e=>{const n=e.querySelector('div');return n.scrollWidth>n.clientWidth}).map(e=>e.textContent),media:[...root.querySelectorAll('video,img')].filter(e=>!e.closest('.credit-person')).map(e=>({tag:e.tagName,...rect(e)}))};
  },frame);
  assert.equal(state.avatars, frame>=4290?45:0);
  assert.equal(state.unloaded,0);
  assert.equal(state.overflowNames.length,0);
  if(state.grid) assert(state.grid.y+state.grid.h<946);
  for(const u of state.updates) assert(u.x+u.w<1405&&u.y+u.h<950);
  console.log(JSON.stringify(state));
}
console.log(await page.snapshot());
