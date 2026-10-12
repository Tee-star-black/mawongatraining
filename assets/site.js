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

  const search = document.querySelector('#course-search');
  const select = document.querySelector('#stream-filter');
  const entries = [...document.querySelectorAll('.catalogue-course')];
  const reset = document.querySelector('.filter-reset');
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
      document.querySelector('#course-count').textContent = String(count);
      document.querySelector('#course-empty').hidden = count !== 0;
    };
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
