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
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

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
