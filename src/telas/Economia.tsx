'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Icone } from '@/components/Icones';
import { useAviso } from '@/components/Toast';
import { mesCurto } from '@/lib/datas';
import { acoes, useEstado } from '@/lib/estado';
import { brl, peso } from '@/lib/formato';
import { ordenar } from '@/lib/regras';
import type { Registro } from '@/lib/tipos';
import s from './Economia.module.css';

const somaKg = (l: Registro[]) => l.reduce((t, r) => t + r.kg, 0);
const somaValor = (l: Registro[]) => l.reduce((t, r) => t + r.valor, 0);
const salvos = (l: Registro[]) => l.filter((r) => r.tipo === 'usado' && r.urgente);
const descartados = (l: Registro[]) => l.filter((r) => r.tipo === 'descartado');

function Anel({ pct, titulo, legenda }: { pct: number; titulo: string; legenda: string }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <figure className={s.anel}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r={r} className={s.trilha} />
        {v > 0 ? <circle cx="40" cy="40" r={r} className={s.valor} strokeDasharray={`${((c * v) / 100).toFixed(1)} ${c.toFixed(1)}`} transform="rotate(-90 40 40)" /> : null}
        <text x="40" y="47" textAnchor="middle">{v}%</text>
      </svg>
      <figcaption><strong>{titulo}</strong>{legenda}</figcaption>
    </figure>
  );
}

