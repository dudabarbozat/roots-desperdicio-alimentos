/* Lembretes: Notification API enquanto o app está aberto e exportação .ics para a agenda. */
import { dados } from './dados';
import { diasAte, somaDias } from './datas';
import type { ItemDespensa } from './tipos';

export type Permissao = NotificationPermission | 'indisponivel';

export function permissao(): Permissao {
  return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'indisponivel';
}

export async function pedirPermissao(): Promise<Permissao> {
  if (permissao() === 'indisponivel') return 'indisponivel';
  return Notification.requestPermission();
}

/** Itens que vencem amanhã e ainda não foram avisados hoje. */
export function pendentes(despensa: ItemDespensa[], avisados: Record<string, string>, hojeIso: string): ItemDespensa[] {
  return despensa.filter((i) => diasAte(i.validade) === 1 && avisados[i.id] !== hojeIso);
}

export function textoAviso(itens: ItemDespensa[]): string {
  const nomes = itens.map((i) => dados.alimentos[i.alimento].nome);
  if (nomes.length === 1) return `${nomes[0]} vence amanhã. Que tal usar hoje?`;
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]} vencem amanhã.`;
}

export function notificar(itens: ItemDespensa[], icone: string): boolean {
  if (!itens.length || permissao() !== 'granted') return false;
  try {
    new Notification('Roots: use antes de vencer', { body: textoAviso(itens), icon: icone, tag: 'roots-vence-amanha' });
    return true;
  } catch {
    return false;
  }
}

function dataHora(isoData: string, hora: string) {
  return `${isoData.replace(/-/g, '')}T${hora}`;
}
function escIcs(s: string) {
  return s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
}

/** Um evento às 9h do dia anterior ao vencimento de cada item ainda no prazo. */
export function gerarIcs(itens: ItemDespensa[]): string {
  const agora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const eventos = itens
    .filter((i) => diasAte(i.validade) >= 1)
    .map((i) => {
      const a = dados.alimentos[i.alimento];
      const dia = somaDias(i.validade, -1);
      return [
        'BEGIN:VEVENT',
        `UID:roots-${i.id}-${i.validade}@dudabarbozat.github.io`,
        `DTSTAMP:${agora}`,
        `DTSTART:${dataHora(dia, '090000')}`,
        `DTEND:${dataHora(dia, '091500')}`,
        `SUMMARY:${escIcs(`${a.nome} vence amanhã`)}`,
        `DESCRIPTION:${escIcs(`Lembrete do Roots. ${a.dica}`)}`,
        'BEGIN:VALARM',
        'TRIGGER:PT0M',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escIcs(`${a.nome} vence amanhã`)}`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n');
    });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Roots//Prototipo//PT-BR', 'CALSCALE:GREGORIAN', ...eventos, 'END:VCALENDAR', ''].join('\r\n');
}

export function baixar(nome: string, conteudo: string, tipo: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
