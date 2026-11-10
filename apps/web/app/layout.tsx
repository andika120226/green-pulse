import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GREEN PULSE — AIoT Peatland Wildfire Command Center & Community WebGIS',
  description:
    'Sistem Peringatan Dini dan Mitigasi Partisipatif Kebakaran Hutan dan Lahan Gambut (Karhutla) Berbasis AIoT, WebGIS & Crowdsourcing Masyarakat (Standar BRGM)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
      <body className="min-h-screen bg-[#F0F7F4] bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white text-slate-800 antialiased selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
