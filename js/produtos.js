/* =========================================================
   Cherry Fitwear — CATÁLOGO
   Edite aqui preços, nomes, coleções e fotos. O site se atualiza sozinho.
   As descrições completas ficam em js/descricoes.js (mesmo "id").
   ATENÇÃO: as peças abaixo são EXEMPLOS. Troque nomes, preços e fotos pelo painel (admin.html).

   preco        preço de cada peça (null = "Preço em breve": a peça aparece, mas ainda não entra no pedido)
   precoAntigo  opcional — se preenchido, a peça aparece em "Promoções" com o preço riscado
   selo         opcional — etiqueta no card (ex.: 'Lançamento')
   marca        id da COLEÇÃO (Signature, Essential, Seamless…), veja a lista abaixo
   categoria    'leggings' (leggings e calças), 'tops', 'shorts', 'conjuntos' ou 'jaquetas'
   tamanhos     opcional — tamanhos desta peça, ex.: ['P', 'M', 'G']. Sem isso vale a lista "tamanhos" da loja (CHERRY_CONFIG).
   cores        opcional — cores da peça, ex.: ['Preto', 'Vinho']. Com cores, o cliente escolhe a quantidade de cada cor + tamanho.
   imagem       caminho da foto. Deixe '' para usar a ilustração automática da peça.
   arte         ilustração usada enquanto não há foto:
                forma = legging | flare | biker | shorts | top | regata | macacao | conjunto | conjunto-flare | jaqueta
                corpo = cor principal · tampa = cor do cós e dos recortes · texto = cor do monograma CF
   ========================================================= */

window.CHERRY_CONFIG = {
  // Número que recebe os pedidos e as consultas, só dígitos com DDI + DDD (ex.: '5562999998888').
  whatsapp: '',
  // Tamanhos que o cliente pode escolher em cada peça (cada peça pode ter a sua própria lista em "tamanhos")
  tamanhos: ['P', 'M', 'G', 'GG'],
  // Mensagem que já vem escrita quando o cliente toca no botão "WhatsApp" do início da página
  mensagemConsulta: 'Olá! Gostaria de saber mais sobre as peças da Cherry Fitwear.',
  // Desconto para quem seguir os perfis do Instagram abaixo (0 = esconde o aviso da página inicial)
  descontoSeguir: 0,
  // Perfis do Instagram a seguir: só o nome de usuário, sem o @
  perfisInstagram: [],
  // Seções extras da página inicial, criadas no painel (ex.: "Mais vendidos"). Cada uma: id, titulo, texto (opcional) e a lista de ids de produtos, na ordem em que aparecem.
  secoes: [],
  // Nome da seção de promoções no topo da página (a frase pequena em cima e o título). Vazio = "Preços especiais" e "Promoções!"
  sobreTituloPromocoes: 'Preços especiais',
  tituloPromocoes: 'Promoções!',
};

window.CHERRY_MARCAS = [
  { id: 'signature',   nome: 'Signature',   logo: 'CF',          estilo: 'serif',     cor: '#ffffff', fundo: '#7a0a2a', sub: 'Linha CF' },
  { id: 'essential',   nome: 'Essential',   logo: 'essential',   estilo: 'sans-leve', cor: '#470418', sub: 'Básicas' },
  { id: 'seamless',    nome: 'Seamless',    logo: 'SEAMLESS',    estilo: 'espacado',  cor: '#7a0a2a', sub: 'Sem costura' },
  { id: 'power-lift',  nome: 'Power Lift',  logo: 'Power Lift',  estilo: 'sans',      cor: '#470418', fundo: '#f6b3c4', sub: 'Compressão' },
  { id: 'cherry-glow', nome: 'Cherry Glow', logo: 'Cherry Glow', estilo: 'script',    cor: '#cf2a5c', sub: 'Tons de cereja' },
  { id: 'move',        nome: 'Move',        logo: 'MOVE',        estilo: 'espacado',  cor: '#ffffff', fundo: '#1a1416', sub: 'Corrida e treino' },
];

const FOTO = (id) => `images/produtos/${id}.webp`;

