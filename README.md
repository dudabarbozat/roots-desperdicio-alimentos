# Roots — desperdício de alimentos

App para controlar os alimentos de casa, com foco em hortifruti: validade, dicas de armazenamento, compras registradas por foto, receitas com o que vence primeiro e conexão com produtores da agricultura familiar.

**Demo:** https://dudabarbozat.github.io/roots-desperdicio-alimentos/

Projeto de pitch do desafio "Produção Sustentável e Consumo Verde", criado entre 2020 e 2023 e reconstruído em 2026 como protótipo navegável.

## Para quem

Pessoas de 20 a 35 anos que buscam consumo consciente e querem parar de jogar comida fora.

## Funcionalidades

- **Despensa** ordenada por vencimento, com alerta por cor, dica de armazenamento e lembrete.
- **Compras por foto:** reconhecimento de alimentos no próprio navegador (TensorFlow.js + COCO-SSD); a foto não sai do aparelho.
- **Receitas:** cardápio de 3 dias que usa primeiro o que vence antes.
- **Feira:** produtores locais por distância, em lista e mapa, com rastreio do lote.
- **Economia:** meta mensal de quilos salvos do lixo e evolução dos últimos meses.
- **Lembretes** por notificação ou arquivo `.ics`.

## Stack

Next.js 15 (exportação estática) · React 19 · TypeScript · TensorFlow.js · Leaflet

| Serviço | Uso |
|---------|-----|
| [BrasilAPI CEP v2](https://brasilapi.com.br/docs#tag/CEP-V2) e [Nominatim](https://nominatim.org/) | Localização pelo CEP |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | Mapa da feira |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Fotos dos alimentos, com licença livre |

Sem backend e sem chaves de API.

## Como rodar

```bash
npm ci
npm run dev
```

## Limitações do protótipo

Produtores, lotes, preços e histórico são fictícios. Não há login, compra nem pagamento; o reconhecimento por foto cobre cinco alimentos. Os dados ficam no navegador.

## Equipe

- Eduarda Barboza — UX/UI
- André Vinícius Katsuragawa — desenvolvimento
- Tamiris Steimbch — desenvolvimento
- Byler Frohner — marketing
- Cindy Ueda — negócios

## Licença

Código sob [MIT](LICENSE). Créditos das fotos em `public/img/fotos/CREDITOS.md` e na tela `/creditos/`.
