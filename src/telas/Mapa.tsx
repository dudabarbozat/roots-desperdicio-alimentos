'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icone } from '@/components/Icones';
import { dados } from '@/lib/dados';
import { useEstado } from '@/lib/estado';
import { km } from '@/lib/formato';
import { pontoRetirada, produtoresPerto } from '@/lib/local';
import SeletorLocal from './SeletorLocal';
import s from './Mapa.module.css';

const MapaLeaflet = dynamic(() => import('@/components/MapaLeaflet'), {
  ssr: false,
  loading: () => <div className={`esqueleto ${s.carregando}`} aria-label="Carregando mapa" />
});

export default function Mapa() {
  const estado = useEstado();
  const [busca, setBusca] = useState('');
  const [sel, setSel] = useState('');
  const [semTiles, setSemTiles] = useState(false);
  const todos = useMemo(() => (estado ? produtoresPerto(estado.local) : []), [estado]);
  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return todos;
    return todos.filter(({ p }) =>
      `${p.nome} ${p.municipio} ${p.produtos.map((x) => dados.alimentos[x.alimento].nome).join(' ')}`.toLowerCase().includes(q));
  }, [todos, busca]);
  const retirada = useMemo(() => (estado ? pontoRetirada(estado.local) : null), [estado]);

  if (!estado || !retirada) {
    return <section aria-busy="true"><h1 className="sr">Mapa de produtores</h1><div className={`esqueleto ${s.carregando}`} /></section>;
  }
  const atual = lista.find((x) => x.p.id === sel) ?? lista[0];

  return (
    <section className={s.tela} aria-labelledby="t-mapa">
      <h1 className="sr" id="t-mapa" tabIndex={-1}>Mapa de produtores</h1>
      <div className={s.mapa}>
        <MapaLeaflet local={estado.local} produtores={lista} retirada={retirada} selecionado={atual?.p.id ?? ''}
          aoSelecionar={setSel} aoFalharTiles={() => setSemTiles(true)} />
        {semTiles ? <p className={s.aviso} role="status">Parte do mapa não carregou. Verifique a conexão.</p> : null}
      </div>
      <div className={s.painel}>
        <SeletorLocal />
        <div className={s.info} aria-live="polite">
          {atual ? (
            <>
              <p className={s.rotulo}>Produtor · a {km(atual.distancia)} de você</p>
              <p className={s.nome}>{atual.p.nome}</p>
              <p className={s.meta}>{atual.p.chamada} · <span>{atual.p.cultivo}</span></p>
            </>
          ) : (
            <p className={s.nome}>Nenhum produtor encontrado para &ldquo;{busca}&rdquo;.</p>
          )}
        </div>
        <div className={s.busca}>
          <label className="sr" htmlFor="busca-produtor">Buscar produtores</label>
          <input id="busca-produtor" type="search" placeholder="Buscar produtores ou alimentos" value={busca}
            onChange={(e) => setBusca(e.target.value)} autoComplete="off" />
          <Icone nome="lupa" />
        </div>
        {lista.length > 1 ? (
          <ul className={s.chips} aria-label="Produtores encontrados">
            {lista.map((x) => (
              <li key={x.p.id}>
                <button type="button" aria-pressed={x.p.id === atual?.p.id} onClick={() => setSel(x.p.id)}>
                  {x.p.nome} · {km(x.distancia)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {atual ? <Link className="botao botao--primario botao--largo" href={`/feira/${atual.p.id}/`}>Ir para o catálogo</Link> : null}
      </div>
    </section>
  );
}
