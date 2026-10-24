// User approved rebuilding the missing video task space.
const task = await taskSpace("dsh-video-review-20261024-resumed");
console.log({ spaceId: task.spaceId, pages: await task.pages() });
