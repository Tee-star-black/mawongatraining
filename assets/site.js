(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const dropdown = document.querySelector('.nav-courses');
  if (menu && nav) {
    menu.hidden = false;
    const close = () => {
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.open = false;
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const focusWasInside = nav.contains(document.activeElement);
        close();
        if (focusWasInside) {
          const focusTarget = window.innerWidth > 900 ? dropdown?.querySelector('summary') : menu;
          focusTarget?.focus();
        }
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) close();
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) close();
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', close);
  }

  const pathwayButtons = [...document.querySelectorAll('[data-programme]')];
  const panels = [...document.querySelectorAll('.programme-panel')];
  pathwayButtons.forEach(button => {
    button.setAttribute('aria-controls', 'panel-' + button.dataset.programme);
    button.addEventListener('click', () => {
      pathwayButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      panels.forEach(panel => { panel.hidden = panel.id !== 'panel-' + button.dataset.programme; });
    });
  });

  // Progressive motion: never hide content if observation or motion support is absent.
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('.motion-toggle');
  let motionPaused = Boolean(motionPreference.matches);
  const syncMotion = () => {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    document.documentElement.classList.toggle('motion-enabled', !motionPaused);
    if (motionToggle) {
      motionToggle.textContent = motionPaused ? 'Enable motion' : 'Pause motion';
      motionToggle.setAttribute('aria-pressed', String(motionPaused));
    }
  };
  if (motionToggle) {
    motionToggle.hidden = false;
    syncMotion();
    motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; syncMotion(); });
    motionPreference.addEventListener('change', event => { motionPaused = event.matches; syncMotion(); });
  }
  const revealTargets = [...document.querySelectorAll('.section-heading, .story-images, .story-copy, .learning-process, .faculty-section, .outcomes-section, .values-section, .partner-directory article')];
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    revealTargets.forEach(target => {
      // Avoid hiding nested elements twice and allow reading before a scroll.
      if (!motionPaused && !target.closest('.learning-process')) {
        target.classList.add('reveal', 'is-pending');
      }
      observer.observe(target);
    });
  } else {
    revealTargets.forEach(target => target.classList.add('is-visible'));
  }

  // Arrow keys provide quick movement through the related programme buttons.
  pathwayButtons.forEach((button, index) => {
    button.addEventListener('keydown', event => {
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (!direction && !['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? pathwayButtons.length - 1 : (index + direction + pathwayButtons.length) % pathwayButtons.length;
      pathwayButtons[next].focus();
      pathwayButtons[next].click();
    });
  });

  const track = document.querySelector('.knowledge-track');
  if (track) {
    const cards = [...track.querySelectorAll('.knowledge-card')];
    const controls = document.querySelector('.carousel-controls');
    const position = document.querySelector('.carousel-position');
    let active = 0;
    const announce = () => {
      if (position) position.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    };
    const move = direction => {
      if (!cards.length) return;
      active = (active + direction + cards.length) % cards.length;
      track.scrollTo({ left: cards[active].offsetLeft - cards[0].offsetLeft, behavior: motionPaused ? 'auto' : 'smooth' });
      announce();
    };
    if (controls) controls.hidden = false;
    document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => move(-1));
    document.querySelector('[data-carousel-next]')?.addEventListener('click', () => move(1));
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.target !== track) return;
      event.preventDefault();move(event.key === 'ArrowRight' ? 1 : -1);
    });
    // Manual swipe updates the selected card once scrolling settles.
    let scrollTimer;
    const updatePosition = () => {
      const centre = track.scrollLeft + track.clientWidth / 2;
      let best = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - cards[0].offsetLeft + card.offsetWidth / 2 - centre);
        if (distance < best) { best = distance; active = index; }
      });
      announce();
    };
    track.addEventListener('scrollend', () => { clearTimeout(scrollTimer); updatePosition(); });
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updatePosition, 150);
    }, { passive: true });
    cards.forEach(card => {
      card.addEventListener('pointermove', event => {
        if (motionPaused || event.pointerType !== 'mouse') return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${-y * 5}deg`);
        card.style.setProperty('--tilt-y', `${x * 5}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');
      });
    });
    announce();
  }

  const search = document.querySelector('#course-search');
  const select = document.querySelector('#stream-filter');
  const entries = [...document.querySelectorAll('.catalogue-course')];
  const reset = document.querySelector('.filter-reset');
  const groups = [...document.querySelectorAll('[data-course-group]')];
  const streamLinks = [...document.querySelectorAll('[data-stream-link]')];
  if (search && select && reset) {
    reset.hidden = false;
    // Include modules and activities so a search can find a course by its subject matter.
    const texts = entries.map(entry => entry.textContent.toLocaleLowerCase('en-ZA'));
    const params = new URLSearchParams(window.location.search);
    if ([...select.options].some(option => option.value === params.get('stream'))) select.value = params.get('stream');
    search.value = params.get('q') || '';
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase('en-ZA');
      const terms = query.split(/\s+/).filter(Boolean);
      let count = 0;
      entries.forEach((entry, index) => {
        const match = (select.value === 'all' || entry.dataset.stream === select.value) && terms.every(term => texts[index].includes(term));
        entry.hidden = !match;
        if (match) count++;
      });
      groups.forEach(group => {
        const visible = entries.filter(entry => entry.dataset.stream === group.dataset.courseGroup && !entry.hidden).length;
        group.hidden = visible === 0;
        const label = group.querySelector('[data-group-count]');
        if (label) label.textContent = `${visible} ${visible === 1 ? 'course' : 'courses'}`;
      });
      streamLinks.forEach(link => {
        if (link.dataset.streamLink === select.value) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      document.querySelector('#course-count').textContent = String(count);
      document.querySelector('#course-empty').hidden = count !== 0;
    };
    streamLinks.forEach(link => link.addEventListener('click', () => {
      search.value = '';
      select.value = link.dataset.streamLink;
      filter();
      // The ordinary anchor then takes the visitor to the now-visible group.
    }));
    search.addEventListener('input', filter);
    select.addEventListener('change', filter);
    reset.addEventListener('click', () => {
      search.value = '';
      select.value = 'all';
      filter();
      search.focus();
    });
    filter();
  }
})();
