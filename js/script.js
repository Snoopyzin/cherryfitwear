/* =========================================================
   Cherry Fitwear — interações
   ========================================================= */
(() => {
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabeçalho ganha sombra ao rolar ---------- */
  const topo = $('#topo');
  const aoRolar = () => topo.classList.toggle('topo--rolado', window.scrollY > 8);
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  /* ---------- Painéis: menu mobile e busca ---------- */
  let painelAberto = null;
  let gatilhoAtual = null;

  function abrePainel(painel, gatilho) {
    if (painelAberto) fechaPainel(painelAberto, false);
    painelAberto = painel;
    gatilhoAtual = gatilho;
    painel.hidden = false;
    document.body.classList.add('travado');
    $$(`[aria-controls="${painel.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    requestAnimationFrame(() => {
      painel.classList.add('aberto');
      const foco = $('[data-foco]', painel) || $('input', painel) || $('button, a', painel);
      foco?.focus({ preventScroll: true });
    });
  }

  function fechaPainel(painel = painelAberto, devolveFoco = true) {
    if (!painel) return;
    painel.classList.remove('aberto');
    $$(`[aria-controls="${painel.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('travado');
    setTimeout(() => { if (!painel.classList.contains('aberto')) painel.hidden = true; }, reduzMovimento ? 0 : 400);
    if (devolveFoco) gatilhoAtual?.focus();
    painelAberto = null;
    painel.dispatchEvent(new CustomEvent('painelfechado'));
  }

  // usado por js/loja.js (detalhes do produto)
  window.CherryPaineis = {
    abrir: (id, gatilho) => abrePainel(document.getElementById(id), gatilho || document.activeElement),
    fechar: () => fechaPainel(),
  };

  $$('[data-abre]').forEach((botao) => {
    const painel = document.getElementById(botao.dataset.abre);
    botao.addEventListener('click', () => abrePainel(painel, botao));
  });

  $$('.painel').forEach((painel) => {
    $$('[data-fecha]', painel).forEach((el) => el.addEventListener('click', () => fechaPainel(painel)));
    // links do menu fecham o painel ao navegar
    $$('a[href^="#"]', painel).forEach((a) => a.addEventListener('click', () => fechaPainel(painel, false)));
  });

  document.addEventListener('keydown', (e) => {
    if (!painelAberto) return;
    if (e.key === 'Escape') { fechaPainel(); return; }
    // mantém o foco dentro do painel
    if (e.key === 'Tab') {
      const focaveis = $$('a[href], button:not([disabled]), input, textarea', painelAberto).filter((el) => el.offsetParent !== null);
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });

  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches && painelAberto?.id === 'menu-mobile') fechaPainel(painelAberto, false);
  });

  /* ---------- Busca ---------- */
  const campoBusca = $('#busca-campo');
  const formBusca = $('.busca__form');
  $$('.busca__sugestoes button').forEach((b) => {
    b.addEventListener('click', () => { campoBusca.value = b.textContent; formBusca.requestSubmit(); });
  });
  formBusca.addEventListener('submit', (e) => {
    e.preventDefault();
    const termo = campoBusca.value.trim();
    if (!termo) return;
    fechaPainel(painelAberto, false);
    window.CherryLoja?.buscar(termo);
  });

  /* ---------- Ano no rodapé ---------- */
  $('#ano').textContent = new Date().getFullYear();

  /* ---------- Entrada suave ao rolar ---------- */
  // os elementos só ficam escondidos se o navegador souber animar (classe .js no <html>)
  if (!reduzMovimento && 'IntersectionObserver' in window) {
    const alvos = $$('.secao__topo, .pilares__lista li, .cat, .marca-item, .passo, .condicoes, .como__subtitulo, .como__cta');
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        obs.unobserve(el);
        el.classList.add('visto');
        // depois de aparecer, volta ao estilo normal (para o hover não herdar a transição lenta)
        setTimeout(() => el.classList.remove('revela', 'visto'), 1100);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    alvos.forEach((el, i) => {
      el.classList.add('revela');
      el.style.setProperty('--d', i % 5);
      obs.observe(el);
    });
  }
})();
