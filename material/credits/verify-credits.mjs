import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const manifest=JSON.parse(fs.readFileSync(new URL('../../public/credits/contributors.json',import.meta.url),'utf8'));
const updates=JSON.parse(fs.readFileSync(new URL('../../public/credits/updates-v0.25.0.json',import.meta.url),'utf8'));
assert.equal(manifest.contributors.length,45);
assert.equal(new Set(manifest.contributors.map(c=>c.id)).size,45);
assert.equal(manifest.contributors.filter(c=>c.type==='Bot').length,1);
assert.equal(manifest.anonymous.length,5);
assert.equal(updates.groups.length,3);
assert.equal(updates.groups.flatMap(g=>g.items).length,12);
for(const group of updates.groups) for(const item of group.items) assert(item.sources.length>0);
let bytes=0;
for(const c of manifest.contributors){
  assert.match(c.local_file,/^credits\/avatars\/\d+\.(jpg|png)$/);
  const file=new URL('../../public/'+c.local_file,import.meta.url);
  const data=fs.readFileSync(file);
  assert(data.length>0);
  assert.equal(data.length,c.bytes);
  assert.equal(createHash('sha256').update(data).digest('hex'),c.sha256);
  const png=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpeg=data[0]===255&&data[1]===216&&data[2]===255;
  assert(c.media_type==='image/png'?png:jpeg);
  assert(c.width>0&&c.height>0);
  if(process.argv.includes('--decode')){
    const result=spawnSync('ffmpeg',['-v','error','-xerror','-i',file.pathname.replace(/^\/(\w:)/,'$1'),'-frames:v','1','-f','null','-'],{stdio:'inherit'});
    assert.equal(result.status,0,c.login);
  }
  bytes+=data.length;
}
assert.equal(bytes,manifest.avatar_validation.total_bytes);
console.log(`PASS: 45 unique public avatars, 1 API Bot, 5 anonymous records, 3 groups / 12 sourced updates; ${bytes} bytes${process.argv.includes('--decode')?'; all images fully decoded':''}.`);
