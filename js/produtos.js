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
  { id: 'power-lift', nome: 'Cherry Bloom Collection', logo: 'Cherry Bloom Collection', estilo: 'sans', cor: '#470418', fundo: '#f6b3c4', sub: 'Compressão' },
];

const FOTO = (id) => `images/produtos/${id}.webp`;

window.CHERRY_PRODUTOS = [
  /* ============ LEGGINGS E CALÇAS ============ */

  /* ============ TOPS E REGATAS ============ */

  /* ============ SHORTS E BIKERS ============ */

  /* ============ CONJUNTOS E MACACÕES ============ */

  /* ============ JAQUETAS ============ */

];
