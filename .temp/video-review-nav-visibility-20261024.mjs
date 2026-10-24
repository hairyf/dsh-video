const task = await taskSpace(11);
const page = task.page('p1');
console.log(await page.evaluate(() => [...document.querySelectorAll('.film-window .sim-surface')].map(e => {
 const ancestors=[];
 for(let p=e;p&&ancestors.length<12;p=p.parentElement){const s=getComputedStyle(p),r=p.getBoundingClientRect();ancestors.push({tag:p.tagName,class:p.getAttribute('class'),display:s.display,visibility:s.visibility,opacity:s.opacity,rect:{x:r.x,y:r.y,w:r.width,h:r.height},style:p.getAttribute('style')});}
 return {visible:e.checkVisibility({opacityProperty:true,visibilityProperty:true}),ancestors};
})));
console.log(await page.snapshot());
