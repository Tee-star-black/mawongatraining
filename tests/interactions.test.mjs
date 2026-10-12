import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
class Element {
  constructor({textContent='',dataset={},attrs={}}={}) { Object.assign(this,{textContent,dataset,attrs,hidden:false,value:'',handlers:{},focused:false,options:[]}); }
  addEventListener(name,fn){(this.handlers[name]??=[]).push(fn);}
  fire(name,event={}){for(const fn of this.handlers[name]||[])fn(event);}
  setAttribute(name,value){this.attrs[name]=value;}
  getAttribute(name){return this.attrs[name];}
  focus(){this.focused=true;}
}
function setup(query='') {
  const classes=new Set();
  const nav=new Element();nav.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)};nav.contains=el=>el===nav;
  const menu=new Element({attrs:{'aria-expanded':'false'}});
  const dropdown=new Element();
  const buttons=['clinical','ethics','business'].map(id=>new Element({dataset:{programme:id}}));
  const panels=buttons.map(b=>Object.assign(new Element(),{id:'panel-'+b.dataset.programme}));
  const courses=[...read('course-prospectus.html').matchAll(/<details class="catalogue-course"[^>]*data-stream="([^"]+)">(.*?)<\/details>/gs)].map(m=>new Element({textContent:m[2].replace(/<[^>]+>/g,' '),dataset:{stream:m[1]}}));
  const search=new Element(),select=new Element();select.value='all';select.options=['all','practice','business','marketing','leadership','digital','me'].map(value=>({value}));
  const reset=new Element(),count=new Element(),empty=new Element();
  const elements={'.menu-toggle':menu,'#primary-nav':nav,'.nav-courses':dropdown,'#course-search':search,'#stream-filter':select,'.filter-reset':reset,'#course-count':count,'#course-empty':empty};
  const doc=new Element();doc.documentElement={classList:{add(){}}};doc.activeElement=nav;
  doc.querySelector=s=>elements[s]||null;
  doc.querySelectorAll=s=>({'[data-programme]':buttons,'.programme-panel':panels,'.catalogue-course':courses}[s]||[]);
  vm.runInNewContext(read('assets/site.js'),{document:doc,window:{location:{search:query},matchMedia:()=>({addEventListener(){}})},URLSearchParams});
  return {doc,menu,nav,classes,buttons,panels,courses,search,select,reset,count,empty};
}
test('pathway selection presents the selected course and updates all pressed states',()=>{
 const s=setup();s.buttons[2].fire('click');
 assert.deepEqual(s.buttons.map(b=>b.attrs['aria-pressed']),['false','false','true']);
 assert.deepEqual(s.panels.map(p=>p.hidden),[true,true,false]);
 assert.equal(s.buttons[2].attrs['aria-controls'],'panel-business');
});
test('prospectus links preselect a stream; search finds module subjects within that stream',()=>{
 const s=setup('?stream=business');assert.equal(s.count.textContent,'3');
 s.search.value='scheduling';s.search.fire('input');
 assert.equal(s.count.textContent,'1');
 assert.ok(s.courses.filter(c=>!c.hidden)[0].textContent.includes('Healthcare Practice Operations Management'));
});
test('no results are announced and reset restores every course',()=>{
 const s=setup();s.search.value='no-such-course';s.search.fire('input');
 assert.equal(s.count.textContent,'0');assert.equal(s.empty.hidden,false);
 s.reset.fire('click');assert.equal(s.count.textContent,'15');assert.equal(s.empty.hidden,true);assert.equal(s.search.value,'');assert.equal(s.search.focused,true);
});
test('mobile menu reports its state and Escape returns focus to the menu button',()=>{
 const s=setup();s.menu.fire('click');assert.equal(s.menu.attrs['aria-expanded'],'true');assert.ok(s.classes.has('is-open'));
 s.doc.fire('keydown',{key:'Escape'});assert.equal(s.menu.attrs['aria-expanded'],'false');assert.equal(s.classes.has('is-open'),false);assert.equal(s.menu.focused,true);
});
