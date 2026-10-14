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
  removeAttribute(name){delete this.attrs[name];}
  focus(){this.focused=true;}
  click(){this.fire('click');}
}
function setup(query='',reducedMotion=false,carousel=false) {
  const classes=new Set();
  const nav=new Element();nav.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)};nav.contains=el=>el===nav;
  const menu=new Element({attrs:{'aria-expanded':'false'}});
  const dropdown=new Element();
  const buttons=['clinical','ethics','business'].map(id=>new Element({dataset:{programme:id}}));
  const panels=buttons.map(b=>Object.assign(new Element(),{id:'panel-'+b.dataset.programme}));
  const courses=[...read('course-prospectus.html').matchAll(/<details class="catalogue-course"[^>]*data-stream="([^"]+)">(.*?)<\/details>/gs)].map(m=>new Element({textContent:m[2].replace(/<[^>]+>/g,' '),dataset:{stream:m[1]}}));
  const search=new Element(),select=new Element();select.value='all';select.options=['all','practice','business','marketing','leadership','digital','me'].map(value=>({value}));
  const groupLabels={};
  const streamIds=['practice','business','marketing','leadership','digital','me'];
  const groups=streamIds.map(id=>{
    const group=new Element({dataset:{courseGroup:id}});
    groupLabels[id]=new Element();group.querySelector=()=>groupLabels[id];return group;
  });
  const streamLinks=streamIds.map(id=>new Element({dataset:{streamLink:id}}));
  const reset=new Element(),count=new Element(),empty=new Element();
  const track=new Element(),previous=new Element(),next=new Element(),position=new Element(),controls=new Element();
  const cards=Array.from({length:4},(_,i)=>{const card=new Element();card.offsetLeft=i*360;card.offsetWidth=340;card.style={setProperty(){},removeProperty(){}};return card;});
  track.querySelectorAll=()=>cards;track.clientWidth=600;track.scrollLeft=0;
  track.scrollTo=options=>{track.lastScroll=options;track.scrollLeft=options.left;};
  const motion=new Element();const rootClasses=new Set();
  const elements={'.menu-toggle':menu,'#primary-nav':nav,'.nav-courses':dropdown,'#course-search':search,'#stream-filter':select,'.motion-toggle':motion,'.filter-reset':reset,'#course-count':count,'#course-empty':empty};
  if(carousel) Object.assign(elements,{'.knowledge-track':track,'.carousel-controls':controls,'.carousel-position':position,'[data-carousel-prev]':previous,'[data-carousel-next]':next});
  const doc=new Element();doc.documentElement={classList:{add:x=>rootClasses.add(x),toggle:(x,on)=>on?rootClasses.add(x):rootClasses.delete(x)}};doc.activeElement=nav;
  doc.querySelector=s=>elements[s]||null;
  doc.querySelectorAll=s=>({'[data-programme]':buttons,'.programme-panel':panels,'.catalogue-course':courses,'[data-course-group]':groups,'[data-stream-link]':streamLinks}[s]||[]);
  vm.runInNewContext(read('assets/site.js'),{setTimeout,clearTimeout,document:doc,window:{location:{search:query},matchMedia:()=>({matches:reducedMotion,addEventListener(){}})},URLSearchParams});
  return {doc,menu,nav,classes,buttons,panels,courses,search,select,reset,count,empty,motion,rootClasses,groups,groupLabels,streamLinks,track,previous,next,position,controls,cards};
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

test('motion starts paused for reduced-motion users and can be explicitly changed',()=>{
 const s=setup('',true);
 assert.equal(s.motion.hidden,false);
 assert.equal(s.motion.attrs['aria-pressed'],'true');
 assert.ok(s.rootClasses.has('motion-paused'));
 s.motion.fire('click');
 assert.equal(s.motion.attrs['aria-pressed'],'false');
 assert.equal(s.motion.textContent,'Pause motion');
 assert.equal(s.rootClasses.has('motion-paused'),false);
 s.motion.fire('click');
 assert.equal(s.motion.textContent,'Enable motion');
 assert.ok(s.rootClasses.has('motion-paused'));
});
test('keyboard pathway navigation selects, focuses and wraps between programmes',()=>{
 const s=setup();let prevented=false;
 s.buttons[0].fire('keydown',{key:'End',preventDefault(){prevented=true;}});
 assert.ok(prevented);assert.ok(s.buttons[2].focused);
 assert.deepEqual(s.panels.map(p=>p.hidden),[true,true,false]);
 s.buttons[2].fire('keydown',{key:'ArrowRight',preventDefault(){}});
 assert.ok(s.buttons[0].focused);
 assert.deepEqual(s.panels.map(p=>p.hidden),[false,true,true]);
});

test('course groups hide empty results and restore all six categories on reset',()=>{
 const s=setup('?stream=business');
 assert.deepEqual(s.groups.map(g=>g.hidden),[true,false,true,true,true,true]);
 s.search.value='scheduling';s.search.fire('input');
 assert.equal(s.groupLabels.business.textContent,'1 course');
 s.search.value='not-a-course';s.search.fire('input');
 assert.ok(s.groups.every(g=>g.hidden));
 s.reset.fire('click');
 assert.ok(s.groups.every(g=>!g.hidden));
 assert.deepEqual(Object.values(s.groupLabels).map(label=>label.textContent),['3 courses','3 courses','3 courses','2 courses','2 courses','2 courses']);
});
test('learning stream navigation clears a stale search and exposes its destination',()=>{
 const s=setup();s.search.value='not-a-course';s.search.fire('input');
 s.streamLinks[3].fire('click');
 assert.equal(s.search.value,'');assert.equal(s.select.value,'leadership');
 assert.equal(s.count.textContent,'2');assert.equal(s.groups[3].hidden,false);
 assert.equal(s.streamLinks[3].attrs['aria-current'],'true');
 s.reset.fire('click');assert.equal(s.streamLinks[3].attrs['aria-current'],undefined);
});

test('homepage carousel advances, wraps and supports focused-track keyboard navigation',()=>{
 const s=setup('',false,true);assert.equal(s.controls.hidden,false);
 s.next.fire('click');assert.equal(s.track.lastScroll.left,360);assert.equal(s.position.textContent,'02 / 04');
 s.previous.fire('click');s.previous.fire('click');assert.equal(s.track.lastScroll.left,1080);assert.equal(s.position.textContent,'04 / 04');
 s.track.fire('keydown',{key:'ArrowRight',target:s.track,preventDefault(){}});
 assert.equal(s.track.lastScroll.left,0);assert.equal(s.position.textContent,'01 / 04');
 s.track.fire('keydown',{key:'ArrowRight',target:s.cards[0],preventDefault(){throw new Error('Should not intercept link navigation');}});
 assert.equal(s.track.lastScroll.left,0);
});
test('carousel obeys reduced motion and manual scrolling updates its position',()=>{
 const s=setup('',true,true);s.next.fire('click');assert.equal(s.track.lastScroll.behavior,'auto');
 s.track.scrollLeft=700;s.track.fire('scrollend');assert.equal(s.position.textContent,'03 / 04');
});

test('touch carousel position updates even when scrollend is unavailable',async()=>{
 const s=setup('',false,true);s.track.scrollLeft=700;s.track.fire('scroll');
 await new Promise(resolve=>setTimeout(resolve,180));
 assert.equal(s.position.textContent,'03 / 04');
});
