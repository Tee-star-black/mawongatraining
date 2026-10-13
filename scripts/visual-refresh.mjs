/**
 * Mawonga Training editorial refresh.
 * Applies distinct, page-specific layouts after the original HTML is generated.
 * No dynamic runtime rendering: the output remains static HTML.
 */
const photo=(src,alt,attrs='loading="lazy"')=>`<img src="${src}" alt="${alt}" ${attrs}>`;

export function applyVisualRefresh(html,file) {
  const swap=(from,to,name)=>{
    if (!html.includes(from)) throw new Error(`${file}: cannot locate ${name}`);
    html=html.replace(from,to);
  };
  if (html.includes('/assets/design-v2.css')) return html;
  swap('<link rel="stylesheet" href="/assets/site.css">',
    '<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/design-v2.css">','stylesheet');
  swap('<script src="/assets/site.js" defer></script>',
    '<script src="/assets/site.js" defer></script><script src="/assets/design-v2.js" defer></script>','site scripts');
  swap('<meta name="theme-color" content="#123d62">',
    '<meta name="theme-color" content="#173d62">','theme colour');

  if(file==='index.html'){
    swap('</figcaption></figure><div class="photo-label">',
      '</figcaption></figure><figure class="hero-secondary-photo">'+photo('/assets/workshop-3.webp','Facilitator guiding healthcare professionals in a Mawonga training session')+'</figure><div class="photo-label">','hero photograph');
    const photos={clinical:'/assets/workshop-1.webp',ethics:'/assets/workshop-2.webp',business:'/assets/workshop-3.webp'};
    html=html.replace(/(<article class="programme-panel" id="panel-(clinical|ethics|business)"[^>]*>)/g,
      (_,open,id)=>open+'<figure class="panel-art">'+photo(photos[id],'')+'</figure>');
    const gallery=`<section class="field-gallery" aria-labelledby="gallery-title">
      <div class="gallery-heading"><div><span class="eyebrow">Inside a Mawonga learning space</span><h2 id="gallery-title">The people behind<br>progress in care.</h2></div>
      <p>Real moments from practical group learning. The conversation continues long after the session ends.</p></div>
      <div class="gallery-grid">
      <figure>${photo('/assets/workshop-2.webp','A facilitator addressing healthcare professionals in a Mawonga training workshop')}<figcaption>Learning in community / 01</figcaption></figure>
      <figure>${photo('/assets/workshop-1.webp','Healthcare professionals participating in practical group learning')}<figcaption>Discussion and application / 02</figcaption></figure>
      <figure>${photo('/assets/workshop-3.webp','Participants attending a facilitated healthcare training session')}<figcaption>Learning from practice / 03</figcaption></figure>
      </div></section>`;
    swap('<section class="route-section">',gallery+'<section class="route-section">','editorial gallery');
  }

  const topics={
    'clinical-training.html':{
      key:'clinical',inset:'/assets/workshop-1.webp',
      ribbon:['Assessment and reasoning','Applied practical skills','Patient safety'],
      image:'/images/Clinical%20Training.png',imageAlt:'Mawonga supplied clinical training illustration',
      kicker:'Clinical training / in context',heading:'Move from knowledge<br>to confident action.',
      description:'Strengthen your approach to assessment, everyday procedures and patient safety. Learning connects clinical decisions with the people who rely on them.',
      tags:['Clinical reasoning','Practical application','Safer routines']
    },
    'biomedical-ethics.html':{
      key:'ethics',inset:'/assets/workshop-3.webp',
      ribbon:['Ethical judgement','Clear communication','Defensible records'],
      image:'/images/Bio-ethics.png',imageAlt:'Mawonga supplied biomedical ethics illustration',
      kicker:'Biomedical ethics / in context',heading:'Good judgement deserves<br>good documentation.',
      description:'Explore how professional responsibility, communication and quality records help support accountable care. Ethical practice needs both principles and workable daily habits.',
      tags:['Responsibility','Confidentiality','Record keeping']
    },
    'medical-entreprenuership.html':{
      key:'business',inset:'/images/IMAGE%201.jpeg',
      ribbon:['Plan the practice','Manage the process','Review the results'],
      image:'/assets/workshop-3.webp',imageAlt:'Mawonga workshop participants learning clinic management approaches',
      kicker:'Medical entrepreneurship / in context',heading:'A practice runs on more<br>than clinical skill.',
      description:'Connect sound care with billing routines, operational decisions and clear team responsibilities. Strong systems create more room to focus on patients.',
      tags:['Claims and coding','Operational flow','Financial discipline']
    }
  };
  if(topics[file]){
    const t=topics[file];
    swap('<section class="page-hero">',`<section class="page-hero page-hero--${t.key}">`,'programme hero');
    const inset=`<div class="hero-inset">${photo(t.inset,'Additional view of Mawonga training activity')}<span class="hero-inset-caption">Learning with Mawonga</span></div>`;
    const ribbon=`<div class="topic-ribbon topic-ribbon--${t.key}"><strong>${t.key.toUpperCase()} / LEARNING IN ACTION</strong>${t.ribbon.map(x=>`<span>${x}</span>`).join('')}</div>`;
    swap('</figcaption></figure></section><section class="course-facts">',
      '</figcaption>'+inset+'</figure></section>'+ribbon+'<section class="course-facts">','programme imagery');
    const feature=`<section class="topic-focus topic-focus--${t.key}"><figure>${photo(t.image,t.imageAlt,'loading="lazy" decoding="async"')}</figure>
      <div><span class="eyebrow">${t.kicker}</span><h2>${t.heading}</h2><p>${t.description}</p>
      <div class="focus-tags">${t.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div></section>`;
    swap('<section class="curriculum-section">',feature+'<section class="curriculum-section">','topic visual feature');
  }

  if(file==='about.html'){
    swap('<section class="page-hero">','<section class="page-hero page-hero--about">','about hero');
    swap('</figcaption></figure></section><section class="about-statement">',
      '</figcaption><div class="hero-inset">'+photo('/images/MawongaT.png','Mawonga Training brand mark')+
      '<span class="hero-inset-caption">Our purpose</span></div></figure></section><section class="about-statement">','about inset');
    const manifesto=`<section class="about-manifesto"><div class="manifesto-picture">
      ${photo('/assets/workshop-2.webp','Healthcare practitioners in a Mawonga workshop')}
      ${photo('/images/MawongaT.png','Mawonga Training logo','class="manifesto-emblem" loading="lazy"')}</div>
      <div><span class="eyebrow">Care for carers, in practice</span>
      <h2>Healthcare gets stronger<br>when its people do.</h2>
      <p>Behind every consultation is a person making decisions, leading teams and keeping a service running. Mawonga brings those responsibilities into one learning experience.</p>
      <div class="mantra"><span>Clinical learning</span><span>Professional judgement</span><span>Practice growth</span></div></div></section>`;
    swap('<section class="values-section">',manifesto+'<section class="values-section">','about manifesto');
  }

  if(file==='partners.html'){
    swap('<section class="text-hero">','<section class="text-hero partners-hero"><div>','partners hero');
    swap('</section><section class="partner-directory">',
      '</div><figure>'+photo('/images/Partnership.png','Mawonga illustration representing partnerships in healthcare','loading="lazy" decoding="async"')+
      '<figcaption>Clinical expertise / digital tools / better systems</figcaption></figure></section><section class="partner-directory">','partnership visual');
    swap('<h2>MedKulula</h2><p>','<h2>MedKulula</h2>'+photo('/images/MedKulula.png','MedKulula brand artwork','class="partner-logo" loading="lazy"')+'<p>','partner image');
  }

  if(file==='contact-us.html'){
    swap('<section class="text-hero">','<section class="contact-hero"><div>','contact hero');
    swap('</section><section class="contact-grid">',
      '</div><figure>'+photo('/assets/workshop-1.webp','Healthcare professionals learning with Mawonga Training')+
      '<figcaption>A real team. A practical conversation.</figcaption></figure></section><section class="contact-grid">','contact photograph');
  }

  if(file==='course-prospectus.html'){
    const definitions=[
      ['practice','Nurse-led practice','Starting, structuring and maintaining a compliant nurse-led healthcare service.','/assets/workshop-1.webp'],
      ['business','Business & finance','Finance, clinic operations and building a sustainable healthcare practice.','/assets/workshop-3.webp'],
      ['marketing','Marketing & outreach','Reaching communities responsibly and communicating the value of clinical services.','/assets/workshop-2.webp'],
      ['leadership','Leadership','The judgement and people skills that keep healthcare teams working well.','/assets/workshop-1.webp'],
      ['digital','Digital health','Records, privacy and practical technology in modern patient care.','/images/MedKulula.png'],
      ['me','Quality improvement','Methods to review services, measure outcomes and strengthen quality.','/assets/workshop-3.webp']
    ];
    swap('<section class="catalogue-intro">','<section class="catalogue-intro catalogue-intro--grouped">','prospectus hero');
    swap('</div></section><section class="catalogue-section">',
      '</div><figure class="catalogue-cover">'+photo('/assets/workshop-2.webp','Healthcare professionals attending Mawonga Training','fetchpriority="high"')+
      '<figcaption>15 courses / 06 learning streams / practical development</figcaption></figure></section><section class="catalogue-section">','prospectus cover');
    const begin=html.indexOf('<div class="catalogue-list">');
    const end=html.indexOf('<p id="course-empty"',begin);
    if(begin<0 || end<0)throw new Error('Prospectus list boundaries not found');
    const courseHTML=html.slice(begin,end);
    const matches=[...courseHTML.matchAll(/<details class="catalogue-course" id="course-(\d+)" data-stream="([^"]+)">[\s\S]*?<\/details>/g)];
    if(matches.length!==15)throw new Error('Expected 15 courses; got '+matches.length);
    const groupHTML=definitions.map(([id,title,desc,img],i)=>{
      const included=matches.filter(m=>m[2]===id);
      if(!included.length)throw new Error('No courses for stream '+id);
      return `<section class="course-group" id="stream-${id}" data-stream-group="${id}">
        <header class="course-group-heading"><div><span class="eyebrow">${String(i+1).padStart(2,'0')} / ${included.length} courses</span><h2>${title}</h2><p>${desc}</p></div>
        <figure>${photo(img,title+' learning category illustration')}</figure></header>
        <div class="catalogue-list">${included.map(m=>m[0]).join('')}</div></section>`;
    }).join('');
    html=html.slice(0,begin)+'<div class="catalogue-groups">'+groupHTML+'</div>'+html.slice(end);
    const controls=`<nav class="stream-jump" aria-label="Choose a learning stream">${definitions.map(([id,title],i)=>{
      const count=matches.filter(m=>m[2]===id).length;
      return `<button type="button" data-stream-target="${id}" aria-pressed="false"><span class="stream-number">${String(i+1).padStart(2,'0')} / STREAM</span><strong>${title}</strong><small>${count} courses ↗</small></button>`;
    }).join('')}</nav>`;
    swap('<div class="catalogue-tools">',controls+'<div class="catalogue-tools">','course category controls');
  }

  return html;
}
