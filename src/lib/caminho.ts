/* Prefixo do GitHub Pages para arquivos de public/. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export function asset(p: string): string {
  return `${BASE}${p.startsWith('/') ? p : `/${p}`}`;
}
