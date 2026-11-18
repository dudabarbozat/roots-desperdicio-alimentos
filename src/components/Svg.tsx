import { asset } from '@/lib/caminho';
import { dados } from '@/lib/dados';
import { foto } from '@/lib/fotos';
import { svgAvatar } from '@/lib/ilustra';
import s from './Svg.module.css';

/** Foto do alimento (Wikimedia Commons). O nome aparece ao lado, então a imagem é decorativa. */
export function Alimento({ id, tamanho = 56 }: { id: string; tamanho?: number }) {
  const f = foto(id);
  const a = dados.alimentos[id];
  if (!f) return <span className={s.vazio} style={{ width: tamanho, height: tamanho, background: a?.cor }} aria-hidden="true" />;
  return (
    <img className={s.alimento} src={asset(`/img/fotos/${f.arquivo}`)} alt="" width={tamanho} height={tamanho}
      loading="lazy" decoding="async" style={{ width: tamanho, height: tamanho }} />
  );
}

/** Foto de lavoura usada como imagem do produtor fictício (sem pessoas identificáveis). */
export function Cena({ id, className, prioridade = false }: { id: string; className?: string; prioridade?: boolean }) {
  const f = foto(`cena-${id}`);
  if (!f) return null;
  return (
    <img className={`${s.cena} ${className ?? ''}`} src={asset(`/img/fotos/${f.arquivo}`)} alt="" width={f.largura} height={f.altura}
      loading={prioridade ? 'eager' : 'lazy'} decoding="async" />
  );
}

export function Avatar({ className }: { className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: svgAvatar() }} />;
}
