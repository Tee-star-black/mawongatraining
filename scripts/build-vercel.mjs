import { rm, mkdir, copyFile, readdir } from 'node:fs/promises';
import { pages, route } from './routes.mjs';
const root=new URL('../',import.meta.url);
const output=new URL('dist/',root);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
async function copy(source,destination){
 const target=new URL(destination,output);
 await mkdir(new URL('./',target),{recursive:true});
 await copyFile(new URL(source,root),target);
}
for(const [path,file] of Object.entries(pages))await copy(file,path==='/'?'index.html':path.slice(1)+'index.html');
async function assets(directory){
 for(const entry of await readdir(new URL(directory,root),{withFileTypes:true})){
  const path=directory+entry.name;
  if(entry.isDirectory())await assets(path+'/');
  else if(route('/'+path)?.file===path)await copy(path,path);
 }
}
await assets('assets/');
await assets('images/');
for(const file of ['robots.txt','sitemap.xml','google736522bf4b7fa0e6.html'])await copy(file,file);
console.log('Packaged public pages and assets into dist for Vercel.');
