# Cherry Fitwear

Loja virtual estática (HTML/CSS/JS), pensada para publicar no GitHub Pages. O cliente monta o pedido no site e finaliza pelo WhatsApp (não há pagamento no site). O catálogo fica em `js/produtos.js` e `js/descricoes.js`.

## Antes de publicar

1. **WhatsApp (obrigatório):** o número que recebe os pedidos fica vazio de propósito. Preencha em `js/produtos.js` (`whatsapp: '5562999998888'`, só dígitos com DDI + DDD) ou no painel, aba **Contato**. Enquanto estiver vazio, "Finalizar pedido" e o botão de WhatsApp avisam que o contato está sendo configurado.
2. **Peças de exemplo:** os 25 produtos, os preços e as descrições são exemplos. Troque tudo pelo painel (`admin.html`) ou editando os dois arquivos.
3. **Fotos:** enquanto uma peça não tem foto, o site desenha uma ilustração (legging, calça flare, top, biker, shorts, regata, macacão, conjuntos, jaqueta) com o monograma "CF". Ao enviar a foto no painel, ela substitui a ilustração.
4. **Logo:** o ícone (cerejas + laço) está desenhado em SVG dentro de `index.html` (símbolo `logo-cereja`) e em `images/favicon.svg`; o nome "cherry" usa a fonte Fredoka. É uma recriação do logo. Para usar o arquivo oficial, salve o PNG/SVG em `images/` e troque o `<svg class="marca__icone">` do cabeçalho (e o do menu mobile) por um `<img>`.
5. **Hero:** a arte do topo usa `images/cereja-laco.webp`. Para colocar a foto de uma modelo, adicione uma imagem sem fundo em `images/` e inclua uma `<img>` dentro da camada `camada--laco` do `index.html`.
6. **Instagram (opcional):** em `descontoSeguir` e `perfisInstagram` dá para ligar um aviso "siga e ganhe X% de desconto" no topo da página. Com 0% ele fica escondido.

## Painel de edição (`admin.html`)

Página para editar preços, peças, fotos, coleções e o contato sem mexer em código. Acesso: `https://<site>/admin.html` (sem link no site e marcada como `noindex`).

- **Produtos:** preço direto na lista; botão **Promoção** (o preço de hoje vira o "antigo" riscado); criar, editar e excluir peças com até 10 fotos (convertidas para WebP quadrado de até 800 px) e descrição completa.
- **Vitrine:** escolher o que aparece em **Promoções!**, marcar **Lançamentos** e criar as próprias seções ("Mais vendidos", "Conjuntos"…).
- **Coleções:** as linhas da loja (Signature, Essential, Seamless…) que aparecem na seção "Coleções". Cadastre a coleção antes de criar peças dela.
- **Contato:** WhatsApp, mensagem do botão e o desconto por seguir no Instagram.
- Nada vai para o ar até clicar em **Publicar** (um único commit no GitHub; o Pages atualiza em 1 a 2 minutos). As edições ficam guardadas no aparelho como rascunho.

### Configuração (uma vez, no aparelho de quem vai editar)

1. Crie o repositório `cherryfitwear` no GitHub e ative o Pages (o workflow em `.github/workflows/static.yml` publica a cada push na `main`).
2. Na conta dona do repositório: <https://github.com/settings/personal-access-tokens/new>
3. **Repository access** → *Only select repositories* → `cherryfitwear`.
4. **Repository permissions** → **Contents: Read and write** (nenhuma outra) e o maior prazo de expiração.
5. Em `admin.html`, clique em **Conectar** e cole a chave (`github_pat_…`). O repositório padrão é `Snoopyzin/cherryfitwear`; ajuste em `REPO_PADRAO` (`js/admin.js`) se a conta ou o nome forem outros.

### Para quem mexe no código

- O painel lê o catálogo do **GitHub**, não da pasta local. Faça `git push` do que estiver pendente antes de usar o painel e `git pull` antes de editar `js/produtos.js` na mão.
- Convenções que o painel segue ao reescrever `js/produtos.js`: cada peça é um bloco separado por linha em branco; cada coleção e cada opção de `CHERRY_CONFIG` fica em uma linha.
- `js/admin-core.js` tem a lógica de dados (sem tela) e roda no Node: `require('./js/admin-core.js')`.
- Os identificadores no código mantêm o prefixo `CHERRY_` (`CHERRY_CONFIG`, `CHERRY_PRODUTOS`…); "marca" nos dados = **coleção** na tela.
- O carrinho e o painel guardam dados no navegador com as chaves `cherry-fitwear:*` e `fitwear-admin:*`, separadas das de outros sites do mesmo domínio.