# roots-desperdicio-alimentos

Protótipo do Roots, app para controlar os alimentos de casa com foco em hortifruti: validade, dicas de armazenamento, compras registradas por foto, receitas com o que vence primeiro, lembretes e conexão com produtores da agricultura familiar. Next.js com exportação estática, publicado no GitHub Pages, sem backend e sem cadastro em serviços externos.

Demo: https://dudabarbozat.github.io/roots-desperdicio-alimentos/

Portfólio pessoal. Projeto criado entre 2020 e 2023 e reimplementado em 2026 com Next.js e APIs públicas.

## Contexto

Proposta apresentada em pitch no desafio "Produção Sustentável e Consumo Verde".

- Problema: desperdício de alimentos, principalmente dentro de casa.
- Proposta original: app para controlar os alimentos da casa, com foco em hortifruti, avisando sobre validade, ensinando a armazenar e conectando o consumidor a produtores da agricultura familiar, com produtos locais e rastreáveis.
- Público: pessoas de 20 a 35 anos que buscam consumo consciente.
- Receita prevista: anúncios e, depois, planos por assinatura. Parceiros: produtores locais e cooperativas.
- Roadmap do pitch: aprendizado de máquina para prever compras e sugerir cardápios saudáveis, parcerias com apps de nutrição, cupons de recompensa e ranking de economia entre amigos.
- Equipe:
  - Eduarda Barboza (UX/UI)
  - André Vinícius Katsuragawa (desenvolvimento)
  - Tamiris Steimbch (desenvolvimento)
  - Byler Frohner (marketing)
  - Cindy Ueda (negócios)

Números usados no pitch (fontes de 2019 e 2021):

- "931 milhões de toneladas de resíduos alimentares… em 2019"
- "61%… famílias, 26% de serviços de alimentação e 13% do varejo"
- "17% do total da produção global"
- "8-10% das emissões globais"
- "US$ 408 bilhões"

## O protótipo

Versão 2. Mantém o conceito e a identidade do pitch (cores, fontes, logo, cartões de alerta, barra inferior com o botão central da feira) e acrescenta integrações reais. O estado fica no `localStorage` do navegador; a tela Conta tem "Restaurar dados de exemplo".

Rotas:

- `/entrar/`: login (simulado). Primeira visita cai aqui.
- `/despensa/`: lista por vencimento com alerta por cor e texto (vence hoje ou vencido, até 3 dias, no prazo), filtros e orientação curta na primeira visita. Ação principal: "Adicionar compras", por foto (reconhecimento no navegador) ou à mão. Cada item abre o painel "vence em X dias" com dica de armazenamento, receitas, lembrete .ics e as opções "descartei" e "já usei", com desfazer.
- `/receitas/`: cardápio de 3 dias usando primeiro o que vence antes, com ingredientes, passos e o botão "Cozinhei", que dá baixa nos itens usados.
- `/feira/`: produtores fictícios ordenados pela distância real até a localização do usuário (CEP ou aparelho).
- `/feira/mapa/`: mapa OpenStreetMap com você, o ponto de retirada e os produtores; busca por nome ou alimento.
- `/feira/<produtor>/`: perfil, preços, quantidade, rastreio do lote e adicionar à despensa.
- `/economia/`: meta mensal de quilos salvos do lixo (editável), progresso do mês, aproveitamento e evolução dos últimos 6 meses.
- `/historico/`: tudo o que saiu da despensa, com filtro por salvo, usado e descartado.
- `/conta/`: perfil, localização, lembretes e restauração dos dados.
- `/creditos/`: autor, licença e link de cada foto usada.

Identidade visual:

- Cores medidas nas imagens do pitch: `#193B56`, `#9CDE76`, `#F5F5F5`, `#EAE8E8`, `#EA7F1C`, `#FC424A`, `#00D25B`, `#F0F0ED`, `#2D3748`, `#77B555`.
- Fontes: Source Sans 3 e Roboto (as das telas do pitch) via `next/font/google`; Glacial Indifference (fonte dos slides) a partir do pacote npm `typeface-glacial-indifference`, licença SIL OFL, via `next/font/local`.
- Logo redesenhado em vetor a partir do pitch: letras na Glacial Indifference convertidas em curvas e coroa de folhas própria no segundo "O" (`public/img/`).
- Fotos reais do Wikimedia Commons (CC0, domínio público, CC BY e CC BY-SA) para os 21 alimentos, as lavouras dos produtores fictícios e a feira, em WebP (cerca de 600 px para alimentos e 1200 px para cenas), em `public/img/fotos/`. Créditos em `public/img/fotos/CREDITOS.md` e na rota `/creditos/`. As fotos de lavoura não mostram pessoas identificáveis e não têm relação com os produtores fictícios.

