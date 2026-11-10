import Link from 'next/link';
import {
  ShieldAlert,
  Smartphone,
  Activity,
  Flame,
  Radio,
  ArrowRight,
  Users,
  Camera,
  Droplets,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F0F7F4] bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white text-slate-800 flex flex-col justify-between">
      {/* Top Proportional Forest Green Header */}
      <header className="bg-emerald-900 text-white border-b border-emerald-800 shadow-sm">
        <div className="max-w-6xl w-full mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-800 border border-emerald-500/40 flex items-center justify-center shadow-emerald-glow">
              <Flame className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 block font-bold">
                BRGM, BPBD & MASYARAKAT PEDULI API
              </span>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                GREEN PULSE{' '}
                <span className="text-emerald-200/80 font-normal">
                  | AIoT, WebGIS & Community Platform
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-800 text-emerald-200 border border-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LoRaWAN Gateway: ONLINE (99.4%)
            </span>
          </div>
        </div>
      </header>

      <section className="max-w-6xl w-full mx-auto px-6 my-10 md:my-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            SIAGA DARURAT KARHUTLA GAMBUT — WILAYAH SUMATERA & KALIMANTAN
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-emerald-950">
            Deteksi Dini & Mitigasi Partisipatif Kebakaran Lahan Gambut Berbasis{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600">
              AIoT, WebGIS & Crowdsourcing Warga
            </span>
          </h2>

          <p className="text-slate-600 text-base leading-relaxed">
            Integrasi pemantauan Tinggi Muka Air (TMA) gambut secara{' '}
            <em>real-time</em> sesuai standar regulasi BRGM (<code>-40 cm</code>),
            mesin inferensi kerentanan <strong>XGBoost</strong>, serta ruang
            partisipasi aktif masyarakat untuk melaporkan titik asap, mengusulkan
            sekat kanal/sumur bor, dan menjadwalkan patroli Desa Peduli Api.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition shadow-md"
            >
              <Activity className="w-5 h-5 text-emerald-300" />
              Buka WebGIS Command Center (/dashboard)
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/mobile-app"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition shadow-sm"
            >
              <Camera className="w-5 h-5" />
              Lapor Titik Api Warga (/mobile-app)
            </Link>

            <Link
              href="/community"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm transition shadow-sm"
            >
              <Users className="w-5 h-5 text-emerald-200" />
              Komunitas, Berita & Donasi Save Tree (/community)
            </Link>

            <Link
              href="/dashboard#community-action-plan"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs transition shadow-sm"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              Usulkan Sekat Kanal / Jadwal Patroli MPA
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="eco-card-crimson p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-700 uppercase">
                Stasiun Kritis
              </span>
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-red-700">
              -64.5 cm
            </div>
            <p className="text-xs text-slate-600">
              TMA Gambut Sektor Pulau Padang Utara (Ambang Kritis &le; -60 cm)
            </p>
          </div>

          <div className="eco-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase">
                Prediksi XGBoost
              </span>
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-red-600">
              94.2%
            </div>
            <p className="text-xs text-slate-600">
              Probabilitas kebakaran bawah permukaan (Kelembaban 28.4%, Suhu
              38.6°C)
            </p>
          </div>

          <div className="eco-card p-5 rounded-2xl space-y-2.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" />
                Ekosistem Kolaborasi Masyarakat & Pemerintah
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                Real-Time Sync
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-800 font-bold">Lapor Cepat</div>
                <div className="text-slate-600 text-[11px]">
                  Geotag & Anti-Mock
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                <div className="text-teal-800 font-bold">Sekat & Sumur</div>
                <div className="text-slate-600 text-[11px]">
                  Usulan Warga Desa
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-amber-800 font-bold">Patroli MPA</div>
                <div className="text-slate-600 text-[11px]">
                  Jadwal & Air Embung
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl w-full mx-auto px-6 border-t border-emerald-200/80 py-6 flex flex-wrap justify-between items-center text-xs text-slate-500 font-mono">
        <span>
          GREEN PULSE © 2026 — Sistem Mitigasi Partisipatif Karhutla Lahan Gambut
        </span>
        <span>Standar Regulasi: BRGM RI (TMA -40 cm) & Pusdalops BPBD</span>
      </footer>
    </main>
  );
}
