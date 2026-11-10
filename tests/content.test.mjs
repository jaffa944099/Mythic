import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {avatars,allAvatars,collection} from '../src/data.js';
import {art} from '../src/art.js';
test('both supported sequences contain ten distinct profiles and the intended alternate ordering',()=>{
 for(const type of ['buddha','balarama']){const list=collection(type);assert.equal(list.length,10);assert.equal(new Set(list.map(a=>a.id)).size,10);assert.equal(list[0].id,'matsya');assert.equal(list[9].id,'kalki');}
 assert.deepEqual(collection('balarama').slice(7).map(a=>a.id),['balarama','krishna','kalki']);
 assert.deepEqual(collection().slice(7).map(a=>a.id),['krishna','buddha','kalki']);
 assert.equal(avatars.length,10);
});
test('every linkable character has complete educational content and a distinct emblem',()=>{
 assert.equal(new Set(allAvatars.map(a=>a.id)).size,11);
 for(const a of allAvatars){assert.match(a.id,/^[a-z]+$/);for(const key of ['name','sanskrit','form','title','theme','summary','setting','quality','companions','text','character','meaning','question'])assert.ok(a[key]?.length>2,`${a.id}: ${key}`);assert.equal(a.story.length,3);assert.ok(a.story.every(p=>p.length>50));assert.equal(a.symbols.length,3);assert.match(art(a),/^<svg/);assert.doesNotMatch(art(a),/undefined/);assert.ok(['Protection','Courage','Wisdom','Renewal'].includes(a.theme));}
 assert.equal(new Set(allAvatars.map(a=>a.symbol)).size,11);
});
test('local entrypoint assets exist and privacy does not depend on third-party scripts',async()=>{
 const html=await readFile('src/index.html','utf8');
 for(const file of ['app.js','styles.css','assets/mark.svg','assets/vishnu.webp'])assert.ok((await readFile(`src/${file}`)).length);
 assert.doesNotMatch(html,/<script[^>]+src="https?:/);
 assert.match(html,/<dialog[^>]+aria-labelledby="detail-name"/);
 assert.match(html,/rel="noopener noreferrer"/);
 const app=await readFile('src/app.js','utf8');assert.doesNotMatch(app,/localStorage|document\.cookie|fetch\(/);
});

test('repository-root and source entry points resolve all local scripts, styles, and images',async()=>{
 for(const [file,base] of [['index.html',''],['src/index.html','src/']]){
  const html=await readFile(file,'utf8');
  const urls=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(url=>!url.startsWith('#')&&!url.startsWith('https:'));
  assert.ok(urls.length>=4,`${file}: expected application assets`);
  for(const url of urls)assert.ok((await readFile(base+url)).length,`${file}: ${url}`);
 }
 assert.match(await readFile('_headers','utf8'),/Content-Security-Policy/);
});
