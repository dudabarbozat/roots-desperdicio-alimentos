'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { ProdutorNoMapa } from '@/lib/local';
import type { Local } from '@/lib/tipos';

function pino(ativo: boolean) {
  const fundo = ativo ? '#193B56' : '#FFFFFF';
  const borda = ativo ? '#9CDE76' : '#193B56';
  const miolo = ativo ? '#9CDE76' : '#FFFFFF';
  return L.divIcon({
    className: 'pino-mapa',
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    tooltipAnchor: [0, -40],
    html: `<svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 30S2 18.5 2 11.5a10 10 0 0 1 20 0C22 18.5 12 30 12 30Z" fill="${fundo}" stroke="${borda}" stroke-width="2"/><circle cx="12" cy="11.5" r="3.6" fill="${miolo}" stroke="${borda}" stroke-width="1.6"/></svg>`
  });
}

function Enquadrar({ pontos }: { pontos: [number, number][] }) {
  const mapa = useMap();
  const chave = pontos.map((p) => p.join(',')).join(';');
  useEffect(() => {
    if (pontos.length) mapa.fitBounds(L.latLngBounds(pontos), { padding: [36, 36] });
  }, [chave]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function MapaLeaflet({ local, produtores, retirada, selecionado, aoSelecionar, aoFalharTiles }: {
  local: Local;
  produtores: ProdutorNoMapa[];
  retirada: { lat: number; lng: number };
  selecionado: string;
  aoSelecionar: (id: string) => void;
  aoFalharTiles: () => void;
}) {
  const pontos = useMemo<[number, number][]>(
    () => [[local.lat, local.lng], ...produtores.map((p) => [p.lat, p.lng] as [number, number])],
    [local, produtores]
  );
  return (
    <MapContainer center={[local.lat, local.lng]} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">colaboradores do OpenStreetMap</a>'
        maxZoom={19}
        eventHandlers={{ tileerror: aoFalharTiles }}
      />
      <Enquadrar pontos={pontos} />
      <CircleMarker center={[local.lat, local.lng]} radius={9} pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#1f6fb2', fillOpacity: 1 }}>
        <Tooltip>Você</Tooltip>
      </CircleMarker>
      <CircleMarker center={[retirada.lat, retirada.lng]} radius={7} pathOptions={{ color: '#193B56', weight: 2, fillColor: '#9CDE76', fillOpacity: 1 }}>
        <Tooltip>Ponto de retirada (fictício)</Tooltip>
      </CircleMarker>
      {produtores.map((p) => (
        <Marker
          key={p.p.id}
          position={[p.lat, p.lng]}
          icon={pino(p.p.id === selecionado)}
          title={p.p.nome}
          alt={p.p.nome}
          keyboard
          zIndexOffset={p.p.id === selecionado ? 1000 : 0}
          eventHandlers={{
            click: () => aoSelecionar(p.p.id),
            keypress: (e) => {
              if ((e.originalEvent as KeyboardEvent).key === 'Enter') aoSelecionar(p.p.id);
            }
          }}
        />
      ))}
    </MapContainer>
  );
}
