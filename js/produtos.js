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
  whatsapp: '5562999254234',
  // Tamanhos que o cliente pode escolher em cada peça (cada peça pode ter a sua própria lista em "tamanhos")
  tamanhos: ['P', 'M', 'G', 'GG'],
  // Mensagem que já vem escrita quando o cliente toca no botão "WhatsApp" do início da página
  mensagemConsulta: 'Olá! Gostaria de saber mais sobre as peças da Cherry Fitwear.',
  // Desconto para quem seguir os perfis do Instagram abaixo (0 = esconde o aviso da página inicial)
  descontoSeguir: 5,
  // Perfis do Instagram a seguir: só o nome de usuário, sem o @
  perfisInstagram: ['cherryfitwearr', 'abiacamps'],
  // Seções extras da página inicial, criadas no painel (ex.: "Mais vendidos"). Cada uma: id, titulo, texto (opcional) e a lista de ids de produtos, na ordem em que aparecem.
  secoes: [],
  // Nome da seção de promoções no topo da página (a frase pequena em cima e o título). Vazio = "Preços especiais" e "Promoções!"
  sobreTituloPromocoes: 'Preços especiais',
  tituloPromocoes: 'Promoções!',
};

window.CHERRY_MARCAS = [
  { id: 'power-lift', nome: 'Bloom Collection', logo: 'Bloom Collection', estilo: 'sans', cor: '#470418', fundo: '#f6b3c4', sub: 'Compressão' },
];

const FOTO = (id) => `images/produtos/${id}.webp`;

