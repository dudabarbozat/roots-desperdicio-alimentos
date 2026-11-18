'use client';
/* Estado da demo em localStorage, exposto como store externa para o React. */
import { useSyncExternalStore } from 'react';
import { dados } from './dados';
import { diasAte, hoje, ISO_RE, somaDias } from './datas';
import { valorDe } from './regras';
import type { Estado, ItemDespensa, Local, Registro } from './tipos';

const CHAVE = 'roots:v2';
const CHAVE_V1 = 'roots:v1';

export const LOCAL_PADRAO: Local = { lat: -25.4284, lng: -49.2733, rotulo: 'Centro, Curitiba', cidade: 'Curitiba', fonte: 'padrao' };

// Histórico mais antigo, gerado de forma determinística para a evolução mensal.
function historicoAntigo(h: string, n0: number): Registro[] {
  const ids = Object.keys(dados.alimentos);
  const out: Registro[] = [];
  let n = n0;
  for (let mes = 1; mes <= 5; mes++) {
    const qtd = 9 + ((mes * 3) % 5);
    for (let i = 0; i < qtd; i++) {
      const a = ids[(mes * 7 + i * 5) % ids.length];
      const kg = [0.25, 0.4, 0.5, 0.8, 1, 0.3][(i + mes) % 6];
      // aproveitamento melhora com o tempo: meses recentes descartam menos
      const descartado = (i + mes) % 10 < 1 + mes;
      const urgente = !descartado && i % 2 === 0;
      n++;
      out.push({
        id: `h${n}`, alimento: a, kg, valor: valorDe(a, kg), tipo: descartado ? 'descartado' : 'usado', urgente,
        data: somaDias(h, -(30 * mes) - ((i * 3) % 28))
      });
    }
  }
  return out;
}

export function exemplo(): Estado {
  const h = hoje();
  let n = 0;
  const despensa = dados.exemplo.despensa.map((it) => {
    n++;
    return { id: `i${n}`, alimento: it.a, kg: it.kg, validade: somaDias(h, it.dias), origem: it.origem ?? null };
  });
  const recentes: Registro[] = dados.exemplo.historico.map((e) => {
    n++;
    return { id: `h${n}`, alimento: e.a, kg: e.kg, valor: valorDe(e.a, e.kg), tipo: e.tipo, urgente: !!e.urgente, data: somaDias(h, e.dias) };
  });
  return {
    versao: 2,
    seq: 1000,
    entrou: false,
    orientado: false,
    perfil: { ...dados.perfil },
    despensa,
    historico: [...historicoAntigo(h, 500), ...recentes],
    local: { ...LOCAL_PADRAO },
    metaKg: 6,
    lembretes: { ativo: false, avisados: {} }
  };
}

function itemValido(i: unknown): i is ItemDespensa {
  const x = i as ItemDespensa;
  return !!x && typeof x.id === 'string' && !!dados.alimentos[x.alimento] && typeof x.kg === 'number' && ISO_RE.test(x.validade);
}

function valido(s: unknown): s is Estado {
  const x = s as Estado;
  return !!x && x.versao === 2 && Array.isArray(x.despensa) && Array.isArray(x.historico) && x.despensa.every(itemValido) &&
    !!x.local && typeof x.local.lat === 'number';
}

function ler(): Estado {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      const s: unknown = JSON.parse(bruto);
      if (valido(s)) return s;
    }
    // migra a despensa da versão anterior do protótipo, se existir
    const v1 = localStorage.getItem(CHAVE_V1);
    if (v1) {
      const antigo = JSON.parse(v1) as { despensa?: unknown[]; historico?: Registro[]; perfil?: Estado['perfil']; entrou?: boolean };
      const base = exemplo();
      if (Array.isArray(antigo.despensa) && antigo.despensa.every(itemValido)) base.despensa = antigo.despensa as ItemDespensa[];
      if (Array.isArray(antigo.historico)) base.historico = [...base.historico.filter((r) => diasAte(r.data) <= -30), ...antigo.historico];
      if (antigo.perfil) base.perfil = antigo.perfil;
      base.entrou = !!antigo.entrou;
      return base;
    }
  } catch {
    /* armazenamento indisponível ou corrompido: volta ao exemplo */
  }
  return exemplo();
}

