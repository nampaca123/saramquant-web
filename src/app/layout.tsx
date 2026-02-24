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
  metadataBase: new URL('https://www.saramquant.com'),
  title: {
    default: 'SaramQuant',
    template: '%s | SaramQuant',
  },
  description:
    '사회초년생도 안심하고 시작하는 퀀트 투자, 사람퀀트. 어려운 퀀트를 누구나 이해할 수 있도록 쉽게 풀어드립니다.',
  keywords: [
    'SaramQuant',
    '사람퀀트',
    '퀀트 투자',
    '투자 공부',
    '퀀트',
    '사회초년생 투자',
    '어린이 투자',
    '주식 스크리너',
    '포트폴리오',
    '쉬운 퀀트',
    'quant investing',
    'easy quant',
    'child invest',
    'stock screener',
  ],
  alternates: { canonical: '/' },
  icons: { apple: '/image/logo/saramquant-logo.jpg' },
  openGraph: {
    type: 'website',
    siteName: 'SaramQuant | 사람퀀트',
    title: 'SaramQuant',
    description:
      '사회초년생도 안심하고 시작하는 퀀트 투자, 사람퀀트',
    url: 'https://www.saramquant.com',
    locale: 'ko_KR',
    images: [{ url: '/image/logo/saramquant-logo.jpg', width: 1200, height: 630, alt: 'SaramQuant 사람퀀트' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaramQuant',
    description:
      '사회초년생도 안심하고 시작하는 퀀트 투자, 사람퀀트',
    images: ['/image/logo/saramquant-logo.jpg'],
  },
  verification: {
    other: { 'naver-site-verification': '484ae4ed5f3883846ddabe6d5b22b1aff5bfba2f' },
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
