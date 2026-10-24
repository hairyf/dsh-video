const task = await taskSpace("dsh-video-window-review-20261024");
console.log({ spaceId: task.spaceId, pages: await task.pages() });
const page = task.page("p1");
console.log(await page.snapshot());
console.log(await page.evaluate(() => ({ url: location.href, original: Boolean(document.querySelector(".sim-original-window")), error: document.body.innerText.slice(-2200) })));
