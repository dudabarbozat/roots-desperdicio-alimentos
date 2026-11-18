'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icone } from '@/components/Icones';
import { Alimento } from '@/components/Svg';
import { useAviso } from '@/components/Toast';
import { dados } from '@/lib/dados';
import { acoes, useEstado } from '@/lib/estado';
import { peso, plural, quando } from '@/lib/formato';
import { baixar, gerarIcs, pedirPermissao, permissao } from '@/lib/lembretes';
import { ordenar, seu, type ItemVisivel } from '@/lib/regras';
import type { Status } from '@/lib/tipos';
import AdicionarCompras from './AdicionarCompras';
import FolhaAlerta from './FolhaAlerta';
import s from './Despensa.module.css';

type Filtro = 'todos' | Status;

function Cartao({ x, abrir }: { x: ItemVisivel; abrir: (id: string) => void }) {
  const a = dados.alimentos[x.it.alimento];
  const prod = x.it.origem ? dados.produtores.find((p) => p.id === x.it.origem) : null;
  return (
    <li className={`${s.alerta} ${s[x.st]}`}>
      <Alimento id={x.it.alimento} tamanho={60} />
      <div className={s.texto}>
        <p className={s.nome}>
          {a.nome} <span>· {peso(x.it.kg)}</span>
        </p>
        <p>
          {seu(x.it.alimento)} {a.nome.toLowerCase()} {x.dias < 0 ? 'venceu' : 'vence'}
        </p>
        <p className={s.quando}>{quando(x.dias)}</p>
        <button type="button" className={`link ${s.acao}`} onClick={() => abrir(x.it.id)}>
          Veja o que dá para fazer
        </button>
        {prod ? (
          <Link className={s.origem} href={`/feira/${prod.id}/`}>
            {prod.nome}
          </Link>
        ) : null}
      </div>
    </li>
  );
}

export default function Despensa() {
  const estado = useEstado();
  const avisar = useAviso();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [aberto, setAberto] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState(false);
  const itens = useMemo(() => (estado ? ordenar(estado.despensa) : []), [estado]);

  if (!estado) {
    return (
      <section aria-busy="true" aria-label="Carregando a despensa">
        <h1 className="selo-titulo">Sua despensa</h1>
        <div className={s.lista}>
          {[0, 1, 2].map((i) => <div key={i} className="esqueleto" />)}
        </div>
      </section>
    );
  }

  const cont = { hoje: 0, breve: 0, ok: 0 };
  itens.forEach((x) => cont[x.st]++);
  const amanha = itens.filter((x) => x.dias === 1);
  const visiveis = itens.filter((x) => filtro === 'todos' || x.st === filtro);
  const filtros: [Filtro, string, number][] = [
    ['todos', 'Tudo', itens.length],
    ['hoje', 'Hoje', cont.hoje],
    ['breve', 'Em breve', cont.breve],
    ['ok', 'No prazo', cont.ok]
  ];

  const ativarLembretes = async () => {
    const p = await pedirPermissao();
    if (p === 'granted') {
      acoes.lembretes(true);
      avisar('Lembretes ativados. Avisamos o que vence amanhã enquanto o app estiver aberto.');
    } else {
      baixar('roots-lembretes.ics', gerarIcs(estado.despensa), 'text/calendar');
      avisar(p === 'indisponivel' ? 'Este navegador não mostra notificações. Baixamos os lembretes para a agenda (.ics).' : 'Notificações bloqueadas. Baixamos os lembretes para a agenda (.ics).');
    }
  };

  return (
    <section aria-labelledby="t-despensa">
      <h1 className="selo-titulo" id="t-despensa" tabIndex={-1}>Sua despensa</h1>

      {!estado.orientado ? (
        <div className={s.orientacao}>
          <p className={s.orientacaoTitulo}>Como o Roots funciona</p>
          <ol>
            <li><strong>Adicione as compras</strong> por foto ou à mão.</li>
            <li><strong>Acompanhe a validade</strong>: vermelho vence hoje, laranja em até 3 dias.</li>
            <li><strong>Use primeiro</strong> o que vence antes, com receitas sugeridas.</li>
          </ol>
          <button type="button" className="botao botao--verde botao--pequeno" onClick={() => acoes.orientar()}>Entendi</button>
        </div>
      ) : null}

      <div className={s.resumo}>
        <p>
          {cont.hoje ? <strong>{cont.hoje} {plural(cont.hoje, 'item vence', 'itens vencem')} hoje</strong> : 'Nada vence hoje'}
          {cont.breve ? ` · ${cont.breve} em até 3 dias` : ''}
        </p>
        <Link href="/receitas/" className={s.cozinhar}>
          <Icone nome="panela" />O que cozinhar
        </Link>
      </div>

      <button type="button" className={`botao botao--primario botao--largo ${s.principal}`} onClick={() => setAdicionando(true)}>
        <Icone nome="camera" />
        Adicionar compras
      </button>

      {amanha.length && !estado.lembretes.ativo && permissao() !== 'denied' ? (
        <div className={s.lembrete}>
          <Icone nome="sino" />
          <p>
            {amanha.length === 1 ? `${dados.alimentos[amanha[0].it.alimento].nome} vence amanhã.` : `${amanha.length} itens vencem amanhã.`} Quer ser avisado?
          </p>
          <button type="button" className="botao botao--contorno botao--pequeno" onClick={ativarLembretes}>Ativar lembretes</button>
        </div>
      ) : null}

      <div className={s.filtros} role="group" aria-label="Filtrar por validade">
        {filtros.map(([f, rot, n]) => (
          <button key={f} type="button" className={s.filtro} aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
            {rot} <span>{n}</span>
          </button>
        ))}
      </div>

      <ul className={s.lista} aria-live="polite">
        {visiveis.length ? (
          visiveis.map((x) => <Cartao key={x.it.id} x={x} abrir={setAberto} />)
        ) : (
          <li className="vazio">
            {itens.length ? 'Nada nesta faixa de validade.' : 'Sua despensa está vazia.'}
            {!itens.length ? (
              <button type="button" className="botao botao--primario botao--pequeno" onClick={() => setAdicionando(true)}>Adicionar compras</button>
            ) : null}
          </li>
        )}
      </ul>

      <FolhaAlerta id={aberto} aoFechar={() => setAberto(null)} />
      <AdicionarCompras aberto={adicionando} aoFechar={() => setAdicionando(false)} />
    </section>
  );
}
