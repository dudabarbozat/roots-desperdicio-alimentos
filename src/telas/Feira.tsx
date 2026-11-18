'use client';
import Link from 'next/link';
import { Icone } from '@/components/Icones';
import { Cena } from '@/components/Svg';
import { asset } from '@/lib/caminho';
import { foto } from '@/lib/fotos';
import { useEstado } from '@/lib/estado';
import { km } from '@/lib/formato';
import { naRegiaoOriginal, produtoresPerto } from '@/lib/local';
import SeletorLocal from './SeletorLocal';
import s from './Feira.module.css';

export default function Feira() {
  const estado = useEstado();
  if (!estado) {
    return (
      <section aria-busy="true"><h1 className="selo-titulo">Perto de você</h1>
        <div className={s.grade}>{[0, 1, 2, 3].map((i) => <div key={i} className="esqueleto" style={{ minHeight: 210 }} />)}</div>
      </section>
    );
  }
  const lista = produtoresPerto(estado.local);
  const regiao = naRegiaoOriginal(estado.local);
  return (
    <section aria-labelledby="t-feira">
      <h1 className="selo-titulo" id="t-feira" tabIndex={-1}>Perto de você</h1>
      <figure className={s.faixa}>
        <img src={asset(`/img/fotos/${foto('cena-feira')?.arquivo ?? ''}`)} alt="Bancas com caixas de verduras, frutas e legumes" width={1200} height={900} />
        <figcaption>Do produtor para a sua despensa, com origem e lote rastreáveis.</figcaption>
      </figure>
      <SeletorLocal />
      <div className={s.barra}>
        <p>Agricultura familiar com retirada aos sábados.{!regiao ? ' Produtores fictícios posicionados ao redor de você na demo.' : ''}</p>
        <Link className="botao botao--primario botao--pequeno" href="/feira/mapa/"><Icone nome="mapa" />Ver no mapa</Link>
      </div>
      <ul className={s.grade}>
        {lista.map(({ p, distancia }) => (
          <li key={p.id}>
            <Link className={s.banca} href={`/feira/${p.id}/`}>
              <Cena id={p.id} className={s.foto} />
              <span className={s.nome}>{p.nome}</span>
              <span className={s.linha}>{p.chamada}</span>
              <span className={s.distancia}>a {km(distancia)} de você</span>
              <span className={s.rodape}>
                <span className={s.nota}><Icone nome="estrela" />{p.nota}</span>
                <span className={s.linha}>{regiao ? p.municipio : p.cultivo}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
