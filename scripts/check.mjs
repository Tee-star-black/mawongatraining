import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, route } from './routes.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=f=>readFileSync(resolve(root,f),'utf8');
const fail=[];
const decode=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
const ids=new Map(Object.values(pages).map(file=>[file,new Set([...read(file).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));
for(const [path,file] of Object.entries(pages)){
 const html=read(file);
 if((html.match(/<h1\b/g)||[]).length!==1)fail.push(`${file}: expected one H1`);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];
 if(!title || decode(title).length>60)fail.push(`${file}: missing/long title (${decode(title||'').length})`);
 const desc=html.match(/<meta name="description" content="([^"]+)"/);if(!desc || decode(desc[1]).length>155)fail.push(`${file}: missing/long description`);
 if(!html.includes(`rel="canonical" href="https://mawongatraining.co.za${path}"`))fail.push(`${file}: wrong canonical`);
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){
  try{const json=JSON.parse(match[1]);const course=json['@graph'].filter(n=>n['@type']==='Course');if(!path.match(/clinical-training|biomedical-ethics|medical-entrepreneurship/) && course.length)fail.push(`${file}: course schema on unrelated page`);}catch{fail.push(`${file}: invalid JSON-LD`);}
 }
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const ref=decode(match[1]);if(/^(https?:|mailto:|tel:)/.test(ref))continue;
  const url=new URL(ref,'https://mawongatraining.co.za'+path);
  const matchRoute=route(url.pathname);
  if(!matchRoute){fail.push(`${file}: broken route ${ref}`);continue;}
  const target=matchRoute.file||pages[matchRoute.redirect];
  if(!target || !existsSync(resolve(root,target))){fail.push(`${file}: missing target ${ref}`);continue;}
  if(url.hash && ids.has(target) && !ids.get(target).has(url.hash.slice(1)))fail.push(`${file}: missing fragment ${ref}`);
 }
 for(const image of html.matchAll(/<img\b[^>]*>/g))if(!/\balt="[^"]*"/.test(image[0]))fail.push(`${file}: image lacks alt`);
 for(const source of html.matchAll(/srcset="([^"]+)"/g)){
  for(const candidate of source[1].split(',')){
   const path=candidate.trim().split(/\s+/)[0];
   const assetRoute=route(path);
   if(!assetRoute?.file || !existsSync(resolve(root,assetRoute.file)))fail.push(`${file}: missing responsive image ${path}`);
   else {
    const bytes=readFileSync(resolve(root,assetRoute.file));
    if(bytes.length<12 || bytes.toString('ascii',0,4)!=='RIFF' || bytes.toString('ascii',8,12)!=='WEBP' || bytes.readUInt32LE(4)+8!==bytes.length)fail.push(`${file}: invalid WebP ${path}`);
   }
  }
 }
 const fileIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(fileIds).size!==fileIds.length)fail.push(`${file}: duplicate IDs`);
 if(/Lorem ipsum|accredited ethics|prospectus-room\.svg|prospectus-dashboard\.svg/i.test(html))fail.push(`${file}: placeholder, unverified claim or missing legacy image`);
}
const catalogue=read('course-prospectus.html');if((catalogue.match(/class="catalogue-course"/g)||[]).length!==15)fail.push('Prospectus must preserve all 15 courses');
const sitemap=read('sitemap.xml');for(const path of Object.keys(pages))if(!sitemap.includes(`https://mawongatraining.co.za${path}</loc>`))fail.push(`Sitemap missing ${path}`);
if(fail.length){console.error(fail.join('\n'));process.exit(1);}console.log('Passed: 9 pages, links/fragments/assets, metadata, JSON-LD, alt attributes, 15 courses and sitemap.');