window.CHERRY_PRODUTOS = [
  /* ============ LEGGINGS E CALÇAS ============ */

  /* ============ TOPS E REGATAS ============ */

  /* ============ SHORTS E BIKERS ============ */

  /* ============ CONJUNTOS E MACACÕES ============ */

  /* ============ JAQUETAS ============ */

  { id: 'power-lift-macaquinho-nicoly', marca: 'power-lift', categoria: 'macacao',
    nome: 'Macaquinho Nicoly', tipo: 'Macaquinho sem Costura de Mangas c/ Reguladores nas Costas MENTA',
    preco: 153.5, imagem: 'images/produtos/power-lift-macaquinho-nicoly.jpg',
    cores: [{ nome: 'Menta', cor: '#a8dcc8', tamanhos: ['P', 'M', 'G'] }, { nome: 'Verde Oliva', cor: '#3f8f6b', tamanhos: ['P', 'M', 'G'] }, { nome: 'Marrom', cor: '#6b4a3a', tamanhos: ['G'] }, { nome: 'Off Perola', cor: '#f4efe6', tamanhos: ['G'] }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-conjunto-vitoria', marca: 'power-lift', categoria: 'conjunto-short',
    nome: 'Conjunto Vitória', tipo: 'Conjunto Beach Tênis Short Duplo',
    preco: 129.99, imagem: 'images/produtos/power-lift-conjunto-vitoria.jpg',
    cores: [{ nome: 'Turquesa', cor: '#00a3b7', tamanhos: ['M', 'G'] }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-conjunto-pandora', marca: 'power-lift', categoria: 'conjunto-calca',
    nome: 'Conjunto Pandora', tipo: 'Conjunto Comfort Top e Calça Pantalona',
    preco: 139.99, imagem: 'images/produtos/power-lift-conjunto-pandora.jpg',
    cores: [{ nome: 'Preto', cor: '#000000', tamanhos: ['G'] }, { nome: 'Terracota', cor: '#cccccc', imagem: 'images/produtos/power-lift-conjunto-pandora-mwtdwcky3.jpg', tamanhos: ['P', 'M', 'G'] }, { nome: 'Nude Rosado', cor: '#d9b8a3', tamanhos: ['P', 'M', 'G'] }, { nome: 'Marrom', cor: '#6b4a3a', tamanhos: ['P', 'G'] }, { nome: 'Azul Perolado', cor: '#3b6fb6', tamanhos: ['P', 'M', 'G'] }],
    galeria: ['images/produtos/power-lift-conjunto-pandora-mwtdwcky1.jpg', 'images/produtos/power-lift-conjunto-pandora-mwtdwcky2.jpg', 'images/produtos/power-lift-conjunto-pandora-mwtdwcky3.jpg', 'images/produtos/power-lift-conjunto-pandora-mwtdwcky4.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-conjunto-analu', marca: 'power-lift', categoria: 'conjunto-calca',
    nome: 'Conjunto Analu', tipo: 'Conjunto Flare Sem Costura',
    preco: 159.99, imagem: 'images/produtos/power-lift-conjunto-analu.jpg',
    cores: [{ nome: 'Cinza Aço', cor: '#8a8587', tamanhos: ['P', 'M', 'G'] }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-macacao-joyce', marca: 'power-lift', categoria: 'macacao',
    nome: 'Macacão Joyce', tipo: 'Macacão Tomara Que Cai sem Costura',
    preco: 189.5, imagem: 'images/produtos/power-lift-macacao-joyce.jpg',
    cores: [{ nome: 'Verde Oliva', cor: '#3f8f6b', tamanhos: ['P'] }, { nome: 'Menta', cor: '#a8dcc8', tamanhos: ['P', 'M'] }, { nome: 'Off Perola', cor: '#f4efe6', tamanhos: ['M'] }],
    galeria: ['images/produtos/power-lift-macacao-joyce-mwte6w7u1.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-blusa-deusa', marca: 'power-lift', categoria: 'jaquetas',
    nome: 'Blusa Deusa', tipo: 'Blusa Traspassada Comfort',
    preco: 110, imagem: 'images/produtos/power-lift-blusa-deusa.jpg',
    cores: [{ nome: 'Preto P, M, G', cor: '#1a1416' }, { nome: 'Nude Rosado P, M, G', cor: '#d9b8a3' }, { nome: 'Marrom FUDGE P, M, G', cor: '#6b4a3a' }, { nome: 'TERRACOTA P, M, G', cor: '#d8c3a5', imagem: 'images/produtos/power-lift-blusa-deusa-mwtecwse2.jpg' }, { nome: 'AZUL PETRÓLEO P, M, G', cor: '#3b6fb6', imagem: 'images/produtos/power-lift-blusa-deusa-mwtecwse3.jpg' }],
    galeria: ['images/produtos/power-lift-blusa-deusa-mwtecwse1.jpg', 'images/produtos/power-lift-blusa-deusa-mwtecwse2.jpg', 'images/produtos/power-lift-blusa-deusa-mwtecwse3.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-conjunto-mari', marca: 'power-lift', categoria: 'conjunto-short',
    nome: 'Conjunto Mari', tipo: 'Conjunto Golden Shape (Top + Short c/ bolsos)',
    preco: 123.99, imagem: 'images/produtos/power-lift-conjunto-mari.jpg',
    cores: [{ nome: 'Marrom', cor: '#6b4a3a', tamanhos: ['P', 'M', 'G'] }, { nome: 'Azul Marinho', cor: '#012f7b', tamanhos: ['P', 'M', 'G'] }, { nome: 'Cinza Aço', cor: '#8a8587', tamanhos: ['P', 'M', 'G'] }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-jaqueta-thais', marca: 'power-lift', categoria: 'jaquetas',
    nome: 'Jaqueta Thaís', tipo: 'Jaqueta Fitness Feminina com Zíper para Academia Inverno',
    preco: 110, imagem: 'images/produtos/power-lift-jaqueta-thais.jpg',
    cores: [{ nome: 'Branco P, M, G', cor: '#ffffff', imagem: 'images/produtos/power-lift-jaqueta-thais.jpg' }, { nome: 'Capuccino P, G', cor: '#6b4a3a', imagem: 'images/produtos/power-lift-jaqueta-thais-mwteyby01.jpg' }, { nome: 'Preto P', cor: '#1a1416' }],
    galeria: ['images/produtos/power-lift-jaqueta-thais-mwteyby01.jpg', 'images/produtos/power-lift-jaqueta-thais-mwteyby02.jpg', 'images/produtos/power-lift-jaqueta-thais-mwteyby03.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-bojo-cortinao-espuma-8mm-caixa-c-10-pares', marca: 'power-lift', categoria: 'acessorios',
    nome: 'Bojo Cortinão Espuma 8mm caixa c/10 pares', tipo: '',
    preco: 40, imagem: 'images/produtos/power-lift-bojo-cortinao-espuma-8mm-caixa-c-10-pares.jpg',
    cores: [{ nome: 'Branco P, M, G', cor: '#ffffff' }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-faixa-de-cabelo-em-malha-canelada', marca: 'power-lift', categoria: 'acessorios',
    nome: 'Faixa de Cabelo em Malha Canelada', tipo: '',
    preco: 20, imagem: 'images/produtos/power-lift-faixa-de-cabelo-em-malha-canelada.jpg',
    cores: [{ nome: 'Vermelho', cor: '#d62839' }, { nome: 'Preto', cor: '#1a1416' }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-faixa-de-cabelo-em-poliamida-vermelho', marca: 'power-lift', categoria: 'acessorios',
    nome: 'Faixa de Cabelo em Poliamida Vermelho', tipo: '',
    preco: 20, imagem: 'images/produtos/power-lift-faixa-de-cabelo-em-poliamida-vermelho.jpg',
    cores: [{ nome: 'Vermelho', cor: '#d62839' }],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-conjunto-gorete', marca: 'power-lift', categoria: 'moda-evangelica',
    nome: 'Conjunto Gorete', tipo: 'Conjunto Harmonia Fitness Evangélico',
    preco: 139.5, imagem: 'images/produtos/power-lift-conjunto-gorete.jpg',
    cores: [{ nome: 'Rosa Bebê', cor: '#f6b3c4', imagem: 'images/produtos/power-lift-conjunto-gorete.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Azul Frozen', cor: '#3b6fb6', imagem: 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh1.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Marrom', cor: '#6b4a3a', imagem: 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh3.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Roxo', cor: '#b69ad8', imagem: 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh4.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Vermelho', cor: '#d62839', imagem: 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh5.jpg', tamanhos: ['P', 'G', 'GG'] }],
    galeria: ['images/produtos/power-lift-conjunto-gorete-mwu0ltbh1.jpg', 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh2.jpg', 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh3.jpg', 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh4.jpg', 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh5.jpg', 'images/produtos/power-lift-conjunto-gorete-mwu0ltbh6.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-conjunto-ruthe', marca: 'power-lift', categoria: 'moda-evangelica',
    nome: 'Conjunto Ruthe', tipo: 'Conjunto Dinâmico Fitness Evangélico',
    preco: 149.9, imagem: 'images/produtos/power-lift-conjunto-ruthe.jpg',
    cores: [{ nome: 'Marte', cor: '#d62839', imagem: 'images/produtos/power-lift-conjunto-ruthe.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Mel', cor: '#cccccc', imagem: 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv01.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Preto', cor: '#1a1416', imagem: 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv02.jpg', tamanhos: ['P', 'GG'] }, { nome: 'Azul Frozen', cor: '#3b6fb6', imagem: 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv03.jpg', tamanhos: ['P', 'GG'] }],
    galeria: ['images/produtos/power-lift-conjunto-ruthe-mwu0wzv01.jpg', 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv02.jpg', 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv03.jpg', 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv04.jpg', 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv05.jpg', 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv06.jpg', 'images/produtos/power-lift-conjunto-ruthe-mwu0wzv07.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina', marca: 'power-lift', categoria: 'masculino',
    nome: 'Jaqueta Corta Vento Impermeável com Capuz Masculina', tipo: '',
    preco: 124.99, imagem: 'images/produtos/power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina.jpg',
    tamanhos: ['P', 'M', 'G', 'GG'], cores: [{ nome: 'Preto', cor: '#1a1416' }],
    galeria: ['images/produtos/power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina-mwu120gc1.jpg', 'images/produtos/power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina-mwu120gc2.jpg', 'images/produtos/power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina-mwu120gc3.jpg', 'images/produtos/power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina-mwu120gc4.jpg', 'images/produtos/power-lift-jaqueta-corta-vento-impermeavel-com-capuz-masculina-mwu120gc5.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-calca-jogger-tactel-ultra-confort-com-elastano', marca: 'power-lift', categoria: 'masculino',
    nome: 'Calça Jogger Tactel Ultra Confort com Elastano', tipo: '',
    preco: 112, imagem: 'images/produtos/power-lift-calca-jogger-tactel-ultra-confort-com-elastano.jpg',
    tamanhos: ['P', 'M', 'G', 'GG'], cores: [{ nome: 'Preto', cor: '#1a1416' }],
    galeria: ['images/produtos/power-lift-calca-jogger-tactel-ultra-confort-com-elastano-mwu166nm1.jpg', 'images/produtos/power-lift-calca-jogger-tactel-ultra-confort-com-elastano-mwu166nm2.jpg', 'images/produtos/power-lift-calca-jogger-tactel-ultra-confort-com-elastano-mwu166nm3.jpg', 'images/produtos/power-lift-calca-jogger-tactel-ultra-confort-com-elastano-mwu166nm4.jpg', 'images/produtos/power-lift-calca-jogger-tactel-ultra-confort-com-elastano-mwu166nm5.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },

  { id: 'power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l', marca: 'power-lift', categoria: 'masculino',
    nome: 'Camiseta Masculina Raglan Proteção Solar UV50+ Manga Longa PRETO', tipo: '',
    preco: 104, imagem: 'images/produtos/power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l.jpg',
    cores: [{ nome: 'Preto', cor: '#1a1416', tamanhos: ['P', 'GG'] }, { nome: 'Vinho', cor: '#7a0a2a', tamanhos: ['P', 'GG'] }, { nome: 'Cinza Aço', cor: '#8a8587', tamanhos: ['P', 'GG'] }, { nome: 'Marrom', cor: '#6b4a3a', tamanhos: ['P', 'GG'] }],
    galeria: ['images/produtos/power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l-mwu189xq1.jpg', 'images/produtos/power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l-mwu189xq2.jpg', 'images/produtos/power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l-mwu1bmqd3.jpg', 'images/produtos/power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l-mwu1bmqd4.jpg', 'images/produtos/power-lift-camiseta-masculina-raglan-protecao-solar-uv50-manga-l-mwu1bmqd5.jpg'],
    arte: { forma: 'legging', corpo: '#1a1416', tampa: '#cf2a5c', texto: '#e0709a' } },
];
