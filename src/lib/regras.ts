/* Regras de negócio: prazos, valores e o cardápio determinístico. */
import { dados } from './dados';
import { diasAte } from './datas';
import type { ItemDespensa, Receita, Status } from './tipos';

export function status(dias: number): Status {
  if (dias <= 0) return 'hoje';
  if (dias <= 3) return 'breve';
  return 'ok';
}

export function valorDe(alimento: string, kg: number): number {
  const a = dados.alimentos[alimento];
  return a ? Math.round(a.precoKg * kg * 100) / 100 : 0;
}

export function seu(id: string): string {
  return dados.alimentos[id]?.g === 'f' ? 'Sua' : 'Seu';
}

export interface ItemVisivel {
  it: ItemDespensa;
  dias: number;
  st: Status;
}

export function ordenar(despensa: ItemDespensa[]): ItemVisivel[] {
  return despensa
    .map((it) => {
      const dias = diasAte(it.validade);
      return { it, dias, st: status(dias) };
    })
    .sort((x, y) => x.dias - y.dias || dados.alimentos[x.it.alimento].nome.localeCompare(dados.alimentos[y.it.alimento].nome, 'pt-BR'));
}

export interface Sugestao {
  receita: Receita;
  pontos: number;
  tem: string[];
  falta: string[];
  prazos: Record<string, number>;
}

/** Pontua cada receita pelos ingredientes disponíveis, com peso maior para o que vence antes;
 *  escolhe a melhor, retira seus ingredientes do estoque e repete para os dias seguintes. */
export function sugerirCardapio(despensa: ItemDespensa[], qtdDias: number): Sugestao[] {
  const estoque: Record<string, number> = {};
  for (const it of despensa) {
    const d = diasAte(it.validade);
    if (d < 0) continue;
    if (!(it.alimento in estoque) || d < estoque[it.alimento]) estoque[it.alimento] = d;
  }
  const usadas = new Set<string>();
  const plano: Sugestao[] = [];
  for (let k = 0; k < qtdDias; k++) {
    let melhor: Sugestao | null = null;
    for (const r of dados.receitas) {
      if (usadas.has(r.id)) continue;
      const tem = r.ingredientes.filter((a) => a in estoque);
      if (!tem.length) continue;
      const falta = r.ingredientes.filter((a) => !(a in estoque));
      const pontos = tem.reduce((s, a) => s + 10 / (1 + estoque[a]), 0) + tem.length * 0.5 - falta.length * 0.75;
      if (!melhor || pontos > melhor.pontos + 1e-9) {
        const prazos: Record<string, number> = {};
        tem.forEach((a) => (prazos[a] = estoque[a]));
        melhor = { receita: r, pontos, tem: [...tem].sort((x, y) => estoque[x] - estoque[y]), falta, prazos };
      }
    }
    if (!melhor) break;
    usadas.add(melhor.receita.id);
    melhor.tem.forEach((a) => delete estoque[a]);
    plano.push(melhor);
  }
  return plano;
}

/** Passos curtos padrão para as receitas da base local. */
export function passosReceita(r: Receita): string[] {
  const nomes = r.ingredientes.map((a) => dados.alimentos[a].nome.toLowerCase());
  return [
    `Lave e corte ${nomes.slice(0, 3).join(', ')}${nomes.length > 3 ? ' e o restante' : ''}.`,
    `Separe a base: ${r.base}.`,
    r.tempo <= 10 ? 'Monte e sirva na hora.' : `Cozinhe por cerca de ${Math.max(5, r.tempo - 10)} minutos, mexendo de vez em quando.`,
    'Prove, ajuste o sal e sirva.'
  ];
}
