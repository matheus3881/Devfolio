import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono, Archivo } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['700', '800', '900'],  // only weights used: bold h2/h3, black h1
});

export const metadata: Metadata = {
  title: 'Matheus Santos — Desenvolvedor Full Stack',
  description:
    'Portfólio de Matheus Santos, desenvolvedor Full Stack focado em IA, automação e LLMs.',
  openGraph: {
    title: 'Matheus Santos — Desenvolvedor Full Stack',
    description: 'Desenvolvedor Full Stack focado em IA, automação e LLMs.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matheus Santos — Desenvolvedor Full Stack',
    description: 'Desenvolvedor Full Stack focado em IA, automação e LLMs.',
  },
  icons: {
    icon: [
      // SVG — primary, adaptive dark/light via CSS media query inside the SVG
      { url: '/icon.svg', type: 'image/svg+xml' },
      // PNG fallbacks for OS/browser contexts that don't support SVG favicons
      // { url: '/icon-dark-32x32.png',  sizes: '32x32', media: '(prefers-color-scheme: dark)' },
      // { url: '/icon-light-32x32.png', sizes: '32x32', media: '(prefers-color-scheme: light)' },
    ],
    // apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
    { media: '(prefers-color-scheme: light)', color: '#f8f8f6' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body
        className={`${geist.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Pular para o conteúdo principal
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
