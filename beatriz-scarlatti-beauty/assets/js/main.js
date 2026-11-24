(() => {
  'use strict';

  /* ===== Configuração (edite aqui) ===== */
  const WHATSAPP = '5517991868273';
  const MENSAGEM = 'Olá, Beatriz! Gostaria de agendar um horário.';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ===== Links do WhatsApp (mensagem pré-preenchida) ===== */
  $$('[data-wa]').forEach(a => {
    const servico = a.dataset.service;
    const texto = servico
      ? `Olá, Beatriz! Gostaria de agendar um horário para ${servico}.`
      : MENSAGEM;
    a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  });

  /* ===== Header e menu mobile ===== */
  const header = $('#header');
  const toggle = $('#navToggle');
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = open => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  let scrollFrame = null;
  const cancelScroll = () => {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  };
  const animateScrollTo = (target, hash) => {
    const start = window.scrollY;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = Math.max(0, Math.min(
      maxScroll,
      target.getBoundingClientRect().top + start - header.offsetHeight
    ));
    const distance = destination - start;

    if (Math.abs(distance) < 1) {
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
      return;
    }

    const duration = 1500 + Math.min(Math.abs(distance) / maxScroll, 1) * 1000;
    const startTime = performance.now();
    const easeInOutCubic = progress => progress < 0.5
      ? 4 * progress ** 3
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const step = time => {
      const progress = Math.min((time - startTime) / duration, 1);
      const position = start + distance * easeInOutCubic(progress);
      window.scrollTo({ top: position, behavior: 'instant' });

      if (progress < 1) {
        scrollFrame = requestAnimationFrame(step);
      } else {
        scrollFrame = null;
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
      }
    };

    scrollFrame = requestAnimationFrame(step);
  };
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('#header a[href^="#"]').forEach(a => a.addEventListener('click', event => {
    setMenu(false);

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(a.href);
    if (destination.origin !== window.location.origin
      || destination.pathname !== window.location.pathname
      || destination.search !== window.location.search
      || !destination.hash) return;

    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    cancelScroll();
    animateScrollTo(target, destination.hash);
  }));
  window.addEventListener('wheel', cancelScroll, { passive: true });
  window.addEventListener('touchstart', cancelScroll, { passive: true });
  window.addEventListener('pointerdown', cancelScroll, { passive: true });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) cancelScroll();
  });

  /* ===== Animação de entrada ao rolar ===== */
  const items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      if (!el.closest('.hero')) el.style.transitionDelay = `${(i % 4) * 90}ms`;
      io.observe(el);
    });
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }

  /* ===== Galeria: abrir imagem ampliada ===== */
  const box = $('#lightbox');
  const boxImg = $('img', box);
  const imgs = $$('.gallery__item img');
  let current = 0;
  const show = i => {
    current = (i + imgs.length) % imgs.length;
    boxImg.src = imgs[current].src;
    boxImg.alt = imgs[current].alt;
  };
  imgs.forEach((img, i) => img.parentElement.addEventListener('click', () => { show(i); box.showModal(); }));
  $('.lightbox__close', box).addEventListener('click', () => box.close());
  $('.lightbox__prev', box).addEventListener('click', () => show(current - 1));
  $('.lightbox__next', box).addEventListener('click', () => show(current + 1));
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ===== Ano do rodapé ===== */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
