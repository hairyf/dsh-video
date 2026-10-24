const task = await takeOverTaskSpace(11);
const page = task.page("p1");
console.log({ space: task.spaceId, pages: await task.pages(), current: await page.url() });
console.log(await page.snapshot());