## APIs e bibliotecas

| Recurso | Para quê |
| --- | --- |
| [BrasilAPI CEP v2](https://brasilapi.com.br/docs#tag/CEP-V2) | Converte o CEP em bairro, cidade e coordenadas |
| [Nominatim (OpenStreetMap)](https://nominatim.org/release-docs/latest/api/Search/) | Reserva: centro da cidade quando o CEP vem sem coordenadas |
| [Tiles do OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/) com [Leaflet](https://leafletjs.com/) | Mapa da feira, com atribuição |
| [TensorFlow.js](https://www.tensorflow.org/js) + [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) | Reconhece alimentos na foto da compra, no próprio navegador |
| [Geolocation API](https://developer.mozilla.org/docs/Web/API/Geolocation_API) | Localização do aparelho, só com permissão |
| [Notification API](https://developer.mozilla.org/docs/Web/API/Notifications_API) | Aviso do que vence amanhã enquanto o app está aberto, só com permissão |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Fotos dos alimentos e das lavouras, com licença livre |

Nenhuma exige cadastro. As chamadas saem direto do navegador (CORS liberado), com tempo limite e mensagens de erro com ação. A distância entre você e cada produtor é calculada pela fórmula de haversine.

Sem notificação disponível ou permitida, o app oferece um arquivo `.ics` com um lembrete às 9h do dia anterior ao vencimento de cada item.

## Compras por foto

O modelo COCO-SSD (`lite_mobilenet_v2`, cerca de 5 MB, baixado do armazenamento público do TensorFlow na primeira vez) roda no navegador; a foto não sai do aparelho. Das 80 classes do COCO, cinco existem no catálogo do app: banana, maçã, laranja, brócolis e cenoura. A tela diz isso antes da foto, desenha as caixas com a confiança de cada detecção, conta as unidades por alimento e estima o peso pela contagem (peso médio por unidade). O usuário confere peso e validade antes de salvar. Os demais alimentos entram à mão, com busca e sugestões. Há três fotos de exemplo para testar sem câmera.

## Receitas

O cardápio de 3 dias vem de uma regra fixa sobre 13 receitas da base: cada ingrediente disponível pontua mais quanto mais perto do vencimento, ingredientes que faltam descontam, e a receita escolhida tira seus ingredientes da conta antes do dia seguinte. A tela explica a regra. No roadmap do pitch, essa etapa seria um modelo treinado no histórico de compras.

## O que é simulado

- Produtores, lotes, preços, perfil e histórico são fictícios. As datas de exemplo são relativas ao dia em que a página é aberta.
- Na região de Curitiba os produtores ficam em posições fixas ao redor da cidade; em outras cidades são reposicionados ao redor do usuário para a demo continuar útil. O ponto de retirada é fictício.
- Login, recuperação de senha, compra e pagamento não existem; "Adicionar" só registra o item no navegador.
- As notificações só aparecem com o app aberto (não há service worker nem push).

## Como rodar

```
npm ci
npm run dev
```

Acesse http://localhost:3000/. Para checar tipos: `npm run typecheck`. Para gerar a versão estática: `npm run build` (pasta `out/`).

## Publicação

O workflow `.github/workflows/pages.yml` roda a cada push na `main`: instala com `npm ci`, gera o build com `NEXT_PUBLIC_BASE_PATH=/roots-desperdicio-alimentos` e publica a pasta `out` no GitHub Pages. No repositório, em Settings > Pages, a origem precisa ser "GitHub Actions".

## Estrutura

```
.github/workflows/pages.yml   build e publicação no GitHub Pages
public/img/                   logo (SVG claro e escuro), favicon e fotos/ com CREDITOS.md
src/app/                      rotas do App Router e globals.css (tokens)
src/telas/                    telas e seus CSS Modules
src/components/               casca do app, diálogo, avisos, ícones, mapa Leaflet, fotos
src/lib/dados.ts              alimentos, receitas, produtores e dados de exemplo
src/lib/estado.ts             estado em localStorage e ações
src/lib/regras.ts             prazos, valores e regra do cardápio
src/lib/deteccao.ts           TensorFlow.js + COCO-SSD e mapeamento das classes
src/lib/fotos.ts              arquivo, autor e licença de cada foto
src/lib/local.ts              CEP, geolocalização e distâncias
src/lib/lembretes.ts          notificações e arquivo .ics
src/lib/ilustra.ts            avatar da tela Conta
```

## Licença

MIT. Ver `LICENSE`.
