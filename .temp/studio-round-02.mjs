const task = await taskSpace(9);
const pages = await task.pages();
console.log(pages);
const page = task.page("p1");
await page.goto("http://localhost:3210/Demo-doc");
console.log(await page.snapshot());
