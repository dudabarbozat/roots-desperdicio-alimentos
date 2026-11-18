'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icone } from '@/components/Icones';
import { useAviso } from '@/components/Toast';
import { asset } from '@/lib/caminho';
import { acoes } from '@/lib/estado';
import s from './Entrar.module.css';

export default function Entrar() {
  const router = useRouter();
  const avisar = useAviso();
  const entrar = () => {
    acoes.entrar(true);
    router.push('/despensa/');
  };
  return (
    <section className={`${s.tela} escuro`} aria-labelledby="t-entrar">
      <h1 id="t-entrar" tabIndex={-1}>
        <img className={s.logo} src={asset('/img/logo-roots-claro.svg')} alt="Roots" width={1040} height={335} />
      </h1>
      <p className={s.frase}>Sua despensa de hortifruti em dia, sem desperdício.</p>
      <form className={s.form} noValidate onSubmit={(e) => { e.preventDefault(); entrar(); }}>
        <button type="button" className={s.email} onClick={entrar}>
          <Icone nome="email" />
          <span>Entrar com e-mail</span>
        </button>
        <label className="sr" htmlFor="entrar-login">Login</label>
        <input className="entrada-clara" id="entrar-login" type="text" placeholder="Login" autoComplete="username" />
        <label className="sr" htmlFor="entrar-senha">Senha</label>
        <input className="entrada-clara" id="entrar-senha" type="password" placeholder="Senha" autoComplete="current-password" />
        <button type="button" className={`link ${s.esqueci}`} onClick={() => avisar('Recuperação de senha não faz parte da demo.')}>
          Esqueceu sua senha?
        </button>
        <button type="submit" className="botao botao--contorno botao--claro">Entrar</button>
      </form>
      <p className={s.rodape}>
        <span className="simulado simulado--claro">login simulado na demo</span>
        <Link href="/feira/">Quer ser nosso parceiro?</Link>
      </p>
    </section>
  );
}
