const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export function brl(v: number): string {
  return fmtBRL.format(v);
}
export function peso(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`;
}
export function km(v: number): string {
  if (v < 1) return `${Math.round(v * 1000)} m`;
  return `${v.toLocaleString('pt-BR', { maximumFractionDigits: v < 10 ? 1 : 0 })} km`;
}
export function plural(n: number, um: string, varios: string): string {
  return n === 1 ? um : varios;
}
export function quando(dias: number): string {
  if (dias < 0) return `há ${-dias} ${plural(-dias, 'dia', 'dias')}`;
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'amanhã';
  return `em ${dias} dias`;
}
export function prazoCurto(dias: number): string {
  if (dias < 0) return 'vencido';
  if (dias === 0) return 'vence hoje';
  if (dias === 1) return 'vence amanhã';
  return `vence em ${dias} dias`;
}
export function mascaraCep(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}
