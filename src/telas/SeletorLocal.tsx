'use client';
import { useState } from 'react';
import { Icone } from '@/components/Icones';
import { useAviso } from '@/components/Toast';
import { acoes, LOCAL_PADRAO, useEstado } from '@/lib/estado';
import { mascaraCep } from '@/lib/formato';
import { ErroLocal, localPorCep, localPorGps } from '@/lib/local';
import s from './SeletorLocal.module.css';

/** Define de onde calcular as distâncias: CEP (BrasilAPI) ou localização do aparelho. */
export default function SeletorLocal({ escuro = false, inicialAberto = false }: { escuro?: boolean; inicialAberto?: boolean }) {
  const estado = useEstado();
  const avisar = useAviso();
  const [aberto, setAberto] = useState(inicialAberto);
  const [cep, setCep] = useState('');
  const [carregando, setCarregando] = useState<'cep' | 'gps' | null>(null);
  const [erro, setErro] = useState('');
  if (!estado) return <div className="esqueleto" style={{ minHeight: 48 }} />;

  const aplicar = async (tipo: 'cep' | 'gps') => {
    setErro('');
    if (tipo === 'cep' && cep.replace(/\D/g, '').length !== 8) {
      setErro('Digite os 8 números do CEP.');
      return;
    }
    setCarregando(tipo);
    try {
      const l = tipo === 'cep' ? await localPorCep(cep) : await localPorGps();
      acoes.definirLocal(l);
      setAberto(false);
      avisar(`Distâncias calculadas a partir de ${l.rotulo}.`);
    } catch (e) {
      setErro(e instanceof ErroLocal ? e.message : 'Não foi possível definir a localização.');
    } finally {
      setCarregando(null);
    }
  };

  return (
    <div className={`${s.caixa} ${escuro ? s.escuro : ''}`}>
      <div className={s.linha}>
        <Icone nome="local" className={s.icone} />
        <p className={s.texto}>
          <span className={s.rotulo}>Perto de</span>
          <strong>{estado.local.rotulo}</strong>
          {estado.local.fonte === 'padrao' ? <span className={s.obs}> (padrão da demo)</span> : null}
        </p>
        <button type="button" className="link" aria-expanded={aberto} onClick={() => setAberto((a) => !a)}>
          {aberto ? 'Fechar' : 'Alterar'}
        </button>
      </div>
      {aberto ? (
        <form className={s.form} noValidate onSubmit={(e) => { e.preventDefault(); void aplicar('cep'); }}>
          <div className="campo">
            <label htmlFor="cep">CEP</label>
            <div className={s.cepLinha}>
              <input id="cep" className="entrada" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={cep}
                aria-invalid={!!erro} aria-describedby="cep-erro" onChange={(e) => setCep(mascaraCep(e.target.value))} />
              <button type="submit" className="botao botao--primario" disabled={!!carregando}>
                {carregando === 'cep' ? <span className="girando" aria-hidden="true" /> : null}Buscar
              </button>
            </div>
          </div>
          <button type="button" className={`botao botao--contorno botao--largo ${escuro ? 'botao--claro' : ''}`} disabled={!!carregando} onClick={() => aplicar('gps')}>
            {carregando === 'gps' ? <span className="girando" aria-hidden="true" /> : <Icone nome="mira" />}
            Usar localização do aparelho
          </button>
          {estado.local.fonte !== 'padrao' ? (
            <button type="button" className="link" onClick={() => { acoes.definirLocal({ ...LOCAL_PADRAO }); setAberto(false); }}>
              Voltar ao padrão (Curitiba)
            </button>
          ) : null}
          <p id="cep-erro" className={s.erro} role={erro ? 'alert' : undefined}>{erro}</p>
          <p className={s.fonteDados}>CEP consultado na BrasilAPI. A localização do aparelho só é usada com sua permissão e fica neste navegador.</p>
        </form>
      ) : null}
    </div>
  );
}
