'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Dialogo } from '@/components/Dialogo';
import { Icone } from '@/components/Icones';
import { Alimento } from '@/components/Svg';
import { useAviso } from '@/components/Toast';
import { asset } from '@/lib/caminho';
import { dados } from '@/lib/dados';
import { hoje, ISO_RE, somaDias } from '@/lib/datas';
import { carregarModelo, detectar, ErroDeteccao, RECONHECIDOS, type Deteccao } from '@/lib/deteccao';
import { acoes } from '@/lib/estado';
import { foto } from '@/lib/fotos';
import s from './Despensa.module.css';

const IDS = Object.keys(dados.alimentos).sort((a, b) => dados.alimentos[a].nome.localeCompare(dados.alimentos[b].nome, 'pt-BR'));
const SUGESTOES = ['tomate', 'alface', 'banana', 'cebola', 'batata', 'cenoura', 'limao', 'maca'];
const NOMES_RECONHECIDOS = Object.values(RECONHECIDOS).map((r) => dados.alimentos[r.alimento].nome.toLowerCase());
const LISTA_RECONHECIDOS = `${NOMES_RECONHECIDOS.slice(0, -1).join(', ')} e ${NOMES_RECONHECIDOS[NOMES_RECONHECIDOS.length - 1]}`;
const EXEMPLOS = [
  { id: 'banana', rotulo: 'Bananas na feira' },
  { id: 'cenoura', rotulo: 'Maços de cenoura' },
  { id: 'laranja', rotulo: 'Laranjas' }
];

interface Linha {
  alimento: string;
  unidades: number;
  kg: number;
  validadeDias: number;
  incluir: boolean;
}

