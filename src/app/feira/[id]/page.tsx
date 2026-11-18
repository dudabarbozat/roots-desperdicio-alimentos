import { dados } from '@/lib/dados';
import Produtor from '@/telas/Produtor';

export function generateStaticParams() {
  return dados.produtores.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: dados.produtores.find((p) => p.id === id)?.nome ?? 'Produtor' };
}

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Produtor id={id} />;
}
