(() => {
  'use strict';

  // The six course streams remain fully rendered in HTML for search engines
  // and for visitors with JavaScript disabled. This only enhances discovery.
  const streamSelect = document.querySelector('#stream-filter');
  const streamGroups = [...document.querySelectorAll('[data-stream-group]')];
  const streamButtons = [...document.querySelectorAll('[data-stream-target]')];

  if (streamSelect && streamGroups.length) {
    const visibleCourses = group => [...group.querySelectorAll('.catalogue-course')]
      .some(course => !course.hidden);

    const syncStreams = () => {
      streamGroups.forEach(group => {
        group.hidden = !visibleCourses(group);
      });
      streamButtons.forEach(button => {
        const active = streamSelect.value === button.dataset.streamTarget;
        button.setAttribute('aria-pressed', String(active));
      });
    };

    // assets/site.js is deliberately loaded first. It filters individual
    // courses; these listeners then hide empty stream headings.
    document.querySelector('#course-search')?.addEventListener('input', syncStreams);
    streamSelect.addEventListener('change', syncStreams);
    document.querySelector('.filter-reset')?.addEventListener('click', syncStreams);

    streamButtons.forEach(button => {
      button.addEventListener('click', () => {
        streamSelect.value = button.dataset.streamTarget;
        streamSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const group = document.querySelector('#stream-' + button.dataset.streamTarget);
        if (group && !group.hidden) {
          group.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    syncStreams();
  }

  // Editorial motion is understated and only runs when visitors permit it.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const elements = document.querySelectorAll(
      '.field-gallery .gallery-heading, .field-gallery figure, .course-group-heading, ' +
      '.about-manifesto>div, .topic-focus>div, .partner-directory article, ' +
      '.section-heading, .story-copy, .values-section article'
    );
    elements.forEach(el => el.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 45px 0px' });
    elements.forEach(el => observer.observe(el));
    document.documentElement.classList.add('motion-ready');
  }
})();