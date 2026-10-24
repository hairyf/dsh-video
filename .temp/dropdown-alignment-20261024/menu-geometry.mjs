const task = await taskSpace(15);
const page = task.page('p1');
console.log(await page.evaluate(() => {
  const menu = document.querySelector('.sim-skill-menu');
  const body = document.querySelector('.sim-body').getBoundingClientRect();
  const scale = body.height / 856;
  const rect = e => {const r=e.getBoundingClientRect();return {y:(r.y-body.y)/scale,height:r.height/scale,center:(r.y+r.height/2-body.y)/scale,css:getComputedStyle(e).cssText};};
  return {menu:rect(menu),home:rect(document.querySelector('.sim-home')),title:rect(menu.firstElementChild),rows:[...menu.querySelectorAll(':scope > div')].map(rect)};
}));