window.CHERRY_PRODUTOS = [
  /* ============ LEGGINGS E CALÇAS ============ */

  { id: 'signature-calca-flare', marca: 'signature', categoria: 'leggings',
    nome: 'Calça Flare Signature Preta', tipo: 'Calça flare cintura alta · P ao GG', selo: 'Lançamento',
    preco: 129, imagem: '',
    arte: { forma: 'flare', corpo: '#1a1416', tampa: '#2b2025', texto: '#e0709a' } },

  { id: 'signature-calca-flare-taupe', marca: 'signature', categoria: 'leggings',
    nome: 'Calça Flare Signature Taupe', tipo: 'Calça flare cintura alta · P ao GG',
    preco: 129, imagem: '',
    arte: { forma: 'flare', corpo: '#7d7468', tampa: '#6d655a', texto: '#e0709a' } },

  { id: 'essential-legging-cintura-alta', marca: 'essential', categoria: 'leggings',
    nome: 'Legging Cintura Alta Essential', tipo: 'Legging · P ao GG',
    preco: 89, imagem: '',
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#7a0a2a', texto: '#e0709a' } },

  { id: 'power-legging-compressao', marca: 'power-lift', categoria: 'leggings',
    nome: 'Legging Power Lift Alta Compressão', tipo: 'Legging com compressão · P ao GG',
    preco: 119, imagem: '',
    arte: { forma: 'legging', corpo: '#7a0a2a', tampa: '#4f0419', texto: '#f6b3c4' } },

  { id: 'seamless-legging-sem-costura', marca: 'seamless', categoria: 'leggings',
    nome: 'Legging Seamless Sem Costura', tipo: 'Legging sem costura · P ao GG',
    preco: 99, imagem: '',
    arte: { forma: 'legging', corpo: '#f6b3c4', tampa: '#e98aa5', texto: '#ffffff' } },

  { id: 'glow-legging-cereja', marca: 'cherry-glow', categoria: 'leggings',
    nome: 'Legging Cherry Glow Cereja', tipo: 'Legging cintura alta · P ao GG',
    preco: 109, precoAntigo: 129, imagem: '',
    arte: { forma: 'legging', corpo: '#a50f32', tampa: '#7a0a2a', texto: '#fde0e8' } },

  { id: 'move-legging-suplex', marca: 'move', categoria: 'leggings',
    nome: 'Legging Move Suplex Básica', tipo: 'Legging suplex · P ao GG',
    preco: 69, imagem: '',
    arte: { forma: 'legging', corpo: '#2b2025', tampa: '#43343a', texto: '#e0709a' } },

  /* ============ TOPS E REGATAS ============ */

  { id: 'signature-top-costas-nadador', marca: 'signature', categoria: 'tops',
    nome: 'Top Costas Nadador Signature', tipo: 'Top fitness · P ao GG',
    preco: 59, imagem: '',
    arte: { forma: 'top', corpo: '#1a1416', tampa: '#2b2025', texto: '#e0709a' } },

  { id: 'essential-top-faixa', marca: 'essential', categoria: 'tops',
    nome: 'Top Essential Faixa', tipo: 'Top fitness · P ao GG',
    preco: 49, imagem: '',
    arte: { forma: 'top', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#ffffff' } },

  { id: 'seamless-top-nadador', marca: 'seamless', categoria: 'tops',
    nome: 'Top Seamless Nadador', tipo: 'Top sem costura · P ao GG',
    preco: 59, imagem: '',
    arte: { forma: 'top', corpo: '#f6b3c4', tampa: '#e98aa5', texto: '#ffffff' } },

  { id: 'glow-top-cereja', marca: 'cherry-glow', categoria: 'tops',
    nome: 'Top Cherry Glow Cereja', tipo: 'Top com bojo · P ao GG', selo: 'Lançamento',
    preco: 55, imagem: '',
    arte: { forma: 'top', corpo: '#a50f32', tampa: '#7a0a2a', texto: '#fde0e8' } },

  { id: 'seamless-regata-alongada', marca: 'seamless', categoria: 'tops',
    nome: 'Regata Seamless Alongada', tipo: 'Regata solta · P ao GG',
    preco: 59, imagem: '',
    arte: { forma: 'regata', corpo: '#f1e3dc', tampa: '#dcc3b6', texto: '#a50f32' } },

  { id: 'move-regata-dry', marca: 'move', categoria: 'tops',
    nome: 'Regata Move Dry Fit', tipo: 'Regata esportiva · P ao GG',
    preco: 49, precoAntigo: 59, imagem: '',
    arte: { forma: 'regata', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#ffffff' } },

  /* ============ SHORTS E BIKERS ============ */

  { id: 'essential-biker', marca: 'essential', categoria: 'shorts',
    nome: 'Biker Essential Cintura Alta', tipo: 'Biker · P ao GG',
    preco: 69, imagem: '',
    arte: { forma: 'biker', corpo: '#1a1416', tampa: '#f6b3c4', texto: '#e0709a' } },

  { id: 'seamless-biker', marca: 'seamless', categoria: 'shorts',
    nome: 'Biker Seamless Sem Costura', tipo: 'Biker sem costura · P ao GG',
    preco: 79, imagem: '',
    arte: { forma: 'biker', corpo: '#e9d6cb', tampa: '#cdb2a3', texto: '#a50f32' } },

  { id: 'power-shorts-treino', marca: 'power-lift', categoria: 'shorts',
    nome: 'Shorts Power Lift Treino', tipo: 'Shorts com cordão · P ao GG',
    preco: 65, imagem: '',
    arte: { forma: 'shorts', corpo: '#a50f32', tampa: '#7a0a2a', texto: '#fde0e8' } },

  { id: 'move-shorts-running', marca: 'move', categoria: 'shorts',
    nome: 'Shorts Move Running Leve', tipo: 'Shorts de corrida · P ao G',
    preco: 55, precoAntigo: 69, imagem: '', tamanhos: ['P', 'M', 'G'],
    arte: { forma: 'shorts', corpo: '#9a9186', tampa: '#7d7468', texto: '#e0709a' } },

  /* ============ CONJUNTOS E MACACÕES ============ */

  { id: 'signature-conjunto-flare-preto', marca: 'signature', categoria: 'conjuntos',
    nome: 'Conjunto Signature Top + Calça Flare Preto', tipo: 'Conjunto 2 peças · P ao GG',
    preco: 179, imagem: '',
    arte: { forma: 'conjunto-flare', corpo: '#1a1416', tampa: '#2b2025', texto: '#e0709a' } },

  { id: 'signature-conjunto-flare-taupe', marca: 'signature', categoria: 'conjuntos',
    nome: 'Conjunto Signature Top + Calça Flare Taupe', tipo: 'Conjunto 2 peças · P ao GG',
    preco: 179, imagem: '',
    arte: { forma: 'conjunto-flare', corpo: '#7d7468', tampa: '#6d655a', texto: '#e0709a' } },

  { id: 'glow-conjunto-top-biker', marca: 'cherry-glow', categoria: 'conjuntos',
    nome: 'Conjunto Cherry Glow Top + Biker', tipo: 'Conjunto 2 peças · P ao GG',
    preco: 149, imagem: '',
    arte: { forma: 'conjunto', corpo: '#a50f32', tampa: '#f6b3c4', texto: '#fde0e8' } },

  { id: 'seamless-conjunto-nude', marca: 'seamless', categoria: 'conjuntos',
    nome: 'Conjunto Seamless Top + Biker Nude', tipo: 'Conjunto 2 peças · P ao GG',
    preco: 159, imagem: '',
    arte: { forma: 'conjunto', corpo: '#e9d6cb', tampa: '#cdb2a3', texto: '#a50f32' } },

  { id: 'power-conjunto-treino', marca: 'power-lift', categoria: 'conjuntos',
    nome: 'Conjunto Power Lift Top + Shorts', tipo: 'Conjunto 2 peças · P ao GG',
    preco: 189, precoAntigo: 219, imagem: '',
    arte: { forma: 'conjunto', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#ffffff' } },

  { id: 'signature-macacao', marca: 'signature', categoria: 'conjuntos',
    nome: 'Macacão Signature Longo', tipo: 'Macacão longo · P ao GG',
    preco: 139, imagem: '',
    arte: { forma: 'macacao', corpo: '#1a1416', tampa: '#2b2025', texto: '#e0709a' } },

  /* ============ JAQUETAS ============ */

  { id: 'essential-jaqueta-cropped', marca: 'essential', categoria: 'jaquetas',
    nome: 'Jaqueta Cropped Essential com Zíper', tipo: 'Jaqueta de treino · P ao GG',
    preco: 129, imagem: '',
    arte: { forma: 'jaqueta', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#ffffff' } },

  { id: 'move-jaqueta-corta-vento', marca: 'move', categoria: 'jaquetas',
    nome: 'Jaqueta Move Corta-Vento', tipo: 'Jaqueta leve · P ao GG',
    preco: 139, imagem: '',
    arte: { forma: 'jaqueta', corpo: '#f6b3c4', tampa: '#e98aa5', texto: '#ffffff' } },
];
