'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEstado } from '@/lib/estado';

/** Entrada: quem já entrou vai para a despensa; na primeira visita, para o login. */
export default function Inicio() {
  const estado = useEstado();
  const router = useRouter();
  useEffect(() => {
    if (estado) router.replace(estado.entrou ? '/despensa/' : '/entrar/');
  }, [estado, router]);
  return <p className="sr">Carregando o Roots…</p>;
}
