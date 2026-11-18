'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Icone } from '@/components/Icones';
import { Avatar } from '@/components/Svg';
import { useAviso } from '@/components/Toast';
import { acoes, useEstado } from '@/lib/estado';
import { baixar, gerarIcs, pedirPermissao, permissao, type Permissao } from '@/lib/lembretes';
import SeletorLocal from './SeletorLocal';
import s from './Conta.module.css';

function Perfil() {
  const estado = useEstado();
  const avisar = useAviso();
  const [nome, setNome] = useState(estado?.perfil.nome ?? '');
  const [usuario, setUsuario] = useState(estado ? `@${estado.perfil.usuario}` : '');
  const [tocado, setTocado] = useState(false);
  const erroNome = nome.trim().length < 2 ? 'Informe seu nome.' : '';
  const erroUsuario = !/^@?[a-z0-9._]{3,30}$/i.test(usuario.trim()) ? 'Use de 3 a 30 letras, números, ponto ou sublinhado.' : '';
  if (!estado) return null;
  return (
    <form className={s.form} noValidate onSubmit={(e) => {
      e.preventDefault();
      setTocado(true);
      if (erroNome || erroUsuario) return;
      acoes.salvarPerfil({ nome: nome.trim(), usuario: usuario.trim().replace(/^@+/, ''), cidade: estado.perfil.cidade });
      avisar('Perfil salvo.');
    }}>
      <div className="campo">
        <label htmlFor="conta-nome">Nome</label>
        <input id="conta-nome" className="entrada-clara" value={nome} maxLength={60} autoComplete="name" aria-invalid={tocado && !!erroNome}
          aria-describedby="erro-nome" onChange={(e) => setNome(e.target.value)} onBlur={() => setTocado(true)} />
        {tocado && erroNome ? <span id="erro-nome" className="erro-campo">{erroNome}</span> : null}
      </div>
      <div className="campo">
        <label htmlFor="conta-usuario">Usuário</label>
        <input id="conta-usuario" className="entrada-clara" value={usuario} maxLength={31} aria-invalid={tocado && !!erroUsuario}
          aria-describedby="erro-usuario" onChange={(e) => setUsuario(e.target.value)} onBlur={() => setTocado(true)} />
        {tocado && erroUsuario ? <span id="erro-usuario" className="erro-campo">{erroUsuario}</span> : null}
      </div>
      <button type="submit" className="botao botao--contorno botao--claro">Salvar perfil</button>
    </form>
  );
}

function Lembretes() {
  const estado = useEstado();
  const avisar = useAviso();
  const [perm, setPerm] = useState<Permissao>(() => permissao());
  if (!estado) return null;
  const ativo = estado.lembretes.ativo && perm === 'granted';
  const alternar = async () => {
    if (ativo) {
      acoes.lembretes(false);
      avisar('Lembretes desativados.');
      return;
    }
    const p = await pedirPermissao();
    setPerm(p);
    if (p === 'granted') {
      acoes.lembretes(true);
      avisar('Lembretes ativados.');
    } else {
      avisar(p === 'indisponivel' ? 'Este navegador não mostra notificações. Use o arquivo de agenda.' : 'As notificações estão bloqueadas no navegador. Use o arquivo de agenda.');
    }
  };
  return (
    <section className={s.bloco} aria-labelledby="t-lembretes">
      <h2 id="t-lembretes" className={s.titulo}><Icone nome="sino" /> Lembretes</h2>
      <p>Aviso do navegador quando algo vence amanhã, enquanto o Roots estiver aberto.</p>
      <label className={s.interruptor}>
        <input type="checkbox" role="switch" checked={ativo} onChange={alternar} disabled={perm === 'indisponivel' || perm === 'denied'} />
        <span>{ativo ? 'Ativados' : 'Desativados'}</span>
      </label>
      {perm === 'denied' ? <p className={s.obs}>Notificações bloqueadas nas configurações do navegador.</p> : null}
      {perm === 'indisponivel' ? <p className={s.obs}>Este navegador não oferece notificações.</p> : null}
      <button type="button" className="botao botao--contorno botao--claro botao--pequeno" onClick={() => {
        baixar('roots-lembretes.ics', gerarIcs(estado.despensa), 'text/calendar');
        avisar('Arquivo de agenda baixado. Abra para importar os lembretes.');
      }}>
        <Icone nome="calendario" /> Exportar para a agenda (.ics)
      </button>
    </section>
  );
}

export default function Conta() {
  const estado = useEstado();
  const router = useRouter();
  const avisar = useAviso();
  if (!estado) return <section aria-busy="true"><h1 className="sr">Conta</h1><div className={s.esq} /></section>;
  return (
    <section className={`${s.tela} escuro`} aria-labelledby="t-conta">
      <h1 className="sr" id="t-conta" tabIndex={-1}>Conta</h1>
      <Avatar className={s.avatar} />
      <Perfil key={`${estado.perfil.nome}|${estado.perfil.usuario}`} />
      <section className={s.bloco} aria-labelledby="t-local">
        <h2 id="t-local" className={s.titulo}><Icone nome="local" /> Localização</h2>
        <SeletorLocal escuro />
      </section>
      <Lembretes />
      <div className={s.rodape}>
        <Link href="/creditos/">Créditos das imagens</Link>
        <button type="button" className="link" onClick={() => {
          if (!window.confirm('Restaurar os dados de exemplo? A despensa, o histórico e o perfil atuais serão substituídos.')) return;
          acoes.restaurar();
          avisar('Dados de exemplo restaurados.');
          router.refresh();
        }}>Restaurar dados de exemplo</button>
        <button type="button" className="link" onClick={() => { acoes.entrar(false); router.push('/entrar/'); }}>Sair</button>
      </div>
    </section>
  );
}
