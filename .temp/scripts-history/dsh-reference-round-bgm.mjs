const task = await taskSpace(4);
const page = task.page('p1');
await page.goto('https://www.bilibili.com/video/BV1R1421v739');
await page.waitForFunction(() => !!window.__playinfo__?.data?.dash, undefined, {timeout: 15000});
const data = await page.evaluate(() => {
  const dash = window.__playinfo__.data.dash;
  const video = dash.video.find(v => v.id === 64 && v.codecid === 7) ?? dash.video.find(v => v.codecid === 7);
  if (!video) throw new Error('No available AVC reference stream');
  return {title: document.title, duration: dash.duration, width: video.width, height: video.height, url: video.baseUrl};
});
const result = await page.fetch(data.url, {saveAs: 'C:/Users/wwu71/AppData/Local/Temp/dsh-bgm-reference.mp4'});
console.log({title: data.title, duration: data.duration, width: data.width, height: data.height, status: result.status});
