const task = await taskSpace('DSH video v6 review 20261024-1302');
const page = task.page('p1');
await page.goto('http://localhost:3210/Film');
await page.waitForFunction(()=>typeof window.remotion_setFrame==='function',undefined,{timeout:20000});
console.log({spaceId:task.spaceId,page:page.label});
console.log(await page.snapshot());
