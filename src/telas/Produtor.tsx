'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Icone } from '@/components/Icones';
import { Alimento, Cena } from '@/components/Svg';
import { useAviso } from '@/components/Toast';
import { dados } from '@/lib/dados';
import { dataCurta, hoje, somaDias } from '@/lib/datas';
import { acoes, useEstado } from '@/lib/estado';
import { brl, km, peso } from '@/lib/formato';
import { naRegiaoOriginal, produtoresPerto } from '@/lib/local';
import type { ProdutoFeira, Produtor as TProdutor } from '@/lib/tipos';
import s from './Produtor.module.css';

function codigoLote(p: TProdutor, pr: ProdutoFeira) {
  const c = somaDias(hoje(), pr.colheita).replace(/-/g, '').slice(2);
  return `${p.sigla}-${c}-${String(p.produtos.indexOf(pr) + 1).padStart(2, '0')}`;
}

function Produto({ p, pr }: { p: TProdutor; pr: ProdutoFeira }) {
  const avisar = useAviso();
  const [qtd, setQtd] = useState(1);
  const a = dados.alimentos[pr.alimento];
  const unidade = pr.unidade.replace(/ \(.*/, '');
  const aprox = pr.unidade.includes('(') ? pr.unidade.replace(/.*\((.*)\)/, '$1') : '';
  const h = hoje();
  const colheita = somaDias(h, pr.colheita);
  const embalagem = somaDias(h, Math.min(pr.colheita + 1, 0));
  const id = `qtd-${pr.alimento}`;
  const adicionar = () => {
    const kg = Math.round(pr.kg * qtd * 100) / 100;
    acoes.adicionar([{ alimento: pr.alimento, kg, validade: somaDias(h, a.dur + Math.min(pr.colheita, 0)), origem: p.id }]);
    avisar(`${a.nome} (${peso(kg)}) na despensa.`);
  };
  return (
    <li className={s.produto}>
      <div className={s.linha}>
        <Alimento id={pr.alimento} tamanho={44} />
        <span className={s.nome}>{a.nome}</span>
        <span className={s.preco}>{brl(pr.preco)} por {unidade}{aprox ? <small>{aprox}</small> : null}</span>
        <span className={s.passo}>
          <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} aria-label={`Diminuir quantidade de ${a.nome}`}>−</button>
          <label className="sr" htmlFor={id}>Quantidade de {a.nome}</label>
          <input id={id} type="number" min={1} max={9} inputMode="numeric" value={qtd}
            onChange={(e) => setQtd(Math.max(1, Math.min(9, Math.round(Number(e.target.value)) || 1)))} />
          <button type="button" onClick={() => setQtd((q) => Math.min(9, q + 1))} aria-label={`Aumentar quantidade de ${a.nome}`}>+</button>
        </span>
        <button type="button" className={s.add} onClick={adicionar}>Adicionar</button>
      </div>
      <details className={s.rastreio}>
        <summary><Icone nome="lote" /><span>Lote {codigoLote(p, pr)}</span></summary>
        <ol className={s.tempo}>
          <li><strong>Colheita</strong><span>{dataCurta(colheita)} · {pr.talhao}</span></li>
          <li><strong>Seleção e embalagem</strong><span>{dataCurta(embalagem)} · {p.nome}</span></li>
          <li><strong>Retirada</strong><span>{dados.pontoRetirada}</span></li>
        </ol>
      </details>
    </li>
  );
}

export default function Produtor({ id }: { id: string }) {
  const estado = useEstado();
  const p = dados.produtores.find((x) => x.id === id);
  if (!p) {
    return <section><h1 className="selo-titulo">Produtor não encontrado</h1><Link href="/feira/">Voltar para a feira</Link></section>;
  }
  const noMapa = estado ? produtoresPerto(estado.local).find((x) => x.p.id === id) : undefined;
  const regiao = estado ? naRegiaoOriginal(estado.local) : true;
  return (
    <section aria-labelledby="t-produtor">
      <Cena id={p.id} className={s.foto} />
      <h1 className={s.titulo} id="t-produtor" tabIndex={-1}>{p.nome}</h1>
      <div className={s.ficha}>
        <p><strong>$ · {p.cultivo}</strong></p>
        <p>{p.responsavel} · desde {p.desde}</p>
        <p>
          {regiao ? `${p.municipio} · ` : ''}
          {noMapa ? <strong className={s.dist}>a {km(noMapa.distancia)} de você</strong> : <span className={s.distEsq}>calculando distância…</span>}
        </p>
        <p className={s.sobre}>{p.sobre}</p>
      </div>
      <span className={s.seta}><Icone nome="seta" /></span>
      <ul className={s.produtos}>
        {p.produtos.map((pr) => <Produto key={pr.alimento} p={p} pr={pr} />)}
      </ul>
      <Link className="botao botao--verde botao--largo" href="/despensa/" style={{ marginTop: 16 }}>Ir para a despensa</Link>
      <p className={s.nota}>Produtor, preços e lotes fictícios; a foto mostra uma lavoura real sem relação com ele (<Link href="/creditos/">créditos</Link>). Não há compra nem pagamento na demo.</p>
    </section>
  );
}
