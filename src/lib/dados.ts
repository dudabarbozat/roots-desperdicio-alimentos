/* Dados fictícios da demo. Preços, produtores, lotes e pessoas são inventados. */
import type { Dados } from './tipos';

export const dados: Dados = {
  // dur: dias de validade típicos a partir da compra/colheita; precoKg: referência para calcular economia
  alimentos: {
    alface:       { nome: 'Alface',       g: 'f', forma: 'alface', cat: 'folha', dur: 5,  precoKg: 12.0, cor: '#6E9F48', dica: 'Lave só na hora de usar. Guarde as folhas secas, enroladas em pano ou papel, num pote fechado na gaveta da geladeira.' },
    couve:        { nome: 'Couve',        g: 'f', forma: 'folhaLarga', cat: 'folha', dur: 5,  precoKg: 14.0, cor: '#3F6B35', dica: 'Embrulhe o maço em papel-toalha e guarde em saco aberto na gaveta. Couve fatiada dura menos: corte no dia.' },
    espinafre:    { nome: 'Espinafre',    g: 'm', forma: 'folhaLarga', cat: 'folha', dur: 4,  precoKg: 22.0, cor: '#2F5D3A', dica: 'Retire folhas amareladas antes de guardar. Pote com papel no fundo, sem lavar. Se sobrar, branqueie e congele.' },
    rucula:       { nome: 'Rúcula',       g: 'f', forma: 'folhaFina', cat: 'folha', dur: 4,  precoKg: 25.0, cor: '#517A3A', dica: 'Pote fechado com papel-toalha, na parte menos fria da geladeira. Folha murcha volta em água gelada por 10 minutos.' },
    brocolis:     { nome: 'Brócolis',     g: 'm', forma: 'brocolis', cat: 'folha', dur: 4,  precoKg: 16.0, cor: '#3E6B4A', dica: 'Guarde sem lavar, em saco com furos. Se a flor começar a amarelar, cozinhe no vapor e congele em porções.' },
    cheiroverde:  { nome: 'Cheiro-verde', g: 'm', forma: 'ramos', cat: 'erva',  dur: 6,  precoKg: 30.0, cor: '#5C8A3C', dica: 'Corte a ponta dos talos e deixe num copo com dois dedos de água, coberto com saco, na geladeira. Troque a água a cada dois dias.' },
    tomate:       { nome: 'Tomate',       g: 'm', forma: 'redondo', cat: 'fruto', dur: 6,  precoKg: 8.5,  cor: '#C0432F', dica: 'Fora da geladeira enquanto amadurece, longe do sol e com o cabinho para baixo. Maduro, vai para a geladeira por até três dias.' },
    abobrinha:    { nome: 'Abobrinha',    g: 'f', forma: 'capsula', cat: 'fruto', dur: 7,  precoKg: 7.0,  cor: '#7FA24A', dica: 'Seca e inteira, na gaveta da geladeira. Depois de cortada, cubra a parte exposta com filme e use em dois dias.' },
    pimentao:     { nome: 'Pimentão',     g: 'm', forma: 'pimentao', cat: 'fruto', dur: 8,  precoKg: 12.0, cor: '#B8452A', dica: 'Inteiro e seco, na gaveta. Cortado, em pote fechado. Dá para congelar em tiras, sem branquear.' },
    cenoura:      { nome: 'Cenoura',      g: 'f', forma: 'cenoura', cat: 'raiz',  dur: 20, precoKg: 5.5,  cor: '#D9772B', dica: 'Tire as folhas antes de guardar, elas puxam a umidade da raiz. Saco fechado na gaveta da geladeira.' },
    batata:       { nome: 'Batata',       g: 'f', forma: 'batata', cat: 'raiz',  dur: 30, precoKg: 6.0,  cor: '#B08A4E', dica: 'Lugar escuro, seco e ventilado, fora da geladeira. Longe da cebola: juntas, as duas brotam mais rápido.' },
    cebola:       { nome: 'Cebola roxa',  g: 'f', forma: 'cebola', cat: 'raiz',  dur: 30, precoKg: 5.0,  cor: '#D9488F', dica: 'Fora da geladeira, em cesto arejado. Cebola cortada vai em pote fechado e dura uns cinco dias.' },
    beterraba:    { nome: 'Beterraba',    g: 'f', forma: 'beterraba', cat: 'raiz',  dur: 20, precoKg: 6.0,  cor: '#8E2F4A', dica: 'Separe as folhas (dá para refogar) deixando 2 cm de talo. A raiz vai em saco fechado na gaveta.' },
    mandioquinha: { nome: 'Mandioquinha', g: 'f', forma: 'raiz', cat: 'raiz',  dur: 6,  precoKg: 14.0, cor: '#D3A548', dica: 'Estraga rápido. Guarde sem lavar, em saco de papel na geladeira, ou descasque, cozinhe e congele.' },
    banana:       { nome: 'Banana',       g: 'f', forma: 'banana', cat: 'fruta', dur: 5,  precoKg: 6.5,  cor: '#D8A62A', dica: 'Separe da penca e guarde fora da geladeira. Madura demais vira bolo ou vitamina; dá para congelar sem casca.' },
    maca:         { nome: 'Maçã',         g: 'f', forma: 'maca', cat: 'fruta', dur: 20, precoKg: 11.0, cor: '#B23A33', dica: 'Na geladeira dura semanas. Mantenha longe das outras frutas, ela acelera o amadurecimento delas.' },
    morango:      { nome: 'Morango',      g: 'm', forma: 'morango', cat: 'fruta', dur: 3,  precoKg: 28.0, cor: '#C2304A', dica: 'Não lave antes de guardar. Pote raso forrado com papel, na geladeira. Descarte logo o que tiver mofo para não passar aos outros.' },
    mamao:        { nome: 'Mamão',        g: 'm', forma: 'oval', cat: 'fruta', dur: 5,  precoKg: 7.0,  cor: '#E08A3A', dica: 'Amadurece fora da geladeira, embrulhado em jornal. Maduro, vai para a geladeira e deve ser comido em três dias.' },
    abacate:      { nome: 'Abacate',      g: 'm', forma: 'abacate', cat: 'fruta', dur: 5,  precoKg: 9.0,  cor: '#5E7A2E', dica: 'Fora da geladeira até ceder levemente ao toque. Metade aberta: deixe o caroço, pingue limão e cubra com filme.' },
    limao:        { nome: 'Limão',        g: 'm', forma: 'oval', cat: 'fruta', dur: 15, precoKg: 6.0,  cor: '#7FA83A', dica: 'Saco fechado na geladeira mantém o suco por semanas. Fora dela, resseca em poucos dias.' },
    laranja:      { nome: 'Laranja',      g: 'f', forma: 'oval', cat: 'fruta', dur: 14, precoKg: 4.5,  cor: '#E8891C', dica: 'Fora da geladeira dura cerca de uma semana; na gaveta da geladeira, até duas. Guarde soltas, sem saco fechado, para não mofar.' }
  },

  categorias: {
    folha: 'Folhas e flores',
    erva:  'Temperos',
    fruto: 'Legumes',
    raiz:  'Raízes e bulbos',
    fruta: 'Frutas'
  },

  // Base pequena de receitas para a regra de sugestão (simulada).
  receitas: [
    { id: 'r01', nome: 'Sopa de legumes',              tempo: 40, ingredientes: ['batata', 'cenoura', 'abobrinha', 'cebola', 'cheiroverde'], base: 'azeite, sal, alho' },
    { id: 'r02', nome: 'Couve refogada no alho',       tempo: 10, ingredientes: ['couve', 'cebola'], base: 'alho, azeite' },
    { id: 'r03', nome: 'Salada de folhas com tomate',  tempo: 10, ingredientes: ['alface', 'rucula', 'tomate', 'limao'], base: 'azeite, sal' },
    { id: 'r04', nome: 'Omelete de espinafre',         tempo: 15, ingredientes: ['espinafre', 'tomate', 'cebola', 'cheiroverde'], base: 'ovos, sal' },
    { id: 'r05', nome: 'Bolo de banana de frigideira', tempo: 25, ingredientes: ['banana', 'maca'], base: 'ovos, aveia, canela' },
    { id: 'r06', nome: 'Vitamina de mamão e banana',   tempo: 5,  ingredientes: ['mamao', 'banana'], base: 'leite ou bebida vegetal' },
    { id: 'r07', nome: 'Brócolis salteado com limão',  tempo: 12, ingredientes: ['brocolis', 'cebola', 'limao'], base: 'alho, azeite' },
    { id: 'r08', nome: 'Guacamole',                    tempo: 10, ingredientes: ['abacate', 'tomate', 'cebola', 'limao', 'cheiroverde'], base: 'sal, pimenta' },
    { id: 'r09', nome: 'Abobrinha recheada',           tempo: 35, ingredientes: ['abobrinha', 'tomate', 'cebola', 'pimentao'], base: 'queijo ralado, azeite' },
    { id: 'r10', nome: 'Creme de mandioquinha',        tempo: 30, ingredientes: ['mandioquinha', 'cebola', 'cheiroverde'], base: 'azeite, sal' },
    { id: 'r11', nome: 'Salada de beterraba e cenoura', tempo: 15, ingredientes: ['beterraba', 'cenoura', 'limao'], base: 'azeite, sal' },
    { id: 'r12', nome: 'Morangos com calda de maçã',   tempo: 15, ingredientes: ['morango', 'maca'], base: 'iogurte natural' },
    { id: 'r13', nome: 'Arroz de forno com legumes',   tempo: 35, ingredientes: ['tomate', 'pimentao', 'cenoura', 'cheiroverde'], base: 'arroz cozido, queijo' }
  ],

  // Produtores fictícios da agricultura familiar na região de Curitiba.
  produtores: [
    {
      id: 'pinhal-velho', rumo: 8, nota: '4,9', chamada: 'Folhas orgânicas', sigla: 'PV', nome: 'Sítio Pinhal Velho', responsavel: 'Família Bortolan',
      municipio: 'Colombo, PR', km: 22, cultivo: 'Orgânico certificado', desde: 1998,
      sobre: 'Três gerações cultivando folhas em canteiros cobertos. Irrigação por gotejamento e adubo de compostagem própria.',
      produtos: [
        { alimento: 'alface',      preco: 3.5, unidade: 'pé (≈300 g)', kg: 0.3, colheita: -1, talhao: 'C2' },
        { alimento: 'couve',       preco: 4.0, unidade: 'maço (≈250 g)', kg: 0.25, colheita: -1, talhao: 'C4' },
        { alimento: 'rucula',      preco: 4.5, unidade: 'maço (≈200 g)', kg: 0.2, colheita: 0, talhao: 'C1' },
        { alimento: 'cheiroverde', preco: 3.0, unidade: 'maço (≈100 g)', kg: 0.1, colheita: 0, talhao: 'C3' }
      ]
    },
    {
      id: 'rio-verde', rumo: 192, nota: '4,8', chamada: 'Morango e tomate', sigla: 'RV', nome: 'Chácara Rio Verde', responsavel: 'Família Ostrowski',
      municipio: 'Mandirituba, PR', km: 38, cultivo: 'Em transição agroecológica', desde: 2011,
      sobre: 'Estufas de morango semi-hidropônico e tomate de cultivo protegido. Controle de pragas com insetos benéficos.',
      produtos: [
        { alimento: 'morango',  preco: 12.0, unidade: 'bandeja (≈400 g)', kg: 0.4, colheita: -1, talhao: 'E2' },
        { alimento: 'tomate',   preco: 9.0,  unidade: 'kg', kg: 1, colheita: -2, talhao: 'E1' },
        { alimento: 'pimentao', preco: 13.0, unidade: 'kg', kg: 1, colheita: -2, talhao: 'E3' }
      ]
    },
    {
      id: 'campos-iguacu', rumo: 112, nota: '4,7', chamada: 'Raízes da cooperativa', sigla: 'CI', nome: 'Cooperativa Campos do Iguaçu', responsavel: '14 famílias cooperadas',
      municipio: 'São José dos Pinhais, PR', km: 18, cultivo: 'Convencional com manejo integrado', desde: 2004,
      sobre: 'Cooperativa de pequenos produtores de raízes. Cada lote indica a família que colheu.',
      produtos: [
        { alimento: 'batata',       preco: 6.0,  unidade: 'kg', kg: 1, colheita: -3, talhao: 'Família Ribas · lote 07' },
        { alimento: 'cenoura',      preco: 5.5,  unidade: 'kg', kg: 1, colheita: -2, talhao: 'Família Klein · lote 03' },
        { alimento: 'beterraba',    preco: 6.0,  unidade: 'kg', kg: 1, colheita: -2, talhao: 'Família Klein · lote 05' },
        { alimento: 'mandioquinha', preco: 15.0, unidade: 'kg', kg: 1, colheita: -1, talhao: 'Família Prado · lote 02' }
      ]
    },
    {
      id: 'cachoeirinha', rumo: 88, nota: '4,9', chamada: 'Bananal agroflorestal', sigla: 'CA', nome: 'Sítio Cachoeirinha', responsavel: 'Família Nascimento',
      municipio: 'Morretes, PR', km: 64, cultivo: 'Orgânico certificado', desde: 2007,
      sobre: 'Bananal em sistema agroflorestal na encosta da serra, consorciado com abacate e limão.',
      produtos: [
        { alimento: 'banana',  preco: 6.0, unidade: 'kg', kg: 1, colheita: -2, talhao: 'SAF norte' },
        { alimento: 'abacate', preco: 8.0, unidade: 'kg', kg: 1, colheita: -3, talhao: 'SAF sul' },
        { alimento: 'limao',   preco: 5.0, unidade: 'kg', kg: 1, colheita: -1, talhao: 'SAF sul' }
      ]
    },
    {
      id: 'vale-iguacu', rumo: 262, nota: '4,8', chamada: 'Maçã e horta de inverno', sigla: 'VI', nome: 'Pomar Vale do Iguaçu', responsavel: 'Família Woitowicz',
      municipio: 'Porto Amazonas, PR', km: 70, cultivo: 'Produção integrada', desde: 1989,
      sobre: 'Pomar de maçã de clima frio e horta de inverno. Venda direta desde 2015.',
      produtos: [
        { alimento: 'maca',      preco: 10.0, unidade: 'kg', kg: 1, colheita: -4, talhao: 'Quadra 6' },
        { alimento: 'brocolis',  preco: 7.0,  unidade: 'unidade (≈450 g)', kg: 0.45, colheita: -1, talhao: 'Horta 2' },
        { alimento: 'abobrinha', preco: 7.0,  unidade: 'kg', kg: 1, colheita: -1, talhao: 'Horta 1' }
      ]
    }
  ],

  perfil: { nome: 'Marina Lopes', usuario: 'marina.cwb', cidade: 'Curitiba, PR' },

  pontoRetirada: 'Ponto Roots do bairro · sábados, 8h às 12h',

  // Estado inicial da demo. "dias" é relativo à data de hoje, para a demo nunca envelhecer.
  exemplo: {
    despensa: [
      { a: 'tomate',      kg: 1.0,  dias: 0,  origem: 'rio-verde' },
      { a: 'alface',      kg: 0.3,  dias: 0,  origem: 'pinhal-velho' },
      { a: 'banana',      kg: 0.8,  dias: 1 },
      { a: 'espinafre',   kg: 0.25, dias: 2 },
      { a: 'morango',     kg: 0.4,  dias: 2,  origem: 'rio-verde' },
      { a: 'mamao',       kg: 1.2,  dias: 3 },
      { a: 'abobrinha',   kg: 0.6,  dias: 5 },
      { a: 'cheiroverde', kg: 0.1,  dias: 4,  origem: 'pinhal-velho' },
      { a: 'limao',       kg: 0.5,  dias: 11, origem: 'cachoeirinha' },
      { a: 'cenoura',     kg: 1.0,  dias: 14, origem: 'campos-iguacu' },
      { a: 'cebola',      kg: 1.0,  dias: 21 },
      { a: 'batata',      kg: 2.0,  dias: 24 }
    ],
    historico: [
      { a: 'banana',     kg: 0.9,  tipo: 'usado',      urgente: true,  dias: -2 },
      { a: 'couve',      kg: 0.25, tipo: 'usado',      urgente: true,  dias: -3 },
      { a: 'tomate',     kg: 0.4,  tipo: 'descartado',                 dias: -4 },
      { a: 'cenoura',    kg: 0.5,  tipo: 'usado',                      dias: -5 },
      { a: 'morango',    kg: 0.4,  tipo: 'usado',      urgente: true,  dias: -8 },
      { a: 'alface',     kg: 0.3,  tipo: 'descartado',                 dias: -9 },
      { a: 'mamao',      kg: 1.1,  tipo: 'usado',      urgente: true,  dias: -10 },
      { a: 'abobrinha',  kg: 0.6,  tipo: 'usado',      urgente: true,  dias: -12 },
      { a: 'batata',     kg: 1.0,  tipo: 'usado',                      dias: -13 },
      { a: 'espinafre',  kg: 0.25, tipo: 'descartado',                 dias: -16 },
      { a: 'brocolis',   kg: 0.45, tipo: 'usado',      urgente: true,  dias: -17 },
      { a: 'banana',     kg: 0.7,  tipo: 'descartado',                 dias: -19 },
      { a: 'tomate',     kg: 0.8,  tipo: 'usado',      urgente: true,  dias: -22 },
      { a: 'rucula',     kg: 0.2,  tipo: 'descartado',                 dias: -24 },
      { a: 'mandioquinha', kg: 0.5, tipo: 'descartado',                dias: -25 },
      { a: 'cheiroverde', kg: 0.1, tipo: 'usado',      urgente: true,  dias: -26 }
    ]
  }
};