function PorFoto({ aoSalvar, irParaManual }: { aoSalvar: (n: number) => void; irParaManual: () => void }) {
  const idArquivo = useId();
  const imgRef = useRef<HTMLImageElement>(null);
  const [fonte, setFonte] = useState<{ url: string; local: boolean } | null>(null);
  const [fase, setFase] = useState<'inicio' | 'modelo' | 'detectando' | 'revisar' | 'erro'>('inicio');
  const [erro, setErro] = useState('');
  const [deteccoes, setDeteccoes] = useState<Deteccao[]>([]);
  const [linhas, setLinhas] = useState<Linha[]>([]);

  useEffect(() => () => { if (fonte?.local) URL.revokeObjectURL(fonte.url); }, [fonte]);

  const analisar = async () => {
    const img = imgRef.current;
    if (!img) return;
    try {
      setFase('modelo');
      await carregarModelo();
      setFase('detectando');
      const d = await detectar(img);
      setDeteccoes(d);
      const porAlimento = new Map<string, number>();
      d.forEach((x) => porAlimento.set(x.alimento, (porAlimento.get(x.alimento) ?? 0) + 1));
      setLinhas([...porAlimento].map(([alimento, n]) => {
        const kgU = Object.values(RECONHECIDOS).find((r) => r.alimento === alimento)?.kgUnidade ?? 0.2;
        return { alimento, unidades: n, kg: Math.round(n * kgU * 100) / 100, validadeDias: dados.alimentos[alimento].dur, incluir: true };
      }));
      setFase('revisar');
    } catch (e) {
      setErro(e instanceof ErroDeteccao ? e.message : 'Não foi possível analisar esta imagem. Tente outra foto.');
      setFase('erro');
    }
  };

  const escolherArquivo = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setErro('Escolha um arquivo de imagem.');
      setFase('erro');
      return;
    }
    setErro('');
    setDeteccoes([]);
    setLinhas([]);
    setFonte({ url: URL.createObjectURL(f), local: true });
    setFase('detectando');
  };
  const usarExemplo = (id: string) => {
    setErro('');
    setDeteccoes([]);
    setLinhas([]);
    setFonte({ url: asset(`/img/fotos/${foto(id)?.arquivo ?? ''}`), local: false });
    setFase('detectando');
  };
  const recomecar = () => {
    setFonte(null);
    setFase('inicio');
    setLinhas([]);
    setDeteccoes([]);
  };

  const mudar = (i: number, campo: Partial<Linha>) => setLinhas((ls) => ls.map((l, k) => (k === i ? { ...l, ...campo } : l)));
  const validas = linhas.filter((l) => l.incluir && l.kg > 0 && l.kg <= 50 && l.validadeDias >= 0);
  const invalidas = linhas.some((l) => l.incluir && !(l.kg > 0 && l.kg <= 50));
  const salvar = () => {
    const h = hoje();
    acoes.adicionar(validas.map((l) => ({ alimento: l.alimento, kg: Math.round(l.kg * 100) / 100, validade: somaDias(h, l.validadeDias), origem: null })));
    aoSalvar(validas.length);
  };
  const ocupado = fase === 'modelo' || fase === 'detectando';

  return (
    <div className={s.painelAba}>
      <p className={s.reconhece}>
        <strong>Reconhece na foto:</strong> {LISTA_RECONHECIDOS}. Os outros alimentos entram{' '}
        <button type="button" className="link" onClick={irParaManual}>à mão, com busca</button>.
      </p>

      {!fonte || fase === 'erro' ? (
        <div className={s.fotoAcoes}>
          <label htmlFor={idArquivo} className="botao botao--verde botao--largo">
            <Icone nome="camera" /> Tirar ou escolher foto
          </label>
          <input id={idArquivo} className="sr" type="file" accept="image/*" capture="environment" onChange={(e) => escolherArquivo(e.target.files?.[0])} />
          <p className={s.dicaAba}>Ou experimente com uma foto de exemplo:</p>
          <div className={s.exemplos}>
            {EXEMPLOS.map((x) => (
              <button key={x.id} type="button" className={s.exemplo} onClick={() => usarExemplo(x.id)}>
                <Alimento id={x.id} tamanho={44} />
                <span>{x.rotulo}</span>
              </button>
            ))}
          </div>
          {fase === 'erro' ? (
            <p className={s.erroEscuro} role="alert">
              {erro} <button type="button" className="link" onClick={recomecar}>Recomeçar</button>
            </p>
          ) : null}
        </div>
      ) : null}

      {fonte && fase !== 'erro' ? (
        <div className={s.analise}>
          <div className={s.quadro}>
            <img ref={imgRef} src={fonte.url} alt="Foto em análise" crossOrigin="anonymous"
              onLoad={() => { if (fase === 'detectando' && !deteccoes.length) void analisar(); }}
              onError={() => { setErro('Não foi possível abrir esta imagem. Use JPG ou PNG.'); setFase('erro'); }} />
            {deteccoes.map((d, i) => (
              <span key={i} className={s.caixa}
                style={{ left: `${d.caixa[0] * 100}%`, top: `${d.caixa[1] * 100}%`, width: `${d.caixa[2] * 100}%`, height: `${d.caixa[3] * 100}%` }}>
                <span>{dados.alimentos[d.alimento].nome} {Math.round(d.confianca * 100)}%</span>
              </span>
            ))}
          </div>
          {ocupado ? (
            <p className={s.lendo} aria-live="polite">
              <span className="girando" aria-hidden="true" />{' '}
              {fase === 'modelo' ? 'Baixando o modelo de reconhecimento (só na primeira vez)…' : 'Procurando alimentos na foto…'}
            </p>
          ) : null}
        </div>
      ) : null}

      {fase === 'revisar' ? (
        <div className={s.revisar} aria-live="polite">
          {linhas.length ? (
            <>
              <p className={s.dicaAba}>
                {deteccoes.length} {deteccoes.length === 1 ? 'item encontrado' : 'itens encontrados'}. O peso é estimado pela contagem; confira antes de salvar.
              </p>
              <ul className={s.linhas}>
                {linhas.map((l, i) => {
                  const a = dados.alimentos[l.alimento];
                  return (
                    <li key={l.alimento} className={l.incluir ? '' : s.desligada}>
                      <input type="checkbox" checked={l.incluir} onChange={(e) => mudar(i, { incluir: e.target.checked })} aria-label={`Incluir ${a.nome}`} />
                      <Alimento id={l.alimento} tamanho={36} />
                      <span className={s.contagem}><strong>{a.nome}</strong> · {l.unidades} {l.unidades === 1 ? 'unidade' : 'unidades'}</span>
                      <span className={s.par}>
                        <label htmlFor={`kg-${i}`}>kg</label>
                        <input id={`kg-${i}`} className="entrada" type="number" inputMode="decimal" min={0.05} max={50} step={0.05} value={l.kg}
                          aria-invalid={!(l.kg > 0 && l.kg <= 50)} onChange={(e) => mudar(i, { kg: Number(e.target.value) })} />
                      </span>
                      <span className={s.par}>
                        <label htmlFor={`d-${i}`}>dias</label>
                        <input id={`d-${i}`} className="entrada" type="number" inputMode="numeric" min={0} max={60} value={l.validadeDias}
                          onChange={(e) => mudar(i, { validadeDias: Math.max(0, Math.round(Number(e.target.value))) })} />
                      </span>
                    </li>
                  );
                })}
              </ul>
              {invalidas ? <p className={s.erroEscuro} role="alert">Corrija o peso: use um valor entre 0,05 e 50 kg.</p> : null}
            </>
          ) : (
            <p className={s.dicaAba}>
              Nenhum alimento reconhecível nesta foto. O reconhecimento funciona para {LISTA_RECONHECIDOS}, com boa luz e os itens à vista.
            </p>
          )}
          <div className={s.dialogoAcoes}>
            <button type="button" className="botao botao--contorno botao--claro" onClick={recomecar}>Outra foto</button>
            {linhas.length ? (
              <button type="button" className="botao botao--verde" disabled={!validas.length || invalidas} onClick={salvar}>
                Salvar {validas.length} {validas.length === 1 ? 'item' : 'itens'}
              </button>
            ) : (
              <button type="button" className="botao botao--verde" onClick={irParaManual}>Adicionar à mão</button>
            )}
          </div>
        </div>
      ) : null}
      <p className={s.privacidade}>A foto é analisada no seu aparelho com TensorFlow.js (modelo COCO-SSD) e não é enviada a nenhum servidor.</p>
    </div>
  );
}

