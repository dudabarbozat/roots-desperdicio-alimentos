'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Dialogo } from '@/components/Dialogo';
import { useAviso } from '@/components/Toast';
import { dados } from '@/lib/dados';
import { diasAte } from '@/lib/datas';
import { acoes, useEstado } from '@/lib/estado';
import { quando } from '@/lib/formato';
import { baixar, gerarIcs } from '@/lib/lembretes';
import { seu } from '@/lib/regras';
import s from './Despensa.module.css';

/** Painel "vence em X dias" das telas do pitch: como usar e o que aconteceu com o item. */
export default function FolhaAlerta({ id, aoFechar }: { id: string | null; aoFechar: () => void }) {
  const estado = useEstado();
  const avisar = useAviso();
  const [detalhe, setDetalhe] = useState(false);
  const item = id && estado ? estado.despensa.find((i) => i.id === id) : undefined;
  const fechar = () => {
    setDetalhe(false);
    aoFechar();
  };

  if (!item) return <Dialogo aberto={false} aoFechar={fechar} titulo="Alimento">{null}</Dialogo>;
  const a = dados.alimentos[item.alimento];
  const dias = diasAte(item.validade);
  const receitas = dados.receitas.filter((r) => r.ingredientes.includes(item.alimento));

  const registrar = (tipo: 'usado' | 'descartado') => {
    const desfazer = acoes.registrarSaida(item.id, tipo);
    fechar();
    if (desfazer) avisar(tipo === 'usado' ? `${a.nome} marcado como usado.` : `${a.nome} registrado como descartado.`, desfazer);
  };

  return (
    <Dialogo aberto={!!item} aoFechar={fechar} titulo={`${a.nome}: o que fazer`} topo>
      <div className={s.folha}>
        <h2>{seu(item.alimento)} {a.nome.toLowerCase()} {dias < 0 ? 'venceu' : 'vence'} {quando(dias)}!</h2>
        <button type="button" className={`link ${s.folhaLink}`} aria-expanded={detalhe} onClick={() => setDetalhe((d) => !d)}>
          Clique aqui para ver como usar.
        </button>
        {detalhe ? (
          <div className={s.folhaDetalhe}>
            <p><strong>Como guardar.</strong> {a.dica}</p>
            {receitas.length ? (
              <p>
                <strong>Dá para fazer:</strong> {receitas.map((r) => r.nome).join(', ')}.{' '}
                <Link href="/receitas/" onClick={fechar}>Ver cardápio</Link>
              </p>
            ) : null}
            {dias >= 1 ? (
              <button type="button" className="link" onClick={() => baixar(`roots-${item.alimento}.ics`, gerarIcs([item]), 'text/calendar')}>
                Lembrete na agenda (.ics)
              </button>
            ) : null}
          </div>
        ) : null}
        <p className={s.folhaPergunta}>Marque o que aconteceu com {a.g === 'f' ? 'ela' : 'ele'}:</p>
      </div>
      <div className={s.opcoes}>
        <button type="button" className={s.nao} onClick={() => registrar('descartado')}>Descartei</button>
        <button type="button" className={s.sim} onClick={() => registrar('usado')}>Já usei</button>
      </div>
    </Dialogo>
  );
}
