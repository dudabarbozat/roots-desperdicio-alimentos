export type Categoria = 'folha' | 'erva' | 'fruto' | 'raiz' | 'fruta';
export type Forma =
  | 'alface' | 'folhaLarga' | 'folhaFina' | 'brocolis' | 'ramos' | 'redondo' | 'capsula' | 'pimentao'
  | 'cenoura' | 'batata' | 'cebola' | 'beterraba' | 'raiz' | 'banana' | 'maca' | 'morango' | 'oval' | 'abacate';

export interface Alimento {
  nome: string;
  g: 'm' | 'f';
  forma: Forma;
  cat: Categoria;
  dur: number;
  precoKg: number;
  cor: string;
  dica: string;
}

export interface Receita {
  id: string;
  nome: string;
  tempo: number;
  ingredientes: string[];
  base: string;
}

export interface ProdutoFeira {
  alimento: string;
  preco: number;
  unidade: string;
  kg: number;
  colheita: number;
  talhao: string;
}

export interface Produtor {
  id: string;
  rumo: number;
  nota: string;
  chamada: string;
  sigla: string;
  nome: string;
  responsavel: string;
  municipio: string;
  km: number;
  cultivo: string;
  desde: number;
  sobre: string;
  produtos: ProdutoFeira[];
}

export interface Dados {
  alimentos: Record<string, Alimento>;
  categorias: Record<Categoria, string>;
  receitas: Receita[];
  produtores: Produtor[];
  perfil: { nome: string; usuario: string; cidade: string };
  pontoRetirada: string;
  exemplo: {
    despensa: { a: string; kg: number; dias: number; origem?: string }[];
    historico: { a: string; kg: number; tipo: 'usado' | 'descartado'; urgente?: boolean; dias: number }[];
  };
}

export type Status = 'hoje' | 'breve' | 'ok';

export interface ItemDespensa {
  id: string;
  alimento: string;
  kg: number;
  validade: string;
  origem: string | null;
}

export interface Registro {
  id: string;
  alimento: string;
  kg: number;
  valor: number;
  tipo: 'usado' | 'descartado';
  urgente: boolean;
  data: string;
}

export interface Local {
  lat: number;
  lng: number;
  rotulo: string;
  cidade: string;
  fonte: 'padrao' | 'cep' | 'gps';
}

export interface Estado {
  versao: 2;
  seq: number;
  entrou: boolean;
  orientado: boolean;
  perfil: { nome: string; usuario: string; cidade: string };
  despensa: ItemDespensa[];
  historico: Registro[];
  local: Local;
  metaKg: number;
  lembretes: { ativo: boolean; avisados: Record<string, string> };
}
