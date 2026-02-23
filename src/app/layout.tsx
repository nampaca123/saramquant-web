import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';
import { LanguageProvider } from '@/providers/LanguageProvider';
import './globals.css';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SaramQuant',
  description: 'Translating quant investment into easy language, not wall street jargon',
  icons: {
    icon: '/image/logo/saramquant-logo.jpg',
    apple: '/image/logo/saramquant-logo.jpg',
  },
  openGraph: {
    title: 'SaramQuant',
    description: 'Translating quant investment into easy language, not wall street jargon',
    images: [{ url: '/image/logo/saramquant-logo.jpg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-white text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
