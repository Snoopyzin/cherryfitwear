/* =========================================================
   Cherry Fitwear — catálogo, detalhes, filtros, busca e pedido
   Os dados ficam em js/produtos.js e js/descricoes.js
   ========================================================= */
(() => {
  const { mensagemConsulta = '' } = window.CHERRY_CONFIG;
  // aceita o número com ou sem máscara; sem DDI, assume Brasil (55)
  const digitos = String(window.CHERRY_CONFIG.whatsapp || '').replace(/\D/g, '');
  const whatsapp = digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos;
  const MARCAS = window.CHERRY_MARCAS;
  const PRODUTOS = window.CHERRY_PRODUTOS;
  const DESCRICOES = window.CHERRY_DESCRICOES || {};
  const marcaPorId = Object.fromEntries(MARCAS.map((m) => [m.id, m]));
  const produtoPorId = Object.fromEntries(PRODUTOS.map((p) => [p.id, p]));

  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const brlInteiro = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normaliza = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const temPreco = (p) => typeof p.preco === 'number';
  // valores redondos sem centavos (R$ 209), quebrados com centavos (R$ 95,50)
  const moeda = (v) => (Number.isInteger(v) ? brlInteiro : brl).format(v);
  const pecas = (n) => `${n} ${n === 1 ? 'peça' : 'peças'}`;

  /* ---------- Variações: tamanho (e cor, quando a peça tem) ---------- */

  const limpaLista = (l) => [...new Set((Array.isArray(l) ? l : []).map((x) => String(x).trim().replace(/\|/g, '/')).filter(Boolean))];
  const TAMANHOS_LOJA = limpaLista(window.CHERRY_CONFIG.tamanhos);
  const tamanhosDe = (p) => {
    const proprios = limpaLista(p.tamanhos);
    return proprios.length ? proprios : (TAMANHOS_LOJA.length ? TAMANHOS_LOJA : ['P', 'M', 'G', 'GG']);
  };
  // cores conhecidas pelo nome (quando a peça só traz o nome da cor, sem o código dela)
  const CORES_HEX = {
    preto: '#1a1416', branco: '#ffffff', 'off white': '#f4efe6', vinho: '#7a0a2a', bordo: '#7a0a2a', cereja: '#cf2a5c',
    rosa: '#f6b3c4', 'rosa claro': '#fde0e8', pink: '#e0709a', rose: '#e8a6b4', vermelho: '#d62839', coral: '#ff7f6e',
    cinza: '#8a8587', grafite: '#3b3639', chumbo: '#4a4548', taupe: '#7d7468', nude: '#d9b8a3', bege: '#d8c3a5', marrom: '#6b4a3a',
    azul: '#3b6fb6', 'azul marinho': '#1d2b53', verde: '#3f8f6b', menta: '#a8dcc8', lilas: '#b69ad8', roxo: '#6b3fa0',
    amarelo: '#f2c744', laranja: '#f08a3c',
  };
  // nomes de cor com os tamanhos escritos junto ("Menta P, M, G", "Marrom G") viram nome + tamanhos da cor
  // (mesma regra do painel, em js/admin-core.js: separaTamanhosDaCor)
  const TAM_COR = '(?:XXG|XG|EGG|EG|GG|G[123]|PP|P|M|G)';
  const COR_COM_TAMANHOS = new RegExp(`^(.+?)\\s+(${TAM_COR}(?:\\s*[,/]\\s*${TAM_COR})*)$`, 'i');
  function separaTamanhosDaCor(texto) {
    const m = String(texto || '').trim().match(COR_COM_TAMANHOS);
    return m ? { nome: m[1].trim(), tamanhos: m[2].split(/\s*[,/]\s*/).map((t) => t.toUpperCase()) } : { nome: String(texto || '').trim(), tamanhos: [] };
  }
  // cores da peça: { nome, hex, imagem (foto desta cor), tamanhos (só os desta cor; vazio = os da peça) }.
  // Aceita também só o nome ('Preto').
  const coresDe = (p) => {
    const vistos = new Set();
    return (Array.isArray(p.cores) ? p.cores : [])
      .map((c) => (typeof c === 'string' ? { nome: c } : (c || {})))
      .map((c) => {
        const sep = separaTamanhosDaCor(String(c.nome || '').replace(/\|/g, '/'));
        const proprios = limpaLista(c.tamanhos);
        const nome = sep.nome;
        const hex = /^#[0-9a-f]{6}$/i.test(c.cor || '') ? c.cor : (CORES_HEX[normaliza(nome)] || '');
        return { nome, hex, imagem: c.imagem || '', tamanhos: proprios.length ? proprios : sep.tamanhos };
      })
      .filter((c) => c.nome && !vistos.has(c.nome.toLowerCase()) && vistos.add(c.nome.toLowerCase()));
  };
  // cada combinação cor + tamanho que o cliente pode pedir; a chave "codigo|cor|tamanho" identifica a linha no pedido
  const variacoes = (p) => {
    const cores = coresDe(p);
    return (cores.length ? cores : [null]).flatMap((c) => (c && c.tamanhos.length ? c.tamanhos : tamanhosDe(p)).map((tam) => ({ p, cor: c ? c.nome : '', corInfo: c, tam, chave: `${p.id}|${c ? c.nome : ''}|${tam}` })));
  };
  const variacaoPorChave = new Map(PRODUTOS.flatMap((p) => variacoes(p).map((v) => [v.chave, v])));
  const rotuloVar = (v) => (v.cor ? `${v.cor} · ${v.tam}` : v.tam);
  const bolinha = (c) => (c && c.hex ? `<i class="var__cor" style="--c:${c.hex}" aria-hidden="true"></i>` : '');


  // aviso "siga no Instagram e ganhe desconto" (some se o desconto for 0 ou se não houver perfis)
  const ICONE_INSTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9"/></svg>';
  const blocoInsta = $('#desconto');
  if (blocoInsta && window.CHERRY_CONFIG.descontoSeguir !== undefined) {
    const desconto = Number(window.CHERRY_CONFIG.descontoSeguir) || 0;
    const perfis = (window.CHERRY_CONFIG.perfisInstagram || []).filter(Boolean);
    blocoInsta.hidden = !(desconto > 0 && perfis.length);
    $$('[data-desconto-seguir]').forEach((el) => { el.textContent = `${desconto}%`; });
    $('#insta-perfis').innerHTML = perfis.map((u) => `<a href="https://www.instagram.com/${encodeURIComponent(u)}/" target="_blank" rel="noopener">${ICONE_INSTA}@${esc(u)}</a>`).join('');
  }

  // botões de WhatsApp: abrem a conversa com a mensagem pronta
  if (whatsapp) {
    $$('[data-whatsapp]').forEach((el) => {
      el.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagemConsulta)}`;
    });
  } else {
    // sem número configurado (painel → Contato): o botão avisa em vez de abrir um link quebrado
    $$('[data-whatsapp]').forEach((el) => {
      el.removeAttribute('target');
      el.addEventListener('click', (e) => { e.preventDefault(); mostraToast('O contato por WhatsApp ainda está sendo configurado.'); });
    });
  }

  /* ---------- Ilustração da peça (enquanto não há foto) ---------- */

  // corpo + reflexo (gradiente #brilho definido no index.html)
  const peca = (d, cor) => `<path d="${d}" fill="${cor}"/><path d="${d}" fill="url(#brilho)"/>`;
  const caixa = (x, y, w, h, r, cor) => peca(`M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`, cor);
  // costuras e recortes
  const fio = (d, cor, larg = 2.4, op = 1, extra = '') => `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${larg}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"${extra}/>`;
  // monograma "CF" bordado: a assinatura das peças (x = centro do desenho)
  const monograma = (x, y, cor, s = 1) => `<text x="${x + 4 * s}" y="${y + 6 * s}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="${(15 * s).toFixed(1)}" letter-spacing=".6" fill="${cor}">CF</text>`;

  // cada peça é desenhada no seu tamanho natural e depois centralizada (cy) e ampliada (s) para caber no quadro
  const centra = (cy, s, desenho) => `<g transform="translate(100 110) scale(${s}) translate(-100 ${-cy})">${desenho}</g>`;

  const DESENHOS = {
    legging: (c) =>
      peca('M64 44H136Q142 44 142 50L141 76Q141 112 134 150L127 198Q126 204 120 204H114Q108 204 108 198L105 120Q103 108 100 106Q97 108 95 120L92 198Q92 204 86 204H80Q74 204 73 198L66 150Q59 112 59 76L58 50Q58 44 64 44Z', c.corpo) +
      fio('M100 50V106', c.tampa, 1.6, .5) +
      fio('M66 56Q62 100 72 150L77 196', c.tampa, 2.6, .85) + fio('M134 56Q138 100 128 150L123 196', c.tampa, 2.6, .85) +
      caixa(58, 24, 84, 26, 9, c.tampa) +
      fio('M64 37H136', c.corpo, 1.4, .35) +
      monograma(80, 100, c.texto, .9),

    biker: (c) =>
      peca('M64 44H136Q142 44 142 50L141 76Q141 108 136 130L134 142Q134 148 128 148H112Q107 148 107 142L105 116Q103 108 100 106Q97 108 95 116L93 142Q93 148 88 148H72Q66 148 66 142L64 130Q59 108 59 76L58 50Q58 44 64 44Z', c.corpo) +
      fio('M100 50V106', c.tampa, 1.6, .5) +
      fio('M66.5 139H93', c.tampa, 2.4, .9) + fio('M107 139H133.5', c.tampa, 2.4, .9) +
      caixa(58, 24, 84, 26, 9, c.tampa) +
      fio('M64 37H136', c.corpo, 1.4, .35) +
      monograma(76, 100, c.texto, .85),

    shorts: (c) =>
      peca('M62 44H138Q144 44 144 50L150 124Q150 130 144 130H112Q106 130 105 124L102 98Q100 94 98 98L95 124Q94 130 88 130H56Q50 130 50 124L56 50Q56 44 62 44Z', c.corpo) +
      fio('M64 56L58 122', c.tampa, 2.6, .85) + fio('M136 56L142 122', c.tampa, 2.6, .85) +
      caixa(58, 26, 84, 24, 9, c.tampa) +
      fio('M96 50Q92 60 91 70M104 50Q108 60 109 70', c.texto, 2, .9) +
      `<circle cx="91" cy="71" r="2" fill="${c.texto}"/><circle cx="109" cy="71" r="2" fill="${c.texto}"/>` +
      monograma(66, 104, c.texto, .9),

    top: (c) =>
      peca('M72 22Q76 22 78 28Q82 60 100 70Q118 60 122 28Q124 22 128 22Q132 22 133 28Q136 66 146 82Q150 90 148 100L148 118Q148 126 140 126H60Q52 126 52 118L52 100Q50 90 54 82Q64 66 67 28Q68 22 72 22Z', c.corpo) +
      fio('M60 92Q82 100 100 72', c.tampa, 1.8, .6) + fio('M140 92Q118 100 100 72', c.tampa, 1.8, .6) +
      fio('M100 74V104', c.tampa, 1.6, .5) +
      caixa(52, 104, 96, 24, 8, c.tampa) +
      monograma(96, 114, c.texto, 1),

    regata: (c) =>
      peca('M66 18H80Q84 54 100 60Q116 54 120 18H134Q140 60 158 92L152 178Q152 188 144 188H56Q48 188 48 178L42 92Q60 60 66 18Z', c.corpo) +
      fio('M80 22Q84 50 100 56Q116 50 120 22', c.tampa, 2, .8) +
      fio('M49 176H151', c.tampa, 3, .9) +
      fio('M52 100Q60 70 66 40M148 100Q140 70 134 40', c.tampa, 1.4, .35) +
      monograma(96, 112, c.texto, 1.3),

    macacao: (c) =>
      peca('M74 14H86L88 40Q94 56 100 58Q106 56 112 40L114 14H126Q130 14 130 20Q132 48 142 66L138 98Q144 112 142 130L130 204H108L104 130Q100 122 96 130L92 204H70L58 130Q56 112 62 98L58 66Q68 48 70 20Q70 14 74 14Z', c.corpo) +
      fio('M62 98Q100 110 138 98', c.tampa, 3.2, .95) +
      fio('M64 104Q59 150 71 200', c.tampa, 2.4, .8) + fio('M136 104Q141 150 129 200', c.tampa, 2.4, .8) +
      fio('M88 42Q94 56 100 58Q106 56 112 42', c.tampa, 1.8, .7) +
      monograma(96, 84, c.texto, 1),

    flare: (c) =>
      peca('M66 40H134Q146 70 146 100Q150 150 156 190Q164 214 172 232H108Q106 190 104 150Q102 120 100 108Q98 120 96 150Q94 190 92 232H28Q36 214 44 190Q50 150 54 100Q54 70 66 40Z', c.corpo) +
      fio('M72 58Q64 140 40 228', c.tampa, 2.2, .55) + fio('M128 58Q136 140 160 228', c.tampa, 2.2, .55) +
      caixa(62, 20, 76, 34, 10, c.tampa) +
      monograma(96, 32, c.texto, 1.2),

    jaqueta: (c) =>
      peca('M66 30Q74 24 84 24H116Q126 24 134 30L170 62L162 150H146L142 72V160Q142 166 136 166H64Q58 166 58 160V72L54 150H38L30 62Z', c.corpo) +
      caixa(58, 150, 84, 17, 6, c.tampa) +
      peca('M37.1 140H54.5L54 150H38Z', c.tampa) + peca('M145.5 140H161.2L162 150H146Z', c.tampa) +
      peca('M82 22H118Q119 22 119 24V36Q100 44 81 36V24Q81 22 82 22Z', c.tampa) +
      fio('M100 42V160', c.texto, 3, .85, ' stroke-dasharray="2 2.6"') +
      monograma(72, 70, c.texto, .85),
  };
  DESENHOS.conjunto = (c) =>
    `<g transform="translate(40 6) scale(.6)">${DESENHOS.top(c)}</g><g transform="translate(32 78) scale(.68)">${DESENHOS.biker(c)}</g>`;
  DESENHOS['conjunto-flare'] = (c) =>
    `<g transform="translate(41 4) scale(.62)">${DESENHOS.top(c)}</g><g transform="translate(45 76) scale(.56)">${DESENHOS.flare(c)}</g>`;

  // [centro vertical natural, ampliação]
  const FORMAS = {
    legging:  (c) => centra(114, 1.0, DESENHOS.legging(c)),
    biker:    (c) => centra(86, 1.4, DESENHOS.biker(c)),
    shorts:   (c) => centra(78, 1.55, DESENHOS.shorts(c)),
    top:      (c) => centra(75, 1.5, DESENHOS.top(c)),
    regata:   (c) => centra(103, 1.05, DESENHOS.regata(c)),
    macacao:  (c) => centra(109, .95, DESENHOS.macacao(c)),
    flare:    (c) => centra(126, .85, DESENHOS.flare(c)),
    conjunto: (c) => centra(99, 1.1, DESENHOS.conjunto(c)),
    'conjunto-flare': (c) => centra(112, .95, DESENHOS['conjunto-flare'](c)),
    jaqueta:  (c) => centra(95, 1.2, DESENHOS.jaqueta(c)),
  };
  const ARTE_BASE = { forma: 'legging', corpo: '#2a2326', tampa: '#e35f68', texto: '#ffffff' };

  // corpo: cor da ilustração (só usada quando não há foto), para mostrar a peça na cor da variação
  function midia(p, comAlt = true, corpo = '') {
    if (p.imagem) return `<img src="${esc(p.imagem)}" alt="${comAlt ? esc(`${marcaPorId[p.marca].nome} ${p.nome}`) : ''}" loading="lazy" decoding="async">`;
    const arte = { ...ARTE_BASE, ...(p.arte || {}), ...(corpo ? { corpo } : {}) };
    const forma = FORMAS[arte.forma] || FORMAS.legging;
    return `<svg class="arte" viewBox="0 0 200 220" aria-hidden="true" focusable="false">${forma(arte)}</svg>`;
  }

  function selo(p) {
    const desconto = temPreco(p) && p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
    if (desconto > 0) return `<span class="produto__selo">-${desconto}%</span>`;
    if (p.selo) return `<span class="produto__selo produto__selo--novo">${esc(p.selo)}</span>`;
    return '';
  }

  function preco(p) {
    if (!temPreco(p)) return '<p class="produto__preco produto__preco--breve">Preço em breve</p>';
    return `<p class="produto__preco">
        <strong>${moeda(p.preco)}</strong>
        ${p.precoAntigo ? `<s><span class="sr-only">preço anterior </span>${moeda(p.precoAntigo)}</s>` : ''}
      </p>`;
  }

  /* ---------- Pedido (carrinho) ---------- */

  // pedido = { "codigo|cor|tamanho": quantidade }
  const CHAVE = 'cherry-fitwear:pedido-v2';
  const CHAVE_OBS = 'cherry-fitwear:obs';
  let pedido = {};
  try { pedido = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { pedido = {}; }
  try { localStorage.removeItem('cherry-fitwear:pedido'); } catch { /* sem armazenamento */ }
  // descarta linhas de peças ou tamanhos que não existem mais
  for (const k of Object.keys(pedido)) {
    const v = variacaoPorChave.get(k);
    if (!v || !temPreco(v.p) || !(pedido[k] > 0)) delete pedido[k];
  }
  const salva = () => { try { localStorage.setItem(CHAVE, JSON.stringify(pedido)); } catch { /* sem armazenamento: segue só na sessão */ } };

  // observações do pedido (tamanhos, cores, grade): vão junto na mensagem do WhatsApp
  const campoObs = $('#carrinho-obs');
  if (campoObs) {
    try { campoObs.value = localStorage.getItem(CHAVE_OBS) || ''; } catch { /* sem armazenamento */ }
    campoObs.addEventListener('input', () => { try { localStorage.setItem(CHAVE_OBS, campoObs.value); } catch { /* sem armazenamento */ } });
  }

  const unidades = () => Object.values(pedido).reduce((s, q) => s + q, 0);
  const total = () => Object.entries(pedido).reduce((s, [k, q]) => s + variacaoPorChave.get(k).p.preco * q, 0);
  const qtdDoProduto = (id) => Object.entries(pedido).reduce((s, [k, q]) => (k.startsWith(`${id}|`) ? s + q : s), 0);

  // as linhas do pedido agrupadas por peça, na ordem em que cada peça entrou
  function pedidoPorPeca() {
    const grupos = new Map();
    for (const [k, q] of Object.entries(pedido)) {
      const v = variacaoPorChave.get(k);
      if (!grupos.has(v.p.id)) grupos.set(v.p.id, { p: v.p, linhas: [] });
      grupos.get(v.p.id).linhas.push({ v, q });
    }
    return [...grupos.values()];
  }

  function seletorQtd(nome, q, extra = '') {
    return `<div class="qtd ${extra}">
        <button type="button" data-f="menos" aria-label="Diminuir quantidade de ${esc(nome)}">−</button>
        <input type="number" inputmode="numeric" min="0" max="999" value="${q}" data-f="qtd" aria-label="Quantidade de ${esc(nome)}">
        <button type="button" data-f="mais" aria-label="Aumentar quantidade de ${esc(nome)}">+</button>
      </div>`;
  }

  // botão do card: abre a peça para escolher tamanho (e cor) e quantidades
  function acao(p) {
    if (!temPreco(p)) return '<button class="btn-add" type="button" disabled>Em breve</button>';
    const n = qtdDoProduto(p.id);
    const sr = `<span class="sr-only"> ${esc(p.nome)}</span>`;
    if (n) return `<button class="btn-add btn-add--no-pedido" type="button" data-f="escolher">✓ ${n} no pedido · editar${sr}</button>`;
    return `<button class="btn-add" type="button" data-f="escolher">${coresDe(p).length ? 'Escolher cor e tamanho' : 'Escolher tamanho'}${sr}</button>`;
  }

  // miniatura da linha: foto da cor, senão a foto da peça, senão a ilustração na cor da variação
  function miniatura(p, v) {
    const foto = v.corInfo && v.corInfo.imagem;
    if (foto) return `<img src="${esc(foto)}" alt="" loading="lazy" decoding="async">`;
    return midia(p, false, v.corInfo ? v.corInfo.hex : '');
  }

  // bloco "Escolha as variações" da página da peça: uma linha por cor + tamanho (MENTA P, MENTA M, MENTA G…)
  function blocoVariacoes(p) {
    if (!temPreco(p)) return '';
    const comCor = coresDe(p).length > 0;
    let corAnterior = null;
    const linhas = variacoes(p).map((v) => {
      const q = pedido[v.chave] || 0;
      const nome = `${v.cor ? `${v.cor}, ` : ''}tamanho ${v.tam}, ${p.nome}`;
      const nova = corAnterior !== null && v.cor !== corAnterior;
      corAnterior = v.cor;
      return `<li class="var${q ? ' var--ativa' : ''}${nova ? ' var--nova-cor' : ''}" data-id="${p.id}" data-v="${esc(v.chave)}">
          <span class="var__foto">${miniatura(p, v)}</span>
          <span class="var__nome">${bolinha(v.corInfo)}<span>${v.cor ? `${esc(v.cor)} ${esc(v.tam)}` : `Tamanho ${esc(v.tam)}`}</span></span>
          ${seletorQtd(nome, q)}
        </li>`;
    }).join('');
    return `<section class="variacoes" data-id="${p.id}" aria-labelledby="variacoes-titulo">
        <h3 class="variacoes__titulo" id="variacoes-titulo">${comCor ? 'Escolha as variações' : 'Escolha o tamanho'}</h3>
        <p class="variacoes__ajuda">Toque em + para dizer quantas peças de cada ${comCor ? 'cor e tamanho' : 'tamanho'} você quer.</p>
        <ul class="variacoes__lista">${linhas}</ul>
        <p class="variacoes__resumo" aria-live="polite"></p>
        <button class="btn btn--primario variacoes__ver" type="button" data-f="ver-pedido" hidden></button>
      </section>`;
  }

  // resumo e botão "Ver pedido" da página da peça
  function atualizaResumo(id) {
    const p = produtoPorId[id];
    const n = qtdDoProduto(id);
    const todas = unidades();
    $$(`.variacoes[data-id="${id}"]`).forEach((bloco) => {
      $('.variacoes__resumo', bloco).textContent = n ? `${pecas(n)} deste modelo · ${moeda(n * p.preco)}` : 'Nenhuma peça escolhida ainda.';
      const ver = $('.variacoes__ver', bloco);
      ver.hidden = !todas;
      ver.textContent = `Ver pedido · ${pecas(todas)}`;
    });
  }

  function cartao(p) {
    const m = marcaPorId[p.marca];
    const link = `href="#produto=${p.id}" data-ver="${p.id}"`;
    return `<article class="produto" data-id="${p.id}">
      <a class="produto__midia" ${link} tabindex="-1" aria-hidden="true">${midia(p, false)}${selo(p)}</a>
      <div class="produto__info">
        <p class="produto__marca">${esc(m.nome)}</p>
        <h3 class="produto__nome"><a ${link}>${esc(p.nome)}</a></h3>
        <p class="produto__tipo">${esc(p.tipo)}</p>
        <a class="produto__detalhes" ${link} tabindex="-1" aria-hidden="true">Ver detalhes</a>
        ${preco(p)}
        <div class="produto__acao" data-id="${p.id}">${acao(p)}</div>
      </div>
    </article>`;
  }

  // recoloca o foco no controle equivalente depois de redesenhar
  const FOCO_ALTERNATIVO = { escolher: 'escolher', mais: 'menos', menos: 'mais', qtd: 'mais', remover: null };
  function comFoco(raiz, desenha) {
    const ativo = document.activeElement;
    const papel = ativo && raiz.contains(ativo) ? ativo.dataset.f : null;
    // a linha do pedido (data-v) vale mais que a peça (data-id): uma peça pode ter várias linhas
    const dono = papel ? ativo.closest('[data-v], [data-id]') : null;
    const attr = dono?.dataset.v ? 'data-v' : 'data-id';
    const valor = dono ? (dono.dataset.v || dono.dataset.id) : null;
    desenha();
    if (!papel || !valor) return;
    const dentro = `[${attr}="${CSS.escape(valor)}"]`;
    const alvo = $(`${dentro} [data-f="${papel}"]`, raiz) || $(`${dentro} [data-f="${FOCO_ALTERNATIVO[papel]}"]`, raiz);
    (alvo || $('[data-foco]', raiz.closest('.painel') || document) || raiz).focus?.();
  }

  // atualiza o botão do produto em todos os cards
  function atualizaAcoes(id) {
    const p = produtoPorId[id];
    $$(`.produto__acao[data-id="${id}"]`).forEach((el) => comFoco(el, () => { el.innerHTML = acao(p); }));
  }

  const toast = $('#toast');
  let toastTempo;
  function mostraToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visivel');
    clearTimeout(toastTempo);
    toastTempo = setTimeout(() => toast.classList.remove('visivel'), 3000);
  }

  // mostra a quantidade de uma linha em todos os lugares, sem redesenhar a lista da página da peça (o foco fica onde está)
  function sincroniza(chave) {
    const id = variacaoPorChave.get(chave).p.id;
    const q = pedido[chave] || 0;
    atualizaAcoes(id);
    $$(`.variacoes .var[data-v="${CSS.escape(chave)}"]`).forEach((linha) => {
      linha.classList.toggle('var--ativa', q > 0);
      $('[data-f="qtd"]', linha).value = q;
    });
    atualizaResumo(id);
    atualizaCarrinho();
  }

  function defineQtd(chave, qtd) {
    const v = variacaoPorChave.get(chave);
    if (!v || !temPreco(v.p)) return;
    const antes = pedido[chave] || 0;
    const primeira = qtdDoProduto(v.p.id) === 0;
    qtd = Math.max(0, Math.min(999, Math.floor(Number(qtd)) || 0));
    if (qtd !== antes) {
      if (qtd) pedido[chave] = qtd; else delete pedido[chave];
      salva();
    }
    sincroniza(chave);
    if (primeira && qtd) mostraToast('Adicionado ao pedido.');
  }

  /* ---------- Painel do pedido ---------- */

  const botaoCarrinho = $('.topo__carrinho');
  const contador = $('.topo__contador');
  const lista = $('#carrinho-lista');
  const vazio = $('#carrinho-vazio');
  const subtotal = $('#carrinho-subtotal');
  const finalizar = $('#carrinho-finalizar');
  const esvaziar = $('#carrinho-esvaziar');

  const pecasTexto = $('#carrinho-pecas');

  // uma peça com uma linha para cada tamanho (ou cor + tamanho) pedido
  function itemCarrinho({ p, linhas }) {
    const antigo = p.precoAntigo ? `<s>${moeda(p.precoAntigo)}</s> ` : '';
    const porLinha = linhas.map(({ v, q }) => `<li class="item__var" data-v="${esc(v.chave)}">
          <span class="item__tam">${bolinha(v.corInfo)}${esc(rotuloVar(v))}</span>
          ${seletorQtd(`${rotuloVar(v)}, ${p.nome}`, q, 'qtd--mini')}
          <strong>${moeda(p.preco * q)}</strong>
          <button class="item__remover" type="button" data-f="remover" aria-label="Remover ${esc(p.nome)} ${esc(rotuloVar(v))} do pedido">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </li>`).join('');
    return `<li class="item" data-id="${p.id}">
      <div class="item__topo">
        <div class="item__midia">${midia(p, false)}</div>
        <div class="item__info">
          <p class="item__marca">${esc(marcaPorId[p.marca].nome)}</p>
          <p class="item__nome">${esc(p.nome)}</p>
          <p class="item__un">${antigo}${moeda(p.preco)} / un.</p>
        </div>
      </div>
      <ul class="item__vars">${porLinha}</ul>
    </li>`;
  }

  function atualizaCarrinho() {
    const grupos = pedidoPorPeca();
    const un = unidades();

    contador.hidden = !un;
    contador.textContent = un > 99 ? '99+' : un;
    botaoCarrinho.setAttribute('aria-label', un ? `Abrir pedido (${pecas(un)})` : 'Abrir pedido');

    comFoco(lista, () => { lista.innerHTML = grupos.map(itemCarrinho).join(''); });
    vazio.hidden = grupos.length > 0;
    pecasTexto.textContent = pecas(un);
    subtotal.textContent = moeda(total());
    finalizar.disabled = !grupos.length;
    esvaziar.hidden = !grupos.length;
  }

  // texto de uma peça no pedido: tamanhos (por cor, quando há) e quanto fica
  function textoPeca({ p, linhas }) {
    const porCor = new Map();
    for (const { v, q } of linhas) {
      if (!porCor.has(v.cor)) porCor.set(v.cor, []);
      porCor.get(v.cor).push(`${v.tam} x${q}`);
    }
    const un = linhas.reduce((s, l) => s + l.q, 0);
    // o nome da coleção só entra se o nome da peça ainda não trouxer (ex.: "Calça Flare Signature")
    const colecao = marcaPorId[p.marca].nome;
    return [
      `• ${normaliza(p.nome).includes(normaliza(colecao)) ? '' : `${colecao} `}${p.nome}`,
      ...[...porCor].map(([cor, tams]) => `   ${cor ? `${cor}: ` : 'Tamanhos: '}${tams.join(' · ')}`),
      `   ${un} un. x ${moeda(p.preco)} = *${moeda(p.preco * un)}*`,
    ].join('\n');
  }

  finalizar.addEventListener('click', () => {
    const grupos = pedidoPorPeca();
    if (!grupos.length) return;
    const obs = (campoObs ? campoObs.value : '').trim();
    // pedido em texto (o *negrito* é formatação do WhatsApp)
    const mensagem = [
      '*Pedido — Cherry Fitwear*',
      'Olá! Montei meu pedido no site e quero finalizar:',
      '',
      ...grupos.map(textoPeca),
      '',
      `Peças: *${unidades()}*`,
      `*Total: ${moeda(total())}*`,
      ...(obs ? ['', '*Observações:*', obs] : []),
      '',
      'Aguardo a confirmação da disponibilidade para combinarmos o pagamento e a entrega.',
    ].join('\n');
    if (!whatsapp) {
      console.warn('Cherry Fitwear: defina CHERRY_CONFIG.whatsapp em js/produtos.js (ou no painel) para receber os pedidos.');
      mostraToast('O envio de pedidos ainda está sendo configurado.');
      return;
    }
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });

  esvaziar.addEventListener('click', () => {
    if (!window.confirm('Remover todas as peças do pedido?')) return;
    const chaves = Object.keys(pedido);
    pedido = {};
    salva();
    chaves.forEach(sincroniza);
    atualizaCarrinho();
    $('[data-foco]', $('#carrinho'))?.focus();
  });

  // cliques e digitação em qualquer seletor de quantidade (cards, detalhes e pedido)
  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-f]');
    if (!alvo) return;
    const f = alvo.dataset.f;
    if (f === 'escolher') {   // botão do card: abre a peça para escolher tamanho e quantidades
      const id = alvo.closest('[data-id]')?.dataset.id;
      if (produtoPorId[id]) abreDetalhe(id, alvo);
      return;
    }
    if (f === 'ver-pedido') { window.CherryPaineis.abrir('carrinho', alvo); return; }
    const chave = alvo.closest('[data-v]')?.dataset.v;
    if (!variacaoPorChave.has(chave)) return;
    const q = pedido[chave] || 0;
    switch (f) {
      case 'mais':
        defineQtd(chave, q + 1);
        mostraFotoDaCor(variacaoPorChave.get(chave));
        break;
      case 'menos': defineQtd(chave, q - 1); break;
      case 'remover': defineQtd(chave, 0); break;
      default:
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.dataset?.f !== 'qtd') return;
    const chave = e.target.closest('[data-v]')?.dataset.v;
    if (variacaoPorChave.has(chave)) defineQtd(chave, e.target.value);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.dataset?.f === 'qtd') e.target.blur();
  });

  /* ---------- Detalhes do produto ---------- */

  const detalhe = $('#detalhe');
  const conteudoDetalhe = $('#detalhe-conteudo');

  function textoDetalhe(d) {
    if (!d) return '<p class="detalhe__resumo detalhe__resumo--breve">Descrição completa em breve.</p>';
    const secao = (titulo, corpo) => `<section class="detalhe__secao"><h3>${esc(titulo)}</h3>${corpo}</section>`;
    return [
      d.resumo && `<p class="detalhe__resumo">${esc(d.resumo)}</p>`,
      d.serve && secao('Para quais treinos?', `<p>${esc(d.serve)}</p>`),
      d.beneficios?.length && secao('Principais diferenciais', `<ul class="detalhe__beneficios">${d.beneficios.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`),
      d.ativos?.length && secao(d.tituloAtivos || 'Tecido e acabamento', `<dl class="detalhe__ativos">${d.ativos.map(([nome, texto]) => `<div><dt>${esc(nome)}</dt><dd>${esc(texto)}</dd></div>`).join('')}</dl>`),
      d.extra && secao(d.extra.titulo, `<p>${esc(d.extra.texto)}</p>`),
      d.rotina?.length && secao('Como combinar', d.rotina.map((t) => `<p>${esc(t)}</p>`).join('')),
      d.importante && `<p class="detalhe__importante"><strong>Importante:</strong> ${esc(d.importante)}</p>`,
    ].filter(Boolean).join('');
  }

  // detalhes: foto principal grande + miniaturas quando o produto tem mais de uma foto
  function midiaDetalhe(p) {
    const fotos = [p.imagem, ...(p.galeria || [])].filter(Boolean);
    if (fotos.length < 2) return `<div class="detalhe__midia">${midia(p)}${selo(p)}</div>`;
    const alt = esc(`${marcaPorId[p.marca].nome} ${p.nome}`);
    return `<div class="detalhe__galeria">
      <div class="detalhe__midia"><img src="${esc(fotos[0])}" alt="${alt}" decoding="async" data-principal>${selo(p)}</div>
      <ul class="detalhe__miniaturas">${fotos.map((f, i) => `<li><button type="button" data-foto="${esc(f)}" aria-label="Ver a foto ${i + 1} de ${fotos.length}"${i === 0 ? ' aria-current="true"' : ''}><img src="${esc(f)}" alt="" loading="lazy" decoding="async"></button></li>`).join('')}</ul>
    </div>`;
  }

  function abreDetalhe(id, gatilho) {
    const p = produtoPorId[id];
    if (!p) return;
    const m = marcaPorId[p.marca];
    conteudoDetalhe.innerHTML = `
      ${midiaDetalhe(p)}
      <div class="detalhe__info">
        <p class="detalhe__marca">${esc(m.nome)}</p>
        <h2 class="detalhe__nome" id="detalhe-nome">${esc(p.nome)}</h2>
        <p class="detalhe__tipo">${esc(p.tipo)}</p>
        <div class="detalhe__compra">
          ${preco(p)}
          ${blocoVariacoes(p)}
        </div>
        <div class="detalhe__texto">${textoDetalhe(DESCRICOES[p.id])}</div>
      </div>`;
    atualizaResumo(p.id);
    conteudoDetalhe.scrollTop = 0;
    window.CherryPaineis.abrir('detalhe', gatilho);
    history.replaceState(null, '', `#produto=${id}`);
  }

  function trocaFoto(caminho) {
    const principal = $('[data-principal]', conteudoDetalhe);
    if (!principal) return;
    principal.src = caminho;
    $$('[data-foto]', conteudoDetalhe).forEach((x) => { if (x.dataset.foto === caminho) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
  }

  // trocar a foto grande ao tocar numa miniatura
  conteudoDetalhe.addEventListener('click', (e) => {
    const b = e.target.closest('[data-foto]');
    if (b) trocaFoto(b.dataset.foto);
  });

  // ao escolher uma cor, a foto grande mostra a peça nessa cor (se a cor tiver foto)
  function mostraFotoDaCor(v) {
    const foto = v && v.corInfo && v.corInfo.imagem;
    if (foto) trocaFoto(foto);
  }

  detalhe.addEventListener('painelfechado', () => {
    if (location.hash.startsWith('#produto=')) history.replaceState(null, '', location.pathname + location.search);
  });

  // link direto para um produto (ex.: index.html#produto=power-legging-compressao)
  document.addEventListener('DOMContentLoaded', () => {
    const achado = location.hash.match(/^#produto=([\w-]+)$/);
    if (achado && produtoPorId[achado[1]]) abreDetalhe(achado[1]);
  });

  /* ---------- Marcas, promoções e catálogo ---------- */

  const estado = { categoria: 'todos', marca: null, busca: '' };
  const catalogo = $('#catalogo');
  const grade = $('#grade-catalogo');
  const contagem = $('#catalogo-contagem');
  const ativos = $('#filtros-ativos');

  $('#lista-marcas').innerHTML = MARCAS.map((m) => `
    <li>
      <button class="marca-item" type="button" data-marca="${m.id}" aria-pressed="false">
        <span class="marca-item__logo marca-item__logo--${m.estilo}" style="--cor:${m.cor};--fundo:${m.fundo || '#fff'}" aria-hidden="true">${esc(m.logo)}</span>
        <span class="marca-item__nome">${esc(m.nome)}<small>${[m.sub, (() => { const n = PRODUTOS.filter((p) => p.marca === m.id).length; return `${n} ${n === 1 ? 'peça' : 'peças'}`; })()].filter(Boolean).map(esc).join(' · ')}</small></span>
      </button>
    </li>`).join('');

  // logos compridos quebram em linhas e encolhem até caber no círculo (os que já cabem não mudam)
  function ajustaLogos() {
    $$('.marca-item__logo').forEach((el) => {
      el.classList.remove('marca-item__logo--longo');
      el.style.fontSize = '';
      const cabe = () => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight;
      if (cabe()) return;
      el.classList.add('marca-item__logo--longo');
      let tam = parseFloat(getComputedStyle(el).fontSize);
      const minimo = tam * 0.5;
      while (!cabe() && tam > minimo) { tam -= 0.5; el.style.fontSize = `${tam}px`; }
    });
  }
  ajustaLogos();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustaLogos);

  /* ---------- Vitrine do hero e categorias ---------- */

  const SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const etiqueta = (p) => {
    const desconto = temPreco(p) && p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
    return desconto > 0 ? `-${desconto}%` : (p.selo || '');
  };

  // categorias da loja: [código, nome, nome curto (menu do topo)]. O código é o "categoria" de cada peça;
  // o painel (admin.html e js/admin-core.js) usa esta mesma lista. Só aparecem na loja as que já têm peças.
  const CATEGORIAS = [
    ['leggings', 'Leggings e calças', 'Leggings'],
    ['tops', 'Tops'],
    ['blusas', 'Blusas'],
    ['shorts', 'Shorts'],
    ['macacao', 'Macacão'],
    ['conjunto-calca', 'Conjunto calça'],
    ['conjunto-short', 'Conjunto short'],
    ['jaquetas', 'Jaquetas'],
    ['masculino', 'Masculino'],
    ['moda-evangelica', 'Moda Evangélica'],
    ['acessorios', 'Acessórios'],
  ];
  const categoriasComPecas = CATEGORIAS.filter(([id]) => PRODUTOS.some((p) => p.categoria === id));

  // links de categoria do menu, do menu do celular e do rodapé, e os botões de filtro do catálogo
  $$('[data-nav-categorias]').forEach((ul) => {
    const max = Number(ul.dataset.navCategorias) || categoriasComPecas.length;
    ul.insertAdjacentHTML('afterbegin', categoriasComPecas.slice(0, max).map(([id, nome, curto]) => `<li><a href="#catalogo" data-categoria="${id}">${esc(ul.hasAttribute('data-nav-curto') && curto ? curto : nome)}</a></li>`).join(''));
  });
  const grupoFiltros = $('.filtros__grupo');
  if (grupoFiltros) grupoFiltros.insertAdjacentHTML('beforeend', categoriasComPecas.map(([id, nome]) => `<button class="chip" type="button" data-categoria="${id}" aria-pressed="false">${esc(nome)}</button>`).join(''));

  // 3 peças em destaque no topo: a primeira com preço de cada categoria, completando com as demais se faltar
  const vitrine = $('#hero-vitrine');
  if (vitrine) {
    const destaques = [];
    for (const [cat] of CATEGORIAS) {
      if (destaques.length >= 3) break;
      const p = PRODUTOS.find((x) => x.categoria === cat && temPreco(x));
      if (p) destaques.push(p);
    }
    for (const p of PRODUTOS) { if (destaques.length >= 3) break; if (temPreco(p) && !destaques.includes(p)) destaques.push(p); }
    vitrine.innerHTML = destaques.slice(0, 3).map((p, n) => {
      const tag = etiqueta(p);
      return `<a class="vit" style="--n:${n}" href="#produto=${p.id}" data-ver="${p.id}">
        <span class="vit__arte">${midia(p, false)}</span>
        ${tag ? `<span class="vit__tag">${esc(tag)}</span>` : ''}
        <span class="vit__marca">${esc(marcaPorId[p.marca].nome)}</span>
        <span class="vit__nome">${esc(p.nome)}</span>
        <span class="vit__preco">${moeda(p.preco)}${p.precoAntigo ? `<s>${moeda(p.precoAntigo)}</s>` : ''}</span>
      </a>`;
    }).join('');
  }

  const listaCategorias = $('#lista-categorias');
  if (listaCategorias) {
    listaCategorias.innerHTML = CATEGORIAS.map(([id, nome]) => {
      const itens = PRODUTOS.filter((p) => p.categoria === id);
      if (!itens.length) return '';
      return `<a class="cat" href="#catalogo" data-categoria="${id}">
        <span class="cat__arte">${midia(itens[0], false)}</span>
        <span class="cat__texto"><span><strong class="cat__nome">${nome}</strong><span class="cat__qtd">${itens.length} ${itens.length === 1 ? 'peça' : 'peças'}</span></span><span class="cat__seta">${SETA}</span></span>
      </a>`;
    }).join('');
  }

  const promocoes = PRODUTOS.filter((p) => temPreco(p) && p.precoAntigo);
  $('#grade-promocoes').innerHTML = promocoes.map(cartao).join('');
  $('#promocoes').closest('.faixa-branca').hidden = !promocoes.length;
  // nome da seção (editável no painel, aba Vitrine); vazio mantém o texto padrão do HTML
  const nomePromo = String(window.CHERRY_CONFIG.tituloPromocoes || '').trim();
  const sobrePromo = String(window.CHERRY_CONFIG.sobreTituloPromocoes || '').trim();
  if (nomePromo) $('#promocoes-titulo').textContent = nomePromo;
  if (sobrePromo) $('#promocoes-sobre').textContent = sobrePromo;

  // seções extras criadas no painel (CHERRY_CONFIG.secoes), na ordem do painel; só aparecem se tiverem produtos
  const caixaSecoes = $('#secoes-extras');
  if (caixaSecoes) {
    caixaSecoes.innerHTML = (window.CHERRY_CONFIG.secoes || []).map((s) => {
      const itens = [...new Set(s.produtos || [])].map((id) => produtoPorId[id]).filter(Boolean);
      if (!itens.length || !s.titulo) return '';
      const sid = `secao-${esc(s.id)}`;
      return `<section class="secao" id="${sid}" aria-labelledby="${sid}-titulo">
        <div class="secao__topo">
          <h2 class="secao__titulo" id="${sid}-titulo">${esc(s.titulo)}</h2>${s.texto ? `
          <p class="secao__texto">${esc(s.texto)}</p>` : ''}
        </div>
        <div class="produtos">${itens.map(cartao).join('')}</div>
      </section>`;
    }).join('');
  }

  // busca: nome, marca, tipo e ativos pesam mais; resumo e benefícios entram como complemento
  const indice = Object.fromEntries(PRODUTOS.map((p) => {
    const d = DESCRICOES[p.id] || {};
    return [p.id, {
      principal: normaliza([marcaPorId[p.marca].nome, p.nome, p.tipo, ...(d.ativos || []).map((a) => a[0])].join(' ')),
      extra: normaliza([d.resumo, d.serve, ...(d.beneficios || [])].filter(Boolean).join(' ')),
    }];
  }));

  function filtrados() {
    const termos = normaliza(estado.busca).split(/\s+/).filter(Boolean);
    return PRODUTOS
      .filter((p) => (estado.categoria === 'todos' || p.categoria === estado.categoria) && (!estado.marca || p.marca === estado.marca))
      .map((p) => {
        if (!termos.length) return { p, nota: 1 };
        const { principal, extra } = indice[p.id];
        if (termos.every((t) => principal.includes(t))) return { p, nota: 2 };
        if (termos.every((t) => principal.includes(t) || extra.includes(t))) return { p, nota: 1 };
        return { p, nota: 0 };
      })
      .filter((r) => r.nota > 0)
      .sort((a, b) => b.nota - a.nota)
      .map((r) => r.p);
  }

  function desenhaCatalogo() {
    const itens = filtrados();
    grade.innerHTML = itens.length
      ? itens.map(cartao).join('')
      : `<div class="vazio">
          <p>${estado.marca && !estado.busca
            ? `As peças da coleção ${esc(marcaPorId[estado.marca].nome)} estão chegando em breve.`
            : 'Nenhuma peça encontrada com esses filtros.'}</p>
          <button class="chip" type="button" data-limpar>Ver todas as peças</button>
        </div>`;
    contagem.textContent = `${itens.length} ${itens.length === 1 ? 'peça' : 'peças'}`;

    $$('[data-categoria]', catalogo).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.categoria === estado.categoria)));
    $$('.marca-item').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.marca === estado.marca)));

    const chips = [];
    if (estado.marca) chips.push(`<button class="chip chip--ativo" type="button" data-tirar="marca">${esc(marcaPorId[estado.marca].nome)}<span aria-hidden="true">×</span><span class="sr-only"> — remover filtro</span></button>`);
    if (estado.busca) chips.push(`<button class="chip chip--ativo" type="button" data-tirar="busca">“${esc(estado.busca)}”<span aria-hidden="true">×</span><span class="sr-only"> — limpar busca</span></button>`);
    ativos.innerHTML = chips.join('');
  }

  const irParaCatalogo = () => catalogo.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  document.addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]');
    const categoria = e.target.closest('[data-categoria]');
    const marca = e.target.closest('[data-marca]');
    const tirar = e.target.closest('[data-tirar]');
    if (ver) {
      e.preventDefault();
      abreDetalhe(ver.dataset.ver, ver.closest('.produto')?.querySelector('.produto__nome a') || ver);
    } else if (categoria) {
      estado.categoria = categoria.dataset.categoria;
      // links do menu (Leggings/Tops/Conjuntos) começam uma navegação limpa
      if (!catalogo.contains(categoria)) { estado.marca = null; estado.busca = ''; }
      desenhaCatalogo();
    } else if (marca) {
      e.preventDefault();
      const id = marca.dataset.marca;
      estado.marca = estado.marca === id && marca.classList.contains('marca-item') ? null : id;
      estado.categoria = 'todos';
      estado.busca = '';
      desenhaCatalogo();
      irParaCatalogo();
    } else if (tirar) {
      estado[tirar.dataset.tirar] = tirar.dataset.tirar === 'marca' ? null : '';
      desenhaCatalogo();
      $('[data-categoria="todos"]', catalogo).focus();
    } else if (e.target.closest('[data-limpar]')) {
      Object.assign(estado, { categoria: 'todos', marca: null, busca: '' });
      desenhaCatalogo();
      $('[data-categoria="todos"]', catalogo).focus();
    }
  });

  // usado pela busca do cabeçalho (js/script.js)
  window.CherryLoja = {
    buscar(termo) {
      Object.assign(estado, { categoria: 'todos', marca: null, busca: termo.trim() });
      desenhaCatalogo();
      irParaCatalogo();
    },
  };

  desenhaCatalogo();
  atualizaCarrinho();
})();