function Meta({ atual, meta }: { atual: number; meta: number }) {
  const avisar = useAviso();
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(String(meta));
  const n = Number(valor.replace(',', '.'));
  const erro = !(n >= 1 && n <= 100) ? 'Use uma meta entre 1 e 100 kg.' : '';
  const pct = meta > 0 ? Math.min(100, (atual / meta) * 100) : 0;
  const falta = Math.max(0, meta - atual);
  return (
    <div className={s.meta}>
      <div className={s.metaTopo}>
        <p className={s.metaRotulo}><Icone nome="alvo" /> Meta do mês</p>
        {!editando ? <button type="button" className="link" onClick={() => { setValor(String(meta)); setEditando(true); }}>Alterar meta</button> : null}
      </div>
      <p className={s.metaNumero}><strong>{peso(atual)}</strong> de {peso(meta)} salvos do lixo</p>
      <div className={s.barraMeta} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progresso da meta do mês">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className={s.metaFalta}>{falta > 0 ? `Faltam ${peso(falta)}. Use primeiro o que vence antes.` : 'Meta do mês batida.'}</p>
      {editando ? (
        <form className={s.metaForm} noValidate onSubmit={(e) => {
          e.preventDefault();
          if (erro) return;
          acoes.definirMeta(Math.round(n * 10) / 10);
          setEditando(false);
          avisar('Meta atualizada.');
        }}>
          <div className="campo">
            <label htmlFor="meta-kg">Meta mensal (kg)</label>
            <input id="meta-kg" className="entrada" type="number" inputMode="decimal" min={1} max={100} step={0.5} value={valor}
              aria-invalid={!!erro} aria-describedby="meta-erro" onChange={(e) => setValor(e.target.value)} />
            {erro ? <span id="meta-erro" className="erro-campo">{erro}</span> : null}
          </div>
          <div className={s.metaAcoes}>
            <button type="button" className="botao botao--contorno botao--pequeno" onClick={() => setEditando(false)}>Cancelar</button>
            <button type="submit" className="botao botao--primario botao--pequeno">Salvar meta</button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default function Economia() {
  const estado = useEstado();
  if (!estado) return <section aria-busy="true"><h1 className="selo-titulo">Seu impacto</h1><div className="esqueleto" style={{ minHeight: 220 }} /></section>;

  const agora = new Date();
  const doMes = (ano: number, mes: number) => estado.historico.filter((r) => {
    const [a, m] = r.data.split('-').map(Number);
    return a === ano && m - 1 === mes;
  });
  const mesAtual = doMes(agora.getFullYear(), agora.getMonth());
  const salvoMes = somaKg(salvos(mesAtual));

  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(agora.getFullYear(), agora.getMonth() - (5 - i), 1);
    const l = doMes(d.getFullYear(), d.getMonth());
    return { rotulo: mesCurto(d.getFullYear(), d.getMonth()), salvo: somaKg(salvos(l)), desc: somaKg(descartados(l)), atual: i === 5 };
  });
  const max = Math.max(estado.metaKg, ...meses.map((m) => Math.max(m.salvo, m.desc)), 1);

  const usadosMes = mesAtual.filter((r) => r.tipo === 'usado');
  const kgUsado = somaKg(usadosMes);
  const kgDesc = somaKg(descartados(mesAtual));
  const aproveitamento = kgUsado + kgDesc > 0 ? (kgUsado / (kgUsado + kgDesc)) * 100 : 0;
  const antes = meses.slice(0, 5).filter((m) => m.salvo + m.desc > 0);
  const itens = ordenar(estado.despensa);
  const risco = itens.filter((x) => x.dias >= 0 && x.dias <= 3);
  const kgRisco = risco.reduce((t, x) => t + x.it.kg, 0);
  const kgTotal = itens.reduce((t, x) => t + x.it.kg, 0);
  const valorDesc = somaValor(descartados(mesAtual));

  // gráfico de barras em SVG: salvo (verde) e descartado (azul) por mês, com a linha da meta
  const W = 320, H = 170, base = 140, topo = 14, larg = W / 6;
  const y = (v: number) => base - ((base - topo) * v) / max;

  return (
    <section aria-labelledby="t-economia">
      <h1 className="selo-titulo" id="t-economia" tabIndex={-1}>Seu impacto</h1>
      <Meta atual={salvoMes} meta={estado.metaKg} />

      <p className={s.destaqueRotulo}>Este mês</p>
      <p className={s.destaqueValor}>{peso(salvoMes)} <span>· {brl(somaValor(salvos(mesAtual)))}</span></p>
      <p className={s.destaqueSub}>
        salvos do lixo, usados a até 3 dias do vencimento. Descartados: <strong>{peso(kgDesc)}</strong> ({brl(valorDesc)}).
      </p>

      <div className={s.aneis}>
        <Anel pct={aproveitamento} titulo="Aproveitamento" legenda="do que saiu da despensa foi consumido" />
        <Anel pct={kgUsado > 0 ? (salvoMes / kgUsado) * 100 : 0} titulo="Resgate" legenda="do consumido estava perto de vencer" />
        <Anel pct={kgTotal > 0 ? (kgRisco / kgTotal) * 100 : 0} titulo="Em risco" legenda={`${peso(kgRisco)} vencem em até 3 dias`} />
      </div>

      <h2 className="secao">Evolução</h2>
      <div className={s.legenda} aria-hidden="true">
        <span className={s.lSalvo}>Salvo</span><span className={s.lDesc}>Descartado</span><span className={s.lMeta}>Meta</span>
      </div>
      <figure className={s.grafico}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="graf-titulo">
          <title id="graf-titulo">Quilos salvos e descartados nos últimos 6 meses</title>
          <line x1="0" x2={W} y1={base} y2={base} className={s.eixo} />
          {meses.map((m, i) => {
            const x = i * larg + larg / 2;
            return (
              <g key={i}>
                <rect x={x - 15} y={y(m.salvo)} width={13} height={base - y(m.salvo)} rx={2} className={s.bSalvo} />
                <rect x={x + 2} y={y(m.desc)} width={13} height={base - y(m.desc)} rx={2} className={s.bDesc} />
                <text x={x} y={base + 18} textAnchor="middle" className={m.atual ? s.mesAtual : s.mes}>{m.rotulo}</text>
              </g>
            );
          })}
          <line x1="0" x2={W} y1={y(estado.metaKg)} y2={y(estado.metaKg)} className={s.linhaMeta} />
        </svg>
        <table className="sr">
          <caption>Evolução mensal</caption>
          <thead><tr><th>Mês</th><th>Salvo</th><th>Descartado</th></tr></thead>
          <tbody>{meses.map((m, i) => <tr key={i}><td>{m.rotulo}</td><td>{peso(m.salvo)}</td><td>{peso(m.desc)}</td></tr>)}</tbody>
        </table>
      </figure>
      {antes.length ? (
        <p className={s.comparacao}>
          Média dos meses anteriores: {peso(antes.reduce((t, m) => t + m.salvo, 0) / antes.length)} salvos e{' '}
          {peso(antes.reduce((t, m) => t + m.desc, 0) / antes.length)} descartados por mês.
        </p>
      ) : null}

      <div className={s.acao}>
        <p>{risco.length ? `${risco.length} ${risco.length === 1 ? 'item pede' : 'itens pedem'} uso nos próximos 3 dias.` : 'Nada perto de vencer agora.'}</p>
        <Link className="botao botao--primario" href="/receitas/"><Icone nome="panela" />Ver o que cozinhar</Link>
      </div>
    </section>
  );
}
