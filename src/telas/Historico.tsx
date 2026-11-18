'use client';
import { useState } from 'react';
import { Alimento } from '@/components/Svg';
import { dados } from '@/lib/dados';
import { dataCurta } from '@/lib/datas';
import { useEstado } from '@/lib/estado';
import { brl, peso } from '@/lib/formato';
import s from './Historico.module.css';

type Tipo = 'todos' | 'salvo' | 'usado' | 'descartado';
const POR_PAGINA = 20;

export default function Historico() {
  const estado = useEstado();
  const [filtro, setFiltro] = useState<Tipo>('todos');
  const [limite, setLimite] = useState(POR_PAGINA);
  if (!estado) return <section aria-busy="true"><h1 className="selo-titulo">Histórico</h1><div className="esqueleto" /></section>;

  const regs = estado.historico
    .map((h) => ({ h, tipo: (h.tipo === 'usado' ? (h.urgente ? 'salvo' : 'usado') : 'descartado') as Exclude<Tipo, 'todos'> }))
    .filter((x) => filtro === 'todos' || x.tipo === filtro)
    .sort((a, b) => b.h.data.localeCompare(a.h.data));
  const filtros: [Tipo, string][] = [['todos', 'Tudo'], ['salvo', 'Salvos'], ['usado', 'Usados'], ['descartado', 'Descartados']];

  return (
    <section aria-labelledby="t-historico">
      <h1 className="selo-titulo" id="t-historico" tabIndex={-1}>Histórico</h1>
      <p className="texto-apoio">&ldquo;Salvo&rdquo; é o que você usou a até 3 dias do vencimento.</p>
      <div className={s.filtros} role="group" aria-label="Filtrar registros">
        {filtros.map(([f, r]) => (
          <button key={f} type="button" aria-pressed={filtro === f} onClick={() => { setFiltro(f); setLimite(POR_PAGINA); }}>{r}</button>
        ))}
      </div>
      {regs.length ? (
        <>
          <ul className={s.lista}>
            {regs.slice(0, limite).map(({ h, tipo }) => (
              <li key={h.id} className={`${s.registro} ${s[tipo]}`}>
                <Alimento id={h.alimento} tamanho={40} />
                <span className={s.texto}>
                  <strong>{dados.alimentos[h.alimento].nome}</strong> {peso(h.kg)} · {brl(h.valor)}
                  <small>{dataCurta(h.data)}</small>
                </span>
                <span className={s.tipo}>{tipo}</span>
              </li>
            ))}
          </ul>
          {regs.length > limite ? (
            <button type="button" className="botao botao--contorno botao--largo" style={{ marginTop: 12 }} onClick={() => setLimite((l) => l + POR_PAGINA)}>
              Ver mais ({regs.length - limite})
            </button>
          ) : null}
        </>
      ) : (
        <p className="vazio">Nenhum registro neste filtro.</p>
      )}
    </section>
  );
}
