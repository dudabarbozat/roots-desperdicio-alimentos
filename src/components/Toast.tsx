'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import s from './Toast.module.css';

type Avisar = (msg: string, desfazer?: () => void) => void;
const Ctx = createContext<Avisar>(() => {});
export const useAviso = () => useContext(Ctx);

export function ProvedorAviso({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<{ msg: string; desfazer?: () => void; n: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const avisar = useCallback<Avisar>((msg, desfazer) => {
    setAviso((a) => ({ msg, desfazer, n: (a?.n ?? 0) + 1 }));
  }, []);
  useEffect(() => {
    if (!aviso) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(null), aviso.desfazer ? 6500 : 4000);
    return () => clearTimeout(timer.current);
  }, [aviso]);
  return (
    <Ctx.Provider value={avisar}>
      {children}
      <div className={s.regiao} role="status" aria-live="polite">
        {aviso ? (
          <div className={s.toast} key={aviso.n}>
            <span>{aviso.msg}</span>
            {aviso.desfazer ? (
              <button type="button" className={s.botao} onClick={() => { aviso.desfazer?.(); setAviso(null); }}>
                Desfazer
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Ctx.Provider>
  );
}