let estado: Estado | null = null;
const ouvintes = new Set<() => void>();

function atual(): Estado {
  if (!estado) estado = ler();
  return estado;
}

function gravar(novo: Estado) {
  estado = novo;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(novo));
  } catch {
    /* modo privado ou cota cheia: segue só em memória */
  }
  ouvintes.forEach((f) => f());
}

function assinar(f: () => void) {
  ouvintes.add(f);
  const aoMudarOutraAba = (e: StorageEvent) => {
    if (e.key === CHAVE) {
      estado = ler();
      f();
    }
  };
  window.addEventListener('storage', aoMudarOutraAba);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener('storage', aoMudarOutraAba);
  };
}

/** Retorna null durante a pré-renderização estática; no navegador, o estado salvo. */
export function useEstado(): Estado | null {
  return useSyncExternalStore(assinar, atual, () => null);
}

function atualizar(f: (s: Estado) => Estado) {
  gravar(f(atual()));
}

function novoId(s: Estado, prefixo: string): [string, number] {
  const seq = s.seq + 1;
  return [`${prefixo}${seq}`, seq];
}

export const acoes = {
  entrar(sim: boolean) {
    atualizar((s) => ({ ...s, entrou: sim }));
  },
  orientar() {
    atualizar((s) => ({ ...s, orientado: true }));
  },
  salvarPerfil(p: Estado['perfil']) {
    atualizar((s) => ({ ...s, perfil: p }));
  },
  definirLocal(l: Local) {
    atualizar((s) => ({ ...s, local: l }));
  },
  definirMeta(kg: number) {
    atualizar((s) => ({ ...s, metaKg: kg }));
  },
  lembretes(ativo: boolean) {
    atualizar((s) => ({ ...s, lembretes: { ...s.lembretes, ativo } }));
  },
  marcarAvisado(ids: string[]) {
    const d = hoje();
    atualizar((s) => {
      const avisados = { ...s.lembretes.avisados };
      ids.forEach((id) => (avisados[id] = d));
      return { ...s, lembretes: { ...s.lembretes, avisados } };
    });
  },
  adicionar(itens: Omit<ItemDespensa, 'id'>[]) {
    atualizar((s) => {
      let seq = s.seq;
      const novos = itens.map((i) => {
        seq++;
        return { ...i, id: `i${seq}` };
      });
      return { ...s, seq, despensa: [...s.despensa, ...novos] };
    });
  },
  /** Retira o item da despensa e registra no histórico. Devolve uma função para desfazer. */
  registrarSaida(id: string, tipo: 'usado' | 'descartado'): (() => void) | null {
    const s = atual();
    const idx = s.despensa.findIndex((i) => i.id === id);
    if (idx < 0) return null;
    const item = s.despensa[idx];
    const [rid, seq] = novoId(s, 'h');
    const reg: Registro = {
      id: rid, alimento: item.alimento, kg: item.kg, valor: valorDe(item.alimento, item.kg), tipo,
      urgente: tipo === 'usado' && diasAte(item.validade) <= 3, data: hoje()
    };
    gravar({ ...s, seq, despensa: s.despensa.filter((i) => i.id !== id), historico: [...s.historico, reg] });
    return () => {
      atualizar((t) => {
        const despensa = [...t.despensa];
        despensa.splice(Math.min(idx, despensa.length), 0, item);
        return { ...t, despensa, historico: t.historico.filter((h) => h.id !== rid) };
      });
    };
  },
  restaurar() {
    const s = atual();
    const novo = exemplo();
    novo.entrou = s.entrou;
    novo.orientado = s.orientado;
    gravar(novo);
  }
};
