/* Localização: CEP (BrasilAPI), geolocalização do navegador e cálculo de distância. */
import { dados } from './dados';
import type { Local, Produtor } from './tipos';

const R_TERRA = 6371;
const rad = (g: number) => (g * Math.PI) / 180;
const grau = (r: number) => (r * 180) / Math.PI;

/** Distância em km entre dois pontos (fórmula de haversine). */
export function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_TERRA * Math.asin(Math.sqrt(h));
}

/** Ponto a uma distância e rumo (graus a partir do norte) de outro. */
export function destino(o: { lat: number; lng: number }, rumo: number, km: number) {
  const d = km / R_TERRA;
  const th = rad(rumo);
  const la1 = rad(o.lat);
  const lo1 = rad(o.lng);
  const la2 = Math.asin(Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(th));
  const lo2 = lo1 + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(la1), Math.cos(d) - Math.sin(la1) * Math.sin(la2));
  return { lat: grau(la2), lng: grau(lo2) };
}

const CENTRO_CURITIBA = { lat: -25.4284, lng: -49.2733 };

/** Na região de Curitiba os produtores fictícios ficam fixos ao redor do centro;
 *  em outras cidades são reposicionados ao redor do usuário para a demo continuar útil. */
export function naRegiaoOriginal(local: Local): boolean {
  return distanciaKm(local, CENTRO_CURITIBA) < 60;
}
function ancora(local: Local) {
  return naRegiaoOriginal(local) ? CENTRO_CURITIBA : { lat: local.lat, lng: local.lng };
}

export interface ProdutorNoMapa {
  p: Produtor;
  lat: number;
  lng: number;
  distancia: number;
}

export function produtoresPerto(local: Local): ProdutorNoMapa[] {
  const base = ancora(local);
  return dados.produtores
    .map((p) => {
      const pos = destino(base, p.rumo, p.km);
      return { p, ...pos, distancia: distanciaKm(local, pos) };
    })
    .sort((a, b) => a.distancia - b.distancia);
}

/** Ponto de retirada fictício, sempre perto do usuário. */
export function pontoRetirada(local: Local) {
  return destino(local, 200, 1.6);
}

async function comTempo<T>(url: string, ms: number): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) throw Object.assign(new Error(`HTTP ${r.status}`), { status: r.status });
    return (await r.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

interface RespostaCep {
  cep: string;
  state: string;
  city: string;
  neighborhood?: string;
  location?: { coordinates?: { latitude?: string; longitude?: string } };
}

export class ErroLocal extends Error {}

/** Busca o CEP na BrasilAPI v2. Sem coordenadas no CEP, usa o centro da cidade pelo Nominatim (OpenStreetMap). */
export async function localPorCep(cep: string): Promise<Local> {
  const limpo = cep.replace(/\D/g, '');
  if (limpo.length !== 8) throw new ErroLocal('O CEP precisa ter 8 dígitos.');
  let r: RespostaCep;
  try {
    r = await comTempo<RespostaCep>(`https://brasilapi.com.br/api/cep/v2/${limpo}`, 9000);
  } catch (e) {
    const status = (e as { status?: number }).status;
    if (status === 404) throw new ErroLocal('CEP não encontrado. Confira os números.');
    if ((e as Error).name === 'AbortError') throw new ErroLocal('A consulta de CEP demorou demais. Tente de novo.');
    throw new ErroLocal('Não foi possível consultar o CEP agora. Verifique a conexão.');
  }
  const rotulo = [r.neighborhood, r.city].filter(Boolean).join(', ');
  const lat = Number(r.location?.coordinates?.latitude);
  const lng = Number(r.location?.coordinates?.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0) {
    return { lat, lng, rotulo, cidade: r.city, fonte: 'cep' };
  }
  try {
    const q = new URLSearchParams({ format: 'json', limit: '1', city: r.city, state: r.state, country: 'Brasil' });
    const lista = await comTempo<{ lat: string; lon: string }[]>(`https://nominatim.openstreetmap.org/search?${q}`, 9000);
    if (lista[0]) return { lat: Number(lista[0].lat), lng: Number(lista[0].lon), rotulo: `${r.city} (centro)`, cidade: r.city, fonte: 'cep' };
  } catch {
    /* segue para o erro abaixo */
  }
  throw new ErroLocal('Encontramos o CEP, mas não a posição no mapa. Tente a localização do aparelho.');
}

export function localPorGps(): Promise<Local> {
  return new Promise((ok, erro) => {
    if (!('geolocation' in navigator)) {
      erro(new ErroLocal('Este navegador não oferece localização.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => ok({ lat: pos.coords.latitude, lng: pos.coords.longitude, rotulo: 'Sua localização atual', cidade: '', fonte: 'gps' }),
      (e) => erro(new ErroLocal(e.code === e.PERMISSION_DENIED ? 'Permissão de localização negada. Use o CEP.' : 'Não foi possível obter a localização. Use o CEP.')),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  });
}
