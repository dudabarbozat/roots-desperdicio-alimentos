'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Icone } from '@/components/Icones';
import { Alimento } from '@/components/Svg';
import { useAviso } from '@/components/Toast';
import { dados } from '@/lib/dados';
import { diasAte, nomeDia } from '@/lib/datas';
import { acoes, useEstado } from '@/lib/estado';
import { prazoCurto } from '@/lib/formato';
import { passosReceita, status, sugerirCardapio, type Sugestao } from '@/lib/regras';
import type { ItemDespensa } from '@/lib/tipos';
import s from './Receitas.module.css';

const DIAS = 3;

function prazoDe(despensa: ItemDespensa[], alimento: string): number {
  return Math.min(...despensa.filter((i) => i.alimento === alimento).map((i) => diasAte(i.validade)));
}

export default function Receitas() {
  const estado = useEstado();
  const avisar = useAviso();
  const plano = useMemo<Sugestao[]>(() => (estado ? sugerirCardapio(estado.despensa, DIAS) : []), [estado]);

  if (!estado) return <section aria-busy="true"><h1 className="selo-titulo">O que cozinhar</h1><div className="esqueleto" /></section>;

  const cozinhei = (p: Sugestao) => {
    // registra como usado o item que vence primeiro de cada ingrediente da receita
    const desfazeres: (() => void)[] = [];
    for (const a of p.tem) {
      const alvo = estado.despensa.filter((i) => i.alimento === a).sort((x, y) => x.validade.localeCompare(y.validade))[0];
      if (alvo) {
        const d = acoes.registrarSaida(alvo.id, 'usado');
        if (d) desfazeres.push(d);
      }
    }
    if (desfazeres.length) {
      avisar(`${desfazeres.length} ${desfazeres.length === 1 ? 'item saiu' : 'itens saíram'} da despensa como usados.`, () => desfazeres.reverse().forEach((f) => f()));
    }
  };

  return (
    <section aria-labelledby="t-receitas">
      <h1 className="selo-titulo" id="t-receitas" tabIndex={-1}>O que cozinhar</h1>
      <p className="texto-apoio">Cardápio dos próximos {DIAS} dias usando primeiro o que vence antes.</p>

      {plano.length ? (
        <ol className={s.lista}>
          {plano.map((p, i) => (
            <li key={p.receita.id} className={s.receita}>
              <Alimento id={p.tem[0]} tamanho={52} />
              <div className={s.corpo}>
                <p className={s.dia}>{nomeDia(i)}</p>
                <h2 className={s.nome}>{p.receita.nome}</h2>
                <p className={s.meta}>{p.receita.tempo} min · também leva {p.receita.base}</p>
                <ul className={s.ings} aria-label="Ingredientes">
                  {p.tem.filter((a) => estado.despensa.some((it) => it.alimento === a)).map((a) => {
                    const d = prazoDe(estado.despensa, a);
                    return <li key={a} className={`${s.ing} ${s[status(d)]}`}>{dados.alimentos[a].nome} <span>{prazoCurto(d)}</span></li>;
                  })}
                  {p.falta.map((a) => <li key={a} className={`${s.ing} ${s.falta}`}>{dados.alimentos[a].nome} <span>comprar</span></li>)}
                </ul>
                <details className={s.passos}>
                  <summary>Modo de preparo</summary>
                  <ol>{passosReceita(p.receita).map((t, k) => <li key={k}>{t}</li>)}</ol>
                </details>
                <button type="button" className="botao botao--contorno botao--pequeno" onClick={() => cozinhei(p)}>
                  <Icone nome="check" /> Cozinhei
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="vazio">
          Sem itens dentro da validade para sugerir receitas.
          <Link className="botao botao--primario botao--pequeno" href="/despensa/">Adicionar compras</Link>
        </div>
      )}

      <details className={s.regra}>
        <summary>Como o cardápio é montado</summary>
        <p>
          Cada uma das {dados.receitas.length} receitas da base ganha pontos pelos ingredientes que você tem, com peso maior para o que vence antes;
          ingredientes que faltam descontam. A melhor vai para hoje, os ingredientes dela saem da conta e o cálculo se repete para os dias seguintes.
          Itens vencidos ficam de fora.
        </p>
      </details>
    </section>
  );
}
