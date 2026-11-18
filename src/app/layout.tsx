import type { Metadata, Viewport } from 'next';
import { Roboto, Source_Sans_3 } from 'next/font/google';
import localFont from 'next/font/local';
import { Casca } from '@/components/Casca';
import { asset } from '@/lib/caminho';
import './globals.css';

const source = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--f-source', display: 'swap' });
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--f-roboto', display: 'swap' });
const glacial = localFont({
  src: [
    { path: '../../node_modules/typeface-glacial-indifference/files/glacial-indifference-400.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/typeface-glacial-indifference/files/glacial-indifference-700.woff2', weight: '700', style: 'normal' }
  ],
  variable: '--f-glacial',
  display: 'swap'
});

export const metadata: Metadata = {
  title: { default: 'Roots', template: '%s · Roots' },
  description: 'Protótipo do Roots: despensa de hortifruti com validade, compras por foto, receitas com o que vence primeiro e feira da agricultura familiar.',
  icons: { icon: asset('/img/favicon.svg') }
};

export const viewport: Viewport = { themeColor: '#193B56', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${source.variable} ${roboto.variable} ${glacial.variable}`}>
      <body>
        <Casca>{children}</Casca>
      </body>
    </html>
  );
}
