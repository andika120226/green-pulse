import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GREEN PULSE — AIoT Peatland Wildfire Command Center & WebGIS',
  description:
    'Sistem Peringatan Dini dan Mitigasi Kebakaran Hutan dan Lahan Gambut (Karhutla) Berbasis AIoT, WebGIS & Mobile Crowdsourcing (BRGM Standards)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-forest-slate text-moss-white antialiased selection:bg-pulse-emerald selection:text-forest-slate">
        {children}
      </body>
    </html>
  );
}

