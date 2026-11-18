/* Detecção de alimentos na foto, no próprio navegador: TensorFlow.js + COCO-SSD.
   O modelo (lite_mobilenet_v2, ~5 MB) é baixado do armazenamento público do TensorFlow na primeira vez. */
import type { ObjectDetection } from '@tensorflow-models/coco-ssd';

/** Classes do COCO que existem no catálogo do Roots, com peso médio por unidade. */
export const RECONHECIDOS: Record<string, { alimento: string; kgUnidade: number }> = {
  banana: { alimento: 'banana', kgUnidade: 0.12 },
  apple: { alimento: 'maca', kgUnidade: 0.15 },
  orange: { alimento: 'laranja', kgUnidade: 0.2 },
  broccoli: { alimento: 'brocolis', kgUnidade: 0.45 },
  carrot: { alimento: 'cenoura', kgUnidade: 0.1 }
};

export interface Deteccao {
  alimento: string;
  classe: string;
  confianca: number;
  /** caixa em fração da imagem: x, y, largura, altura (0 a 1) */
  caixa: [number, number, number, number];
}

export class ErroDeteccao extends Error {}

let modelo: Promise<ObjectDetection> | null = null;

export function carregarModelo(): Promise<ObjectDetection> {
  if (!modelo) {
    modelo = (async () => {
      const tf = await import('@tensorflow/tfjs-core');
      await import('@tensorflow/tfjs-backend-cpu');
      await import('@tensorflow/tfjs-backend-webgl');
      await import('@tensorflow/tfjs-converter');
      const webgl = await tf.setBackend('webgl').catch(() => false);
      if (!webgl) await tf.setBackend('cpu');
      await tf.ready();
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      const tempo = new Promise<never>((_, rej) => setTimeout(() => rej(new ErroDeteccao('tempo')), 60000));
      return Promise.race([cocoSsd.load({ base: 'lite_mobilenet_v2' }), tempo]);
    })().catch((e) => {
      modelo = null;
      if (e instanceof ErroDeteccao) throw new ErroDeteccao('O modelo de reconhecimento demorou demais para baixar. Tente de novo.');
      throw new ErroDeteccao('Não foi possível baixar o modelo de reconhecimento. Verifique a conexão.');
    });
  }
  return modelo;
}

export async function detectar(img: HTMLImageElement): Promise<Deteccao[]> {
  const m = await carregarModelo();
  const preds = await m.detect(img, 30, 0.35);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  return preds
    .filter((p) => p.class in RECONHECIDOS)
    .map((p) => ({
      alimento: RECONHECIDOS[p.class].alimento,
      classe: p.class,
      confianca: p.score,
      caixa: [p.bbox[0] / w, p.bbox[1] / h, p.bbox[2] / w, p.bbox[3] / h] as [number, number, number, number]
    }));
}
