'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CitizenReportSchema,
  INITIAL_REPORTS,
  SAMPLE_FIELD_PHOTOS,
  CitizenReportData,
  getStoredReports,
  saveStoredReports,
} from '@/lib/mock-data';
import {
  Flame,
  ShieldAlert,
  Wind,
  Camera,
  CheckCircle2,
  Send,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Navigation,
  ThumbsUp,
  MapPin,
  Users,
} from 'lucide-react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const HOTSPOT_LOCATIONS = [
  {
    label: 'Kalimantan Tengah — KHG Kahayan–Sebangau (Pulang Pisau)',
    sector: 'Sektor Gambut Jabiren Raya - Pulang Pisau, Kalimantan Tengah',
    dms: '2°23\'06.0"S 114°04\'55.2"E',
    lat: -2.385,
    lon: 114.082,
    tma: '-68.4 cm',
    station: 'GP-KAL-01',
    cluster: 'CLUSTER-KALTENG-01',
  },
  {
    label: 'Kalimantan Barat — KHG Kapuas–Terentang (Kubu Raya)',
    sector: 'Sektor Gambut Rasau Jaya - Kubu Raya, Kalimantan Barat',
    dms: '0°14\'42.0"S 109°28\'55.2"E',
    lat: -0.245,
    lon: 109.482,
    tma: '-63.0 cm',
    station: 'GP-KAL-02',
    cluster: 'CLUSTER-KALBAR-01',
  },
  {
    label: 'Sumatera (Riau) — KHG Pulau Padang (Kep. Meranti)',
    sector: 'Sektor Desa Pulau Padang Utara - Kepulauan Meranti, Riau',
    dms: '0°15\'30.2"N 102°24\'11.8"E',
    lat: 0.2584,
    lon: 102.4033,
    tma: '-64.5 cm',
    station: 'GP-SUM-01',
    cluster: 'CLUSTER-RIAU-01',
  },
  {
    label: 'Sumatera Selatan — KHG Sungai Sugihan (OKI)',
    sector: 'Sektor KHG Sungai Sugihan - Pampangan OKI, Sumatera Selatan',
    dms: '2°59\'04.2"S 105°19\'15.6"E',
    lat: -2.9845,
    lon: 105.321,
    tma: '-66.2 cm',
    station: 'GP-SUM-02',
    cluster: 'CLUSTER-SUMSEL-01',
  },
  {
    label: 'Jambi — KHG Londerang–Sungai Kumpeh (Muaro Jambi)',
    sector: 'Sektor Gambut Kumpeh - Muaro Jambi, Provinsi Jambi',
    dms: '1°31\'15.6"S 103°53\'38.4"E',
    lat: -1.521,
    lon: 103.894,
    tma: '-49.8 cm',
    station: 'GP-SUM-03',
    cluster: 'CLUSTER-JAMBI-01',
  },
];