function Manual({ aoSalvar }: { aoSalvar: (n: number) => void }) {
  const [busca, setBusca] = useState('');
  const [alimento, setAlimento] = useState('tomate');
  const [kg, setKg] = useState('1');
  const [validade, setValidade] = useState(() => somaDias(hoje(), dados.alimentos.tomate.dur));
  const [tocado, setTocado] = useState(false);
  const a = dados.alimentos[alimento];
  const encontrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const lista = q ? IDS.filter((id) => dados.alimentos[id].nome.toLowerCase().includes(q)) : SUGESTOES;
    return lista.slice(0, 8);
  }, [busca]);

  const escolher = (id: string) => {
    setAlimento(id);
    setValidade(somaDias(hoje(), dados.alimentos[id].dur));
  };
  const kgNum = Number(kg.replace(',', '.'));
  const erroKg = !(kgNum > 0 && kgNum <= 50) ? 'Informe um peso entre 0,05 e 50 kg.' : '';
  const erroValidade = !ISO_RE.test(validade) ? 'Escolha a data de validade.' : validade < hoje() ? 'A validade não pode ser no passado.' : '';

  return (
    <form
      className={s.painelAba}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTocado(true);
        if (erroKg || erroValidade) return;
        acoes.adicionar([{ alimento, kg: Math.round(kgNum * 100) / 100, validade, origem: null }]);
        aoSalvar(1);
      }}
    >
      <div className="campo">
        <label htmlFor="man-busca">Buscar alimento</label>
        <input id="man-busca" className="entrada" type="search" placeholder="Ex.: abobrinha" value={busca} onChange={(e) => setBusca(e.target.value)} autoComplete="off" />
      </div>
      <div className={s.sugestoes} role="group" aria-label={busca ? 'Resultados' : 'Sugestões'}>
        {encontrados.length ? encontrados.map((id) => (
          <button key={id} type="button" className={s.sugestao} aria-pressed={alimento === id} onClick={() => escolher(id)}>
            <Alimento id={id} tamanho={26} />
            {dados.alimentos[id].nome}
          </button>
        )) : <p className={s.dicaAba}>Nenhum alimento com esse nome no catálogo.</p>}
      </div>
      <div className={s.campoLinha}>
        <div className="campo">
          <label htmlFor="man-kg">Peso (kg)</label>
          <input id="man-kg" className="entrada" type="number" inputMode="decimal" min={0.05} max={50} step={0.05} value={kg}
            aria-invalid={tocado && !!erroKg} aria-describedby="man-kg-erro" onChange={(e) => setKg(e.target.value)} onBlur={() => setTocado(true)} />
          {tocado && erroKg ? <span id="man-kg-erro" className="erro-campo">{erroKg}</span> : null}
        </div>
        <div className="campo">
          <label htmlFor="man-val">Validade</label>
          <input id="man-val" className="entrada" type="date" min={hoje()} value={validade} aria-invalid={tocado && !!erroValidade}
            aria-describedby="man-val-erro" onChange={(e) => setValidade(e.target.value)} />
          {tocado && erroValidade ? <span id="man-val-erro" className="erro-campo">{erroValidade}</span> : null}
        </div>
      </div>
      <p className={s.dicaAba}>Validade sugerida para {a.nome.toLowerCase()}: {a.dur} dias. {a.dica}</p>
      <button type="submit" className="botao botao--verde botao--largo">Adicionar {a.nome.toLowerCase()}</button>
    </form>
  );
}

export default function AdicionarCompras({ aberto, aoFechar }: { aberto: boolean; aoFechar: () => void }) {
  const [aba, setAba] = useState<'foto' | 'manual'>('foto');
  const avisar = useAviso();
  const salvo = (n: number) => {
    aoFechar();
    avisar(n === 1 ? 'Item adicionado à despensa.' : `${n} itens adicionados à despensa.`);
  };
  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} titulo="Adicionar compras">
      <div className={`${s.adicionar} escuro`}>
        <h2>Adicionar compras</h2>
        <div className={s.abas} role="tablist" aria-label="Forma de adicionar">
          {(['foto', 'manual'] as const).map((t) => (
            <button key={t} type="button" role="tab" id={`aba-${t}`} aria-selected={aba === t} aria-controls={`painel-${t}`}
              className={s.aba} onClick={() => setAba(t)}>
              {t === 'foto' ? 'Por foto' : 'À mão'}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
          {aba === 'foto' ? <PorFoto aoSalvar={salvo} irParaManual={() => setAba('manual')} /> : <Manual aoSalvar={salvo} />}
        </div>
      </div>
    </Dialogo>
  );
}
