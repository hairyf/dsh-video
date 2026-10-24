import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source = await readFile('E:/projects/dsh-video/src/demo-timeline.ts', 'utf8');
const coordinates = source.match(/y: \{ doc: (\d+), pdf: (\d+), ppt: (\d+), xlsx: (\d+) \}\[name\]/);
assert(coordinates, 'Office menu pointer coordinates missing');
const task = await taskSpace('office-menu-height-20261024-1710');
console.log({spaceId: task.spaceId});
const page = task.page('p1');
for (const [index, name] of ['doc', 'pdf', 'ppt', 'xlsx'].entries()) {
  await page.goto(`http://localhost:3210/Demo-${name}`);
  await page.waitForFunction(() => typeof window.remotion_setFrame === 'function' && !!document.querySelector('.sim-body'));
  await page.evaluate(name => window.remotion_setFrame(42, `Demo-${name}`, 0), name);
  await page.waitForSelector('.sim-skill-menu');
  const state = await page.evaluate(() => {
    const menu = document.querySelector('.sim-skill-menu');
    const body = document.querySelector('.sim-body').getBoundingClientRect();
    const scale = body.height / 856;
    return {padding: getComputedStyle(menu).padding, titleHeight: menu.firstElementChild.getBoundingClientRect().height / scale, rows: [...menu.querySelectorAll(':scope > div')].map(e => {const r = e.getBoundingClientRect(); return {height: r.height / scale, y: (r.y + r.height / 2 - body.y) / scale, left: (r.left - body.left) / scale, right: (r.right - body.left) / scale, selected: e.classList.contains('selected')};})};
  });
  assert.equal(state.padding, '4px');
  assert(Math.abs(state.titleHeight - 23) < .1);
  assert.equal(state.rows.length, 4);
  for (const row of state.rows) assert(Math.abs(row.height - 34) < .1, `${name}: incorrect row height`);
  const selected = state.rows[index];
  assert(selected.selected);
  assert(Math.abs(selected.y - Number(coordinates[index + 1])) < .1, `${name}: pointer misses row center`);
  assert(460 >= selected.left && 460 <= selected.right);
  console.log({name, ...state});
}
console.log(await page.screenshot({path: 'E:/projects/dsh-video/.temp/dropdown-alignment-20261024/office-menu-after.png'}));
await task.finish({keep: []});
