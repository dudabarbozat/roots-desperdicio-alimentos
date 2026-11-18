import { asset } from '@/lib/caminho';
import { dados } from '@/lib/dados';
import { fotos } from '@/lib/fotos';
import s from './Creditos.module.css';

function uso(id: string): string {
  if (id === 'cena-feira') return 'Faixa da feira';
  if (id.startsWith('cena-')) {
    const p = dados.produtores.find((x) => `cena-${x.id}` === id);
    return p ? `Lavoura do produtor fictício ${p.nome}` : 'Cena de produtor';
  }
  return dados.alimentos[id]?.nome ?? id;
}

export default function Creditos() {
  return (
    <section aria-labelledby="t-creditos">
      <h1 className="selo-titulo" id="t-creditos" tabIndex={-1}>Créditos das imagens</h1>
      <p className="texto-apoio">
        Fotos do <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer">Wikimedia Commons</a>, redimensionadas e convertidas
        para WebP (três cenas verticais foram recortadas na horizontal). Os produtores do app são fictícios; as fotos mostram lavouras reais
        sem relação com eles.
      </p>
      <ul className={s.lista}>
        {fotos.map((f) => (
          <li key={f.id} className={s.item}>
            <img src={asset(`/img/fotos/${f.arquivo}`)} alt="" width={64} height={64} loading="lazy" className={s.mini} />
            <div className={s.texto}>
              <p className={s.uso}>{uso(f.id)}</p>
              <p><a href={f.pagina} target="_blank" rel="noreferrer">{f.titulo}</a></p>
              <p className={s.meta}>
                {f.autor} ·{' '}
                {f.licencaUrl ? <a href={f.licencaUrl} target="_blank" rel="noreferrer">{f.licenca}</a> : f.licenca}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
