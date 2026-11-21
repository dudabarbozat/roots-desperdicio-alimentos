'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { asset } from '@/lib/caminho';
import { hoje } from '@/lib/datas';
import { acoes, useEstado } from '@/lib/estado';
import { notificar, pendentes } from '@/lib/lembretes';
import { Icone, type NomeIcone } from './Icones';
import { ProvedorAviso } from './Toast';
import s from './Casca.module.css';

const abas: { href: string; rotulo: string; icone: NomeIcone; centro?: boolean }[] = [
  { href: '/conta/', rotulo: 'Conta', icone: 'conta' },
  { href: '/despensa/', rotulo: 'Despensa', icone: 'lista' },
  { href: '/feira/', rotulo: 'Feira', icone: 'carrinho', centro: true },
  { href: '/economia/', rotulo: 'Economia', icone: 'etiqueta' },
  { href: '/historico/', rotulo: 'Histórico', icone: 'relogio' }
];

function voltarPara(rota: string): string | null {
  if (rota.startsWith('/feira/') && rota !== '/feira/') return '/feira/';
  if (rota === '/receitas/') return '/despensa/';
  if (rota === '/creditos/') return '/conta/';
  return null;
}

/** Avisa pelo navegador o que vence amanhã, enquanto o app estiver aberto. */
function VigiaLembretes() {
  const estado = useEstado();
  useEffect(() => {
    if (!estado?.lembretes.ativo) return;
    const verificar = () => {
      const lista = pendentes(estado.despensa, estado.lembretes.avisados, hoje());
      if (lista.length && notificar(lista, asset('/img/favicon.svg'))) acoes.marcarAvisado(lista.map((i) => i.id));
    };
    verificar();
    const t = setInterval(verificar, 30 * 60 * 1000);
    return () => clearInterval(t);
  }, [estado]);
  return null;
}

export function Casca({ children }: { children: ReactNode }) {
  const bruto = usePathname() || '/';
  const rota = bruto.endsWith('/') ? bruto : `${bruto}/`;
  const entrar = rota === '/entrar/' || rota === '/';
  const marinho = rota === '/conta/';
  const voltar = voltarPara(rota);
  const aba = '/' + (rota.split('/')[1] ?? '') + '/';

  return (
    <div className={s.palco}>
      <a className={s.pular} href="#conteudo">Pular para o conteúdo</a>
      <aside className={s.lateral} aria-label="Sobre o protótipo">
        <img className={s.logo} src={asset('/img/logo-roots.svg')} alt="Roots" width={1040} height={335} />
        <p>App para controlar os alimentos de casa: validade, compras por foto, receitas com o que vence primeiro e produtores da agricultura familiar.</p>
        <p><b>Para quem é:</b> quem busca consumo consciente e quer parar de jogar comida fora.</p>
        <ul className={s.lista}>
          <li><Icone nome="lista" /><span><b>Despensa</b> ordenada por vencimento, com alerta por cor e lembrete.</span></li>
          <li><Icone nome="camera" /><span><b>Compras por foto</b>, reconhecidas no próprio navegador. A foto não sai do aparelho.</span></li>
          <li><Icone nome="panela" /><span><b>Receitas</b> que usam primeiro o que vence antes.</span></li>
          <li><Icone nome="mapa" /><span><b>Feira</b> com produtores locais em lista e no mapa.</span></li>
        </ul>
        <div className={s.links}>
          <a className="botao botao--primario botao--pequeno" href="https://github.com/dudabarbozat/roots-desperdicio-alimentos" target="_blank" rel="noreferrer">
            <Icone nome="github" />Ver o código no GitHub
          </a>
        </div>
        <p className={s.contexto}>Protótipo de portfólio. Pitch do desafio “Produção Sustentável e Consumo Verde”, reconstruído em 2026.</p>
      </aside>
      <div className={s.aparelho}>
      <ProvedorAviso>
      <div className={`${s.app} ${entrar || marinho ? s.appMarinho : ''}`}>
        {!entrar ? (
          <header className={s.topo}>
            {voltar ? (
              <Link className={s.voltar} href={voltar}>
                <Icone nome="voltar" />
                <span className="sr">Voltar</span>
              </Link>
            ) : null}
            <Link className={s.marca} href="/despensa/">
              <img src={asset('/img/logo-roots-claro.svg')} alt="Roots" width={1040} height={335} />
            </Link>
          </header>
        ) : null}
        <main id="conteudo" className={s.conteudo} tabIndex={-1}>
          {children}
        </main>
        {!entrar ? (
          <nav className={`${s.nav} ${marinho ? s.navMarinho : ''}`} aria-label="Seções">
            {abas.map((a) => (
              <Link key={a.href} href={a.href} className={a.centro ? s.centro : s.item} aria-current={aba === a.href ? 'page' : undefined}>
                {a.centro ? (
                  <span className={s.bolha}>
                    <Icone nome={a.icone} />
                    <span>{a.rotulo}</span>
                  </span>
                ) : (
                  <>
                    <Icone nome={a.icone} />
                    <span>{a.rotulo}</span>
                  </>
                )}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <VigiaLembretes />
      </ProvedorAviso>
      </div>
    </div>
  );
}
