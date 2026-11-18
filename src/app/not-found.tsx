import Link from 'next/link';

export default function NaoEncontrada() {
  return (
    <section>
      <h1 className="selo-titulo">Página não encontrada</h1>
      <p className="texto-apoio"><Link href="/despensa/">Voltar para a despensa</Link></p>
    </section>
  );
}
