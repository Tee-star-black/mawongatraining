import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { pages, route } from '../scripts/routes.mjs';
import { handle } from '../scripts/serve.mjs';
const request = async (url,method='GET')=>{
 const result={};
 await handle({url,method},{writeHead(status,headers){result.status=status;result.headers=headers;},end(body){result.body=body;}});
 return result;
};
test('all canonical URLs serve the correct page with its canonical tag',async()=>{
 for(const path of Object.keys(pages)){
  const res=await request(path);
  assert.equal(res.status,200,path);
  assert.match(res.headers['Content-Type'],/text\/html/);
  assert.ok(res.body.toString().includes(`href="https://mawongatraining.co.za${path}"`));
 }
});
test('legacy and misspelled routes redirect, keeping search parameters',async()=>{
 for(const path of ['/medical-entreprenuership/','/medical-entreprenuership.html','/medical-entrepreneurship.html']){
  const res=await request(path+'?source=old');assert.equal(res.status,308);assert.equal(res.headers.Location,'/medical-entrepreneurship/?source=old');
 }
 assert.equal((await request('/about-us.html')).headers.Location,'/about/');
 assert.equal((await request('/clinical-training')).headers.Location,'/clinical-training/');
});
test('missing assets, runtime source and PHP are not served as static text',async()=>{
 for(const path of ['/assets/missing.webp','/content/courses.json','/scripts/serve.mjs','/api.php','/.env'])assert.equal((await request(path)).status,404,path);
});
test('path traversal and malformed encodings are rejected',()=>{
 for(const path of ['/assets/%2e%2e%2fapi.php','/assets/%00.webp','/assets/%zz.webp','/assets/..\\api.php'])assert.equal(route(path),null);
});
test('HEAD returns headers without content, unsupported writes return 405',async()=>{
 const head=await request('/','HEAD');assert.equal(head.status,200);assert.equal(head.body,undefined);
 const post=await request('/','POST');assert.equal(post.status,405);assert.equal(post.headers.Allow,'GET, HEAD');
});
test('all used image assets are reachable through the preview handler',async()=>{
 for(const file of readdirSync(new URL('../assets/',import.meta.url)).filter(name=>name.endsWith('.webp'))){
  const res=await request('/assets/'+file);assert.equal(res.status,200);assert.equal(res.headers['Content-Type'],'image/webp');assert.ok(res.body.length>1000);
 }
});

test('removed partner branding and legacy artwork are absent from public routes',async()=>{
 for(const page of ['/','/partners/'])assert.doesNotMatch((await request(page)).body.toString(),/medkulula|partner-03/i);
 for(const asset of ['/assets/mawonga-medkulula.webp','/images/MedKulula.png','/assets/mawonga-partnership.webp','/images/Partnership.png'])assert.equal((await request(asset)).status,404,asset);
});

test('prospectus badges stay with their matching learning stream and course list',async()=>{
 const html=(await request('/course-prospectus/')).body.toString();
 assert.match(html,/<img src="\/assets\/prospectus-learning-lab\.webp"/);
 const groups=[...html.matchAll(/<section class="course-group"[^>]*data-course-group="([^"]+)">(.*?)<\/section>/gs)];
 assert.deepEqual(groups.map(group=>group[1]),['practice','business','marketing','leadership','digital','me']);
 const expected={practice:[1,2,3],business:[4,5,6],marketing:[7,8,9],leadership:[10,11],digital:[12,13],me:[14,15]};
 for(const [,stream,group] of groups){
  assert.ok(group.includes(`src="/assets/stream-${stream}.webp"`),stream);
  const courses=[...group.matchAll(/class="catalogue-course" id="course-(\d+)"/g)].map(match=>Number(match[1]));
  assert.deepEqual(courses,expected[stream]);
  assert.equal((await request(`/assets/stream-${stream}.webp`)).status,200);
 }
});