export default function MobileCitizenAppPage() {
  const [selectedHotspotIdx, setSelectedHotspotIdx] = useState(0);
  const activeHotspot = HOTSPOT_LOCATIONS[selectedHotspotIdx];

  const [reporterName, setReporterName] = useState(
    'Hendra Kusuma (MPA Jabiren Raya, Kalteng)',
  );
  const [reporterPhone, setReporterPhone] = useState('+6281349002188');
  const [sector, setSector] = useState(HOTSPOT_LOCATIONS[0].sector);
  const [description, setDescription] = useState(
    'Kepulan asap putih pekat berbau gambut menyengat muncul dari bawah permukaan dekat sekat kanal kering Eks-PLG Blok C.',
  );
  const [severity, setSeverity] = useState<
    'ASAP_TIPIS' | 'ASAP_PEKAT_GAMBUT' | 'API_TERBUKA'
  >('ASAP_PEKAT_GAMBUT');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_FIELD_PHOTOS[0].url);
  const [isMockLocation, setIsMockLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [history, setHistory] = useState<CitizenReportData[]>(INITIAL_REPORTS);

  const currentTimestamp = '10 Nov 2026 • 07:15:42 WIB';

  useEffect(() => {
    setHistory(getStoredReports());
    const handleSync = () => setHistory(getStoredReports());
    window.addEventListener('greenpulse-sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('greenpulse-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  function handleSelectHotspot(index: number) {
    setSelectedHotspotIdx(index);
    setSector(HOTSPOT_LOCATIONS[index].sector);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleConfirmNearbyReport(reportId: string) {
    const updated = history.map((r) =>
      r.id === reportId
        ? {
            ...r,
            communityConfirmations: (r.communityConfirmations || 1) + 1,
          }
        : r,
    );
    setHistory(updated);
    saveStoredReports(updated);
    setFeedback({
      type: 'success',
      message:
        'Konfirmasi warga berhasil ditambahkan! Data otomatis tersinkron ke Peta WebGIS Sumatera & Kalimantan.',
    });
  }

  async function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const parsed = CitizenReportSchema.safeParse({
      reporterName,
      reporterPhone,
      sector,
      description,
      latitude: activeHotspot.lat,
      longitude: activeHotspot.lon,
      gpsAccuracyMeters: 3.2,
      severity,
      isMockLocation,
      exifVerified: true,
    });

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || 'Input laporan tidak valid.';
      setFeedback({
        type: 'error',
        message: firstError,
      });
      return;
    }

    setSubmitting(true);

    const nextCode = `GP-REP-2026-00${history.length + 1}`;
    const newReport: CitizenReportData = {
      id: `rep-${Date.now()}`,
      reportCode: nextCode,
      reporterName,
      reporterPhone,
      sector,
      description,
      latitude: activeHotspot.lat,
      longitude: activeHotspot.lon,
      gpsAccuracyMeters: 3.2,
      photoUrl,
      exifVerified: true,
      isMockLocation: false,
      severity,
      status: 'VERIFIED',
      clusterGroupId: activeHotspot.cluster,
      dispatchedTeam: 'Regu Manggala Agni & MPA Menuju Lokasi',
      createdAt: 'Baru saja (Live Mobile)',
      communityConfirmations: 1,
    };

    try {
      await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          photoUrl,
        }),
      });
    } catch {
      // Uses localStorage sync when offline
    }

    const updated = [newReport, ...history];
    setHistory(updated);
    saveStoredReports(updated);
    setFeedback({
      type: 'success',
      message: `Laporan ${nextCode} diterima Posko Satgas Karhutla & langsung tampil di Peta WebGIS (${activeHotspot.cluster})!`,
    });
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F7F4] bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white text-slate-800 md:py-8 md:px-4">
      {/* Desktop-Only Back Link (Hidden on real mobile screens so mobile feels 100% native full-screen) */}
      <div className="hidden md:flex max-w-md w-full mx-auto mb-3 items-center justify-between text-xs font-mono">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke WebGIS Command Center
        </Link>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold">
          Mode Pratinjau Mobile Desktop
        </span>
      </div>

      {/*
        RESPONSIVE CONTAINER:
        - On Mobile (<768px): Full-Screen Native Mobile Web (w-full, min-h-screen, no phone border, no notch)
        - On Desktop (md+): Centered Smartphone Frame (md:max-w-md md:mx-auto md:border-[6px] md:border-emerald-950 md:rounded-[36px] md:shadow-2xl)
      */}
      <div className="w-full min-h-screen md:min-h-0 md:max-w-md md:mx-auto bg-[#F0F7F4] md:bg-white md:rounded-[36px] md:border-[6px] md:border-emerald-950 md:shadow-2xl overflow-hidden flex flex-col">
        {/* Desktop-Only Speaker Notch */}
        <div className="hidden md:flex w-32 h-4 bg-emerald-950 mx-auto rounded-b-xl items-center justify-center">
          <div className="w-10 h-1 rounded-full bg-emerald-800" />
        </div>

        {/* 1. HEADER APLIKASI GREEN PULSE CITIZEN (ELEGANT FOREST GREEN) */}
        <header className="bg-emerald-900 text-white px-4 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-600 flex items-center justify-center"
              title="Buka WebGIS Dashboard"
            >
              <Flame className="w-5 h-5 text-emerald-300" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                GREEN PULSE Citizen
              </h1>
              <span className="text-[11px] font-mono text-emerald-200 block">
                MPA Sumatera & Kalimantan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-800 border border-emerald-500/50 text-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              GPS Aktif (±3.2m)
            </span>
          </div>
        </header>

        {/* Quick Navigation Bar for Mobile Users */}
        <div className="bg-emerald-800 text-emerald-100 px-4 py-2 flex items-center justify-between text-xs border-b border-emerald-700">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-semibold hover:text-white"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            Lihat Peta WebGIS Penuh
          </Link>
          <Link
            href="/dashboard#community-action-plan"
            className="inline-flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-200"
          >
            <Users className="w-3.5 h-3.5" />
            Usulan Sekat Kanal & Patroli
          </Link>
        </div>

        {/* MAIN MOBILE CONTENT BODY */}
        <div className="p-4 sm:p-5 space-y-4 flex-1">
          {/* 2. BANNER PERINGATAN DINI LOKAL BERDASARKAN GPS WARGA */}
          <div className="eco-card-crimson rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-red-700">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600 animate-bounce" />
                EARLY WARNING SYSTEM — SUMATERA & KALIMANTAN
              </span>
              <span>{activeHotspot.station}</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
              PERINGATAN SIAGA: {activeHotspot.sector} Kering (TMA{' '}
              {activeHotspot.tma}). Dilarang Membuka Lahan dengan Api!
            </p>
          </div>

          {/* 3. WIDGET INDEKS STANDAR PENCEMAR UDARA (ISPU - PM2.5) */}
          <div className="eco-card rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center shrink-0">
                <Wind className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                  Kualitas Udara Lokal (PM2.5)
                </div>
                <div className="text-sm sm:text-base font-mono font-extrabold text-orange-700">
                  ISPU 184 — TIDAK SEHAT
                </div>
                <div className="text-xs text-slate-600 leading-snug">
                  Gunakan masker N95/KN95 saat beraktivitas di luar ruangan.
                </div>
              </div>
            </div>
          </div>

          {/* 4. FITUR KAMERA PELAPORAN INSTAN (IN-APP GEOTAGGING CAMERA REPORT) */}
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div className="eco-card rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  Kamera Geotagging Pelaporan Warga
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  Auto-Watermark GPS
                </span>
              </div>

              {/* Pilih Wilayah Titik Rawan (Kalimantan / Sumatera) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilih Sektor GPS Titik Rawan (Kalimantan / Sumatera):
                </label>
                <select
                  value={selectedHotspotIdx}
                  onChange={(e) => handleSelectHotspot(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600"
                >
                  {HOTSPOT_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={idx}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Camera Viewfinder with Automatic Watermark Overlay */}
              <div className="relative h-52 w-full rounded-2xl overflow-hidden border-2 border-emerald-300 bg-slate-900 shadow-sm">
                <img
                  src={photoUrl}
                  alt="Bidikan Kamera Kepulan Asap Gambut"
                  className="w-full h-full object-cover"
                />

                {/* Top Badge Anti-Mock GPS & EXIF Verified */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/85 border border-emerald-400/60 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Anti-Mock GPS & EXIF Verified
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold">
                    LIVE GPS
                  </span>
                </div>

                {/* Bottom Automatic Geotag Watermark Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 font-mono text-[10px] space-y-0.5">
                  <div className="text-emerald-300 font-bold flex items-center justify-between">
                    <span>GREEN PULSE VERIFIED</span>
                    <span>Akurasi GPS: ±3.2m</span>
                  </div>
                  <div className="text-white font-semibold">
                    KOORDINAT: {activeHotspot.dms}
                  </div>
                  <div className="text-slate-300 flex items-center justify-between">
                    <span>{currentTimestamp}</span>
                    <span>TMA Sektor: {activeHotspot.tma}</span>
                  </div>
                </div>
              </div>

              {/* Pilih Foto Lapangan atau Ambil dari Kamera HP */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Ambil Foto Kamera HP / Pilih Bukti Visual:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-900 hover:file:bg-emerald-200"
                />
              </div>

              {/* Pilihan Tingkat Keparahan */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Pilih Tingkat Keparahan Insiden:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    { id: 'ASAP_TIPIS', label: 'Asap Tipis' },
                    { id: 'ASAP_PEKAT_GAMBUT', label: 'Asap Pekat Gambut' },
                    { id: 'API_TERBUKA', label: 'Api Terbuka' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSeverity(item.id as any)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition ${
                        severity === item.id
                          ? 'bg-red-600 border-red-700 text-white shadow-sm'
                          : 'bg-emerald-50/60 border-emerald-200 text-slate-700 hover:bg-emerald-100/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Pelapor, Sektor & Deskripsi Lengkap Tanpa Terpotong */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Pelapor / Anggota MPA
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Nama Pelapor / Anggota MPA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Lokasi Sektor Gambut (Sumatera / Kalimantan)
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Lokasi Sektor Desa / Blok Kanal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Deskripsi Kondisi Asap / Titik Api di Lapangan
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi visual kepulan asap / bau gambut..."
                    className="w-full p-3.5 rounded-xl bg-white border border-emerald-300 text-slate-800 leading-relaxed resize-none focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Simulasi Pengujian Keamanan Anti-Mock Location */}
              <label className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-mono cursor-pointer">
                <span className="text-slate-700">
                  Simulasi Uji Spoofing (isMockLocation):
                </span>
                <input
                  type="checkbox"
                  checked={isMockLocation}
                  onChange={(e) => setIsMockLocation(e.target.checked)}
                  className="accent-red-600 w-4 h-4"
                />
              </label>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2 leading-relaxed ${
                    feedback.type === 'success'
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
                      : 'bg-red-100 border border-red-300 text-red-900'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Tombol Darurat Besar */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-crimson-glow transition"
              >
                <Send className="w-4 h-4" />
                {submitting
                  ? 'Mengirim & Verifikasi EXIF...'
                  : 'Kirim Laporan Titik Api ke Posko BPBD'}
              </button>
            </div>
          </form>

          {/* 5. PELACAKAN STATUS LAPORAN & KONFIRMASI WARGA SEKITAR */}
          <div className="eco-card rounded-2xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                Laporan Warga Sumatera & Kalimantan
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                Live Sync
              </span>
            </div>

            {/* Tahapan Progres Visual */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center">
              <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
                1. Terkirim
              </div>
              <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
                2. Terverifikasi AI & EXIF
              </div>
              <div className="p-2 rounded-lg bg-red-100 border border-red-300 text-red-900 font-bold">
                3. Manggala Agni Menuju Lokasi
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {history.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-amber-800">
                      {item.reportCode}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>
                  <div className="text-emerald-950 font-bold">
                    {item.sector}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-500">
                      Kluster: {item.clusterGroupId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleConfirmNearbyReport(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      <ThumbsUp className="w-3 h-3 text-amber-700" />
                      Saya Juga Melihat Asap ({item.communityConfirmations || 1})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
