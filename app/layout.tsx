import type { Metadata } from 'next';
import { Geist, Geist_Mono, Cairo } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Taqsak | طقسك — Weather Forecast',
  description: 'Taqsak is a bilingual Arabic/English weather forecast app.',
  keywords: ['weather', 'forecast', 'Arabic weather', 'طقس', 'توقعات الطقس', 'طقسك', 'Taqsak'],
  authors: [{ name: 'Taqsak' }],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Taqsak' },
  openGraph: {
    title: 'Taqsak | طقسك — Weather Forecast',
    description: 'Real-time bilingual weather forecasts for any location.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taqsak | طقسك — Weather Forecast',
    description: 'Real-time bilingual weather forecasts for any location.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('taqsak_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
