/* Ícones de traço, no estilo da barra inferior das telas do pitch. */
import type { ReactElement } from 'react';

const caminhos = {
  conta: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21c.8-4.2 3.8-6.5 7.5-6.5s6.7 2.3 7.5 6.5" /></>,
  lista: <><rect x="5" y="4.5" width="14" height="17" rx="2" /><path d="M9 3h6v3H9zM8.5 11h7M8.5 14.5h7M8.5 18h4.5" /></>,
  carrinho: <><path d="M2.5 4h3l2.4 10.5h10.6L21 7H7" /><circle cx="9.5" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></>,
  etiqueta: <><path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.4 1.4 0 0 1 0 2l-7 7a1.4 1.4 0 0 1-2 0Z" /><circle cx="8.5" cy="8.5" r="1.6" /></>,
  relogio: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  voltar: <path d="M19 12H5m6-6-6 6 6 6" />,
  mais: <path d="M12 5v14M5 12h14" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  seta: <path d="M12 4v16m-6-6 6 6 6-6" />,
  estrela: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z" />,
  joinha: <path d="M7 10v10H4V10Zm0 0 4-6.5c1.3 0 2.2 1 2 2.3L12.5 9H18a2 2 0 0 1 2 2.3l-1.2 6.8A2.2 2.2 0 0 1 16.6 20H7" />,
  lupa: <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>,
  mapa: <><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6Z" /><path d="M9 4v14m6-12v14" /></>,
  lote: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></>,
  email: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  camera: <><path d="M4 8h3l1.6-2.5h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.6" /></>,
  lapis: <path d="M4 20h4L19 9l-4-4L4 16Zm9-13 4 4" />,
  sino: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  calendario: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  alvo: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  faisca: <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />,
  local: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  mira: <><circle cx="12" cy="12" r="7" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chave: <><circle cx="8" cy="15" r="4" /><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" /></>,
  github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  panela:<><path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" /><path d="M2 10h20M9 6.5c0-1 1-1.5 1-2.5M13 6.5c0-1 1-1.5 1-2.5" /></>
} satisfies Record<string, ReactElement>;

export type NomeIcone = keyof typeof caminhos;

export function Icone({ nome, className }: { nome: NomeIcone; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}
      fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {caminhos[nome]}
    </svg>
  );
}
