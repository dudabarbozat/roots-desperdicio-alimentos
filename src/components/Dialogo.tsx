'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { Icone } from './Icones';
import s from './Dialogo.module.css';

/** Diálogo modal nativo: o resto da página fica inerte, Esc fecha e o foco volta ao botão de origem. */
export function Dialogo({ aberto, aoFechar, titulo, children, topo = false }: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  topo?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);
  return (
    <dialog
      ref={ref}
      className={`dialogo ${topo ? s.topo : ''}`}
      aria-label={titulo}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
    >
      <button type="button" className={s.fechar} onClick={aoFechar}>
        <Icone nome="fechar" />
        <span className="sr">Fechar</span>
      </button>
      {aberto ? children : null}
    </dialog>
  );
}
