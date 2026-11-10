import Link from 'next/link';
import { ShieldAlert, Smartphone, Activity, Flame, Radio, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-forest-slate text-moss-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pulse-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pulse-crimson/15 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-forest-border pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-pulse-emerald/15 border border-pulse-emerald/40 flex items-center justify-center shadow-emerald-glow">
            <Flame className="w-6 h-6 text-pulse-emerald" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-pulse-emerald block">
              BRGM & BPBD Tactical Ecosystem
            </span>
            <h1 className="text-xl font-extrabold tracking-tight">
              GREEN PULSE <span className="text-moss-white/60 font-normal">| AIoT & WebGIS Platform</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-pulse-emerald/15 text-pulse-emerald border border-pulse-emerald/30">
            <span className="w-2 h-2 rounded-full bg-pulse-emerald animate-ping" />
            LoRaWAN Gateway: ONLINE (99.4%)
          </span>
        </div>
      </header>

      <section className="max-w-6xl w-full mx-auto my-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pulse-crimson/15 border border-pulse-crimson/40 text-pulse-crimson text-xs font-mono font-semibold">
            <ShieldAlert className="w-4 h-4" />
            SIAGA DARURAT KARHUTLA GAMBUT — KHG PULAU PADANG & TEBING TINGGI
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Deteksi Dini Kebakaran Bawah Permukaan Gambut Berbasis{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pulse-emerald via-pulse-amber to-pulse-crimson">
              AIoT, WebGIS & Crowdsourcing
            </span>
          </h2>
          <p className="text-moss-white/75 text-base leading-relaxed">
            Integrasi telemetri Tinggi Muka Air (TMA) gambut secara <em>real-time</em> sesuai standar
            regulasi BRGM (<code>-40 cm</code>), mesin inferensi risiko kebakaran <strong>XGBoost</strong>,
            dan pelaporan warga ber-geotagging anti-<em>mock GPS</em> dengan klusterisasi spasial{' '}
            <strong>Haversine / DBSCAN</strong>.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-pulse-emerald text-forest-slate font-bold text-sm hover:bg-pulse-emerald/90 transition shadow-emerald-glow"
            >
              <Activity className="w-5 h-5" />
              Buka WebGIS Command Center (/dashboard)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mobile-app"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl tactical-glass text-moss-white font-semibold text-sm hover:border-pulse-emerald/60 transition"
            >
              <Smartphone className="w-5 h-5 text-pulse-emerald" />
              Buka Aplikasi Warga MPA (/mobile-app)
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="tactical-glass-crimson p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-pulse-crimson uppercase">Stasiun Kritis</span>
              <Radio className="w-4 h-4 text-pulse-crimson animate-pulse" />
            </div>
            <div className="text-3xl font-mono font-bold text-moss-white">-64.5 cm</div>
            <p className="text-xs text-moss-white/70">
              TMA Gambut Sektor Pulau Padang Utara (Ambang Kritis &le; -60 cm)
            </p>
          </div>

          <div className="tactical-glass p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-pulse-amber uppercase">Prediksi XGBoost</span>
              <Flame className="w-4 h-4 text-pulse-amber" />
            </div>
            <div className="text-3xl font-mono font-bold text-pulse-crimson">94.2%</div>
            <p className="text-xs text-moss-white/70">
              Probabilitas kebakaran bawah permukaan (Kelembaban 28.4%, Suhu 38.6°C)
            </p>
          </div>

          <div className="tactical-glass p-5 rounded-2xl space-y-2 sm:col-span-2">
            <div className="text-xs font-mono text-pulse-emerald uppercase">
              Arsitektur Monorepo Terpadu (Skill Agent 01 — 07)
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-forest-slate/80 border border-forest-border">
                <div className="text-pulse-emerald font-bold">PostgreSQL + Prisma</div>
                <div className="text-moss-white/60">green_pulse_db</div>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-slate/80 border border-forest-border">
                <div className="text-pulse-amber font-bold">NestJS REST + WS</div>
                <div className="text-moss-white/60">Port 4000 / Swagger</div>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-slate/80 border border-forest-border">
                <div className="text-pulse-crimson font-bold">Next.js 14 WebGIS</div>
                <div className="text-moss-white/60">Leaflet + Recharts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl w-full mx-auto border-t border-forest-border pt-6 flex flex-wrap justify-between items-center text-xs text-moss-white/50 font-mono">
        <span>GREEN PULSE © 2026 — Sistem Mitigasi Karhutla Lahan Gambut</span>
        <span>Standar Regulasi: BRGM RI (TMA -40 cm) & Pusdalops BPBD</span>
      </footer>
    </main>
  );
}

