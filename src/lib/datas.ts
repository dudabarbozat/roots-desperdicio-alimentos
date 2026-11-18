/* Datas locais sem hora, no formato AAAA-MM-DD. */
export function iso(dt: Date): string {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}
export function hoje(): string {
  return iso(new Date());
}
function partes(s: string): [number, number, number] {
  const [a, m, d] = s.split('-').map(Number);
  return [a, m, d];
}
export function somaDias(s: string, n: number): string {
  const [a, m, d] = partes(s);
  return iso(new Date(a, m - 1, d + n));
}
export function diasAte(s: string): number {
  const [a, m, d] = partes(s);
  const [b, n, e] = partes(hoje());
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(b, n - 1, e)) / 864e5);
}
export function dataCurta(s: string): string {
  const p = s.split('-');
  return `${p[2]}/${p[1]}`;
}
export function nomeDia(offset: number): string {
  if (offset === 0) return 'Hoje';
  if (offset === 1) return 'Amanhã';
  const [a, m, d] = partes(somaDias(hoje(), offset));
  const t = new Date(a, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long' });
  return t.charAt(0).toUpperCase() + t.slice(1);
}
export function mesCurto(ano: number, mes: number): string {
  return new Date(ano, mes, 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
}
export const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
