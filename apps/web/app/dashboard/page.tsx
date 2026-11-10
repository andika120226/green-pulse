'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  INITIAL_NODES,
  INITIAL_REPORTS,
  INITIAL_PROPOSALS,
  INITIAL_PATROLS,
  INITIAL_TIMESERIES,
  SAMPLE_FIELD_PHOTOS,
  SensorNodeData,
  CitizenReportData,
  CommunityProposalData,
  PatrolScheduleData,
  TimeSeriesPoint,
  getStoredReports,
  saveStoredReports,
  getStoredProposals,
  saveStoredProposals,
  getStoredPatrols,
  saveStoredPatrols,
} from '@/lib/mock-data';
import TmaMicroclimateChart from '@/components/charts/TmaMicroclimateChart';
import {
  Flame,
  Radio,
  Droplets,
  Cpu,
  Users,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Trash2,
  PlusCircle,
  Wifi,
  BatteryCharging,
  Wind,
  Megaphone,
  ThumbsUp,
  MapPin,
  Calendar,
  Camera,
  X,
  Wrench,
  ClipboardCheck,
  Home,
} from 'lucide-react';

// Dynamic import with ssr: false so React-Leaflet builds safely on Vercel & Netlify
const PeatlandWebGIS = dynamic(
  () => import('@/components/map/PeatlandWebGIS'),
  {
    ssr: false,
    loading: () => (
      <div className="eco-card rounded-2xl h-[510px] flex items-center justify-center font-mono text-sm text-emerald-800">
        Memuat Peta Interaktif WebGIS KHG Riau (OpenStreetMap & Esri Satellite)...
      </div>
    ),
  },
);

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function DashboardCommandCenterPage() {
  const [nodes, setNodes] = useState<SensorNodeData[]>(INITIAL_NODES);
  const [reports, setReports] = useState<CitizenReportData[]>(INITIAL_REPORTS);
  const [proposals, setProposals] =
    useState<CommunityProposalData[]>(INITIAL_PROPOSALS);
  const [patrols, setPatrols] = useState<PatrolScheduleData[]>(INITIAL_PATROLS);
  const [timeSeries, setTimeSeries] =
    useState<TimeSeriesPoint[]>(INITIAL_TIMESERIES);
  const [selectedNodeCode, setSelectedNodeCode] = useState<string>('GP-KAL-01');
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [simulatingPacket, setSimulatingPacket] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Participatory Community Action Plan Tabs
  const [activeActionTab, setActiveActionTab] = useState<'proposals' | 'patrols'>(
    'proposals',
  );

  // Modal State for Direct Citizen Fire Report from WebGIS Dashboard
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [modalReporterName, setModalReporterName] = useState(
    'Hendra Kusuma (Warga Jabiren Raya, Kalteng)',
  );
  const [modalReporterPhone, setModalReporterPhone] = useState('+6281349002188');
  const [modalSector, setModalSector] = useState(
    'Sektor Gambut KHG Kahayan–Sebangau (Pulang Pisau, Kalteng)',
  );
  const [modalDescription, setModalDescription] = useState(
    'Terlihat kepulan asap putih pekat dari lahan gambut kering dekat kanal Eks-PLG Blok C, mohon segera dicek.',
  );
  const [modalLat, setModalLat] = useState<number>(-2.385);
  const [modalLng, setModalLng] = useState<number>(114.082);
  const [modalSeverity, setModalSeverity] = useState<
    'ASAP_TIPIS' | 'ASAP_PEKAT_GAMBUT' | 'API_TERBUKA'
  >('ASAP_PEKAT_GAMBUT');
  const [modalPhotoUrl, setModalPhotoUrl] = useState<string>(
    SAMPLE_FIELD_PHOTOS[0].url,
  );

  // Form State for Community Canal Block / Borehole Proposal
  const [propName, setPropName] = useState('');
  const [propVillage, setPropVillage] = useState(
    'Desa Pulau Padang, Kec. Merbau',
  );
  const [propType, setPropType] = useState<
    'SEKAT_KANAL' | 'SUMUR_BOR' | 'EMBUNG_AIR'
  >('SEKAT_KANAL');
  const [propLat, setPropLat] = useState<number>(0.268);
  const [propLng, setPropLng] = useState<number>(102.415);
  const [propUrgency, setPropUrgency] = useState<
    'TINGGI' | 'SEDANG' | 'RENCANA_DESA'
  >('TINGGI');
  const [propReason, setPropReason] = useState('');

  // Form State for MPA Volunteer Patrol & Water Logistics Registration
  const [patrolTeam, setPatrolTeam] = useState('');
  const [patrolCoord, setPatrolCoord] = useState('');
  const [patrolPhone, setPatrolPhone] = useState('');
  const [patrolRoute, setPatrolRoute] = useState(
    'Sektor Sekat Kanal Blok A1 - Embung Desa Pulau Padang',
  );
  const [patrolDate, setPatrolDate] = useState('2026-11-11');
  const [patrolShift, setPatrolShift] = useState<
    'PAGI (07:00-12:00)' | 'SIANG (12:00-17:00)' | 'SORE/MALAM (17:00-22:00)'
  >('PAGI (07:00-12:00)');
  const [patrolWaterStatus, setPatrolWaterStatus] = useState<
    'MELIMPAH' | 'MENYUSUT_WASPADA' | 'KERING_KRITIS'
  >('MENYUSUT_WASPADA');
  const [patrolPersonnel, setPatrolPersonnel] = useState<number>(6);
  const [patrolNotes, setPatrolNotes] = useState(
    'Siap 1 unit pompa jinjing & selang 4 roll, mohon dukungan BBM operasional.',
  );

  // Sync with localStorage & optional backend API
  useEffect(() => {
    setReports(getStoredReports());
    setProposals(getStoredProposals());
    setPatrols(getStoredPatrols());

    const handleStorageSync = () => {
      setReports(getStoredReports());
      setProposals(getStoredProposals());
      setPatrols(getStoredPatrols());
    };
    window.addEventListener('greenpulse-sync', handleStorageSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('greenpulse-sync', handleStorageSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  useEffect(() => {
    async function loadFromApi() {
      try {
        const [nodesRes, tsRes] = await Promise.all([
          fetch(`${API_BASE}/nodes`),
          fetch(`${API_BASE}/telemetry/timeseries?nodeCode=${selectedNodeCode}`),
        ]);

        if (nodesRes.ok) {
          const nData = await nodesRes.json();
          if (Array.isArray(nData) && nData.length > 0) setNodes(nData);
        }
        if (tsRes.ok) {
          const tData = await tsRes.json();
          if (tData?.series?.length > 0) setTimeSeries(tData.series);
        }
      } catch {
        // Uses rich realistic KHG Riau dataset when offline
      }
    }
    loadFromApi();
  }, [selectedNodeCode]);

  // Simulate Live LoRaWAN Telemetry Ingestion
  async function handleSimulateTelemetryPulse() {
    setSimulatingPacket(true);
    const primary = nodes[0] || INITIAL_NODES[0];
    const nextTma = Number((primary.lastWaterLevelTMA - 0.3).toFixed(1));
    const nextMoisture = Number(
      Math.max(21.0, primary.lastSoilMoisture10cm - 0.4).toFixed(1),
    );
    const nextTemp = Number(
      Math.min(41.5, primary.lastSurfaceTemp + 0.3).toFixed(1),
    );

    setNodes((prev) =>
      prev.map((n) =>
        n.nodeCode === 'GP-KAL-01' || n.nodeCode === 'GP-SUM-01'
          ? {
              ...n,
              lastWaterLevelTMA: nextTma,
              lastSoilMoisture10cm: nextMoisture,
              lastSurfaceTemp: nextTemp,
              currentRiskStatus: 'KRITIS',
              predictedRiskScore: 96.8,
              lastSeenAt: 'Baru saja (Live TX)',
            }
          : n,
      ),
    );

    setTimeSeries((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = {
        ...copy[copy.length - 1],
        waterLevelTMA: nextTma,
        soilMoisture10cm: nextMoisture,
        surfaceTemp: nextTemp,
        predictedRiskScore: 96.8,
      };
      return copy;
    });

    setStatusBanner(
      `Paket LoRaWAN Sumatera & Kalimantan Diterima: TMA ${nextTma} cm | Kelembaban ${nextMoisture}% | Suhu ${nextTemp}°C -> Status KRITIS (Skor AI: 96.8%)`,
    );
    setSimulatingPacket(false);
  }

  // Upvote / Citizen Confirmation ("Saya Juga Melihat Asap Ini")
  function handleConfirmReport(reportId: string) {
    const updated = reports.map((r) =>
      r.id === reportId || r.reportCode === reportId
        ? {
            ...r,
            communityConfirmations: (r.communityConfirmations || 1) + 1,
          }
        : r,
    );
    setReports(updated);
    saveStoredReports(updated);
    setStatusBanner(
      `Terima kasih! Konfirmasi warga untuk laporan ${reportId} bertambah. Validasi kerumunan memperkuat prioritas terjun Manggala Agni.`,
    );
  }

  // Verify & Dispatch Manggala Agni for a Citizen Report
  async function handleVerifyAndDispatch(reportId: string) {
    const updated: CitizenReportData[] = reports.map((r) =>
      r.id === reportId || r.reportCode === reportId
        ? {
            ...r,
            status: 'DISPATCHED',
            dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Desa',
            verifiedBy: 'Komandan Posko BPBD Riau',
            verifiedAt: 'Baru saja (Terverifikasi)',
          }
        : r,
    );
    setReports(updated);
    saveStoredReports(updated);
    setStatusBanner(
      `Laporan ${reportId} telah diverifikasi! Regu Manggala Agni Alpha-01 & MPA Desa diterjunkan ke lokasi koordinat.`,
    );
  }

  function handleDeleteReport(reportId: string) {
    const updated = reports.filter(
      (r) => r.id !== reportId && r.reportCode !== reportId,
    );
    setReports(updated);
    saveStoredReports(updated);
  }

  // Submit New Citizen Fire Report from Dashboard Modal
  function handleSubmitWebCitizenReport(e: React.FormEvent) {
    e.preventDefault();
    if (!modalReporterName.trim() || !modalDescription.trim()) return;

    const nextNum = String(reports.length + 1).padStart(3, '0');
    const newReport: CitizenReportData = {
      id: `rep-${Date.now()}`,
      reportCode: `GP-REP-2026-${nextNum}`,
      reporterName: modalReporterName,
      reporterPhone: modalReporterPhone || '+628120000000',
      sector: modalSector,
      description: modalDescription,
      latitude: Number(modalLat),
      longitude: Number(modalLng),
      gpsAccuracyMeters: 3.5,
      photoUrl: modalPhotoUrl || SAMPLE_FIELD_PHOTOS[0].url,
      exifVerified: true,
      isMockLocation: false,
      severity: modalSeverity,
      status: 'PENDING',
      clusterGroupId: 'CLUSTER-KHG01-2026A',
      dispatchedTeam: null,
      verifiedBy: null,
      verifiedAt: null,
      createdAt: 'Baru saja (Kontribusi Web)',
      communityConfirmations: 1,
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    saveStoredReports(updated);
    setIsReportModalOpen(false);
    setStatusBanner(
      `Laporan Warga ${newReport.reportCode} berhasil dikirim dan pin titik api langsung ditambahkan ke Peta WebGIS!`,
    );
  }

  // Handle Photo File Upload in Modal
  function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setModalPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Submit New Community Canal Block / Borehole Proposal
  function handleSubmitProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!propName.trim() || !propReason.trim()) return;

    const newProp: CommunityProposalData = {
      id: `prop-${Date.now()}`,
      proposalCode: `USUL-BRGM-0${proposals.length + 1}`,
      proposerName: propName,
      villageName: propVillage,
      infrastructureType: propType,
      latitude: Number(propLat),
      longitude: Number(propLng),
      urgency: propUrgency,
      reason: propReason,
      votes: 1,
      status: 'DIUSULKAN_WARGA',
      createdAt: 'Baru saja',
    };

    const updated = [newProp, ...proposals];
    setProposals(updated);
    saveStoredProposals(updated);
    setPropName('');
    setPropReason('');
    setStatusBanner(
      `Usulan infrastruktur ${newProp.proposalCode} (${newProp.infrastructureType.replace(
        /_/g,
        ' ',
      )}) berhasil ditambahkan ke Peta Perencanaan WebGIS!`,
    );
  }

  function handleVoteProposal(id: string) {
    const updated = proposals.map((p) =>
      p.id === id ? { ...p, votes: p.votes + 1 } : p,
    );
    setProposals(updated);
    saveStoredProposals(updated);
  }

  // Submit New Volunteer Patrol Schedule
  function handleSubmitPatrol(e: React.FormEvent) {
    e.preventDefault();
    if (!patrolTeam.trim() || !patrolCoord.trim()) return;

    const newPatrol: PatrolScheduleData = {
      id: `patrol-${Date.now()}`,
      teamName: patrolTeam,
      coordinatorName: patrolCoord,
      phone: patrolPhone || '+62812000000',
      sectorRoute: patrolRoute,
      scheduleDate: patrolDate,
      shiftTime: patrolShift,
      waterSourceStatus: patrolWaterStatus,
      personnelCount: Number(patrolPersonnel) || 5,
      equipmentNotes: patrolNotes,
      createdAt: 'Baru saja',
    };

    const updated = [newPatrol, ...patrols];
    setPatrols(updated);
    saveStoredPatrols(updated);
    setPatrolTeam('');
    setPatrolCoord('');
    setPatrolPhone('');
    setStatusBanner(
      `Jadwal Patroli Relawan "${newPatrol.teamName}" berhasil terdaftar di sistem komando masyarakat!`,
    );
  }

  const criticalNode = nodes[0] || INITIAL_NODES[0];
  const activeClusters = new Set(reports.map((r) => r.clusterGroupId)).size;

  return (
    <div className="min-h-screen bg-[#F0F7F4] bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white text-slate-800 pb-12">
      {/* 1. TOP BAR — ELEGANT FOREST GREEN HEADER (PROPORTIONAL CONTRAST) */}
      <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="w-11 h-11 rounded-xl bg-emerald-800/90 border border-emerald-500/40 flex items-center justify-center shadow-emerald-glow hover:bg-emerald-700 transition"
              title="Halaman Utama GREEN PULSE"
            >
              <Flame className="w-6 h-6 text-emerald-300" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  PUSDALOPS BPBD, BRGM & MASYARAKAT PEDULI API
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/90 text-white font-mono text-[10px] font-bold animate-pulse">
                  STATUS: SIAGA KEMARAU GAMBUT
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                GREEN PULSE — AIoT Peatland Command & Community Center
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* LoRaWAN Network Status Pill */}
            <div className="hidden xl:flex px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/70 items-center gap-2 text-xs font-mono">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-emerald-300/80">LoRaWAN Mesh</div>
                <div className="text-emerald-300 font-bold">
                  {nodes.length} Stasiun Online
                </div>
              </div>
            </div>

            {/* Prominent Citizen Report Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
            >
              <Camera className="w-4 h-4" />
              + Lapor Titik Api (Kontribusi Warga)
            </button>

            {/* Simulate Live LoRaWAN Packet Button */}
            <button
              type="button"
              onClick={handleSimulateTelemetryPulse}
              disabled={simulatingPacket}
              className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-emerald-100 text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${simulatingPacket ? 'animate-spin' : ''}`}
              />
              Simulasi Sensor
            </button>

            {/* Switch to Citizen Mobile App */}
            <Link
              href="/mobile-app"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              Aplikasi HP Warga
            </Link>

            {/* Emergency Broadcast Button */}
            <button
              type="button"
              onClick={() => {
                setBroadcastActive((b) => !b);
                setStatusBanner(
                  'PERINGATAN DINI AKTIF: Notifikasi darurat dikirim ke 1.420 warga & Regu MPA Sektor Pulau Padang!',
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Megaphone className="w-4 h-4" />
              Siaran Darurat
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-5 space-y-6">
        {/* Live Notification Banner */}
        {(statusBanner || broadcastActive) && (
          <div className="rounded-xl bg-emerald-900 text-white px-4 py-3 flex items-center justify-between text-xs font-mono shadow-md border border-emerald-700">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {statusBanner ||
                  'SIARAN DARURAT AKTIF: Dilarang membuka lahan dengan api di Sektor KHG Pulau Padang!'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStatusBanner(null);
                setBroadcastActive(false);
              }}
              className="text-emerald-200 hover:text-white underline ml-4 shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 2. BENTO GRID METRIC CARDS (4 KARTU UTAMA - ECO-FRESH BOTANICAL) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Rata-rata Tinggi Muka Air (TMA) Gambut */}
          <div className="eco-card-crimson rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-red-900">
                1. Tinggi Muka Air (TMA) Gambut
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px] font-bold">
                KRITIS &le; -60 cm
              </span>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-mono font-extrabold text-red-700">
                {criticalNode.lastWaterLevelTMA} cm
              </span>
              <span className="text-xs font-mono text-red-600 font-semibold">
                (-24.5 cm dari batas BRGM)
              </span>
            </div>
            <div className="text-xs text-slate-600 flex items-center justify-between border-t border-red-200/70 pt-2.5 font-mono">
              <span>Ambang BRGM: -40.0 cm</span>
              <span className="text-red-700 font-bold">Stasiun GP-KHG-01</span>
            </div>
          </div>

          {/* Card 2: Kelembaban Tanah Rata-rata (10cm & 40cm) */}
          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                2. Kelembaban Tanah (10cm & 40cm)
              </span>
              <Droplets className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-mono font-extrabold text-amber-600">
                {criticalNode.lastSoilMoisture10cm}%
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                | Kedalaman 40cm: {criticalNode.lastSoilMoisture40cm}%
              </span>
            </div>
            <div className="text-xs text-slate-600 flex items-center justify-between border-t border-emerald-100 pt-2.5 font-mono">
              <span className="text-amber-700 font-bold">
                Indikator: Gambut Kering (&lt;35%)
              </span>
              <span className="font-semibold">Suhu: {criticalNode.lastSurfaceTemp}°C</span>
            </div>
          </div>

          {/* Card 3: Prediksi Kerentanan AI (XGBoost Engine) */}
          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                3. Prediksi AI (XGBoost Engine)
              </span>
              <Cpu className="w-4 h-4 text-orange-600" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-mono font-extrabold text-red-600">
                {criticalNode.predictedRiskScore}%
              </span>
              <span className="text-xs font-mono text-slate-600">
                Kerentanan Api Bawah Permukaan
              </span>
            </div>
            <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 h-full rounded-full"
                style={{ width: `${criticalNode.predictedRiskScore}%` }}
              />
            </div>
          </div>

          {/* Card 4: Laporan & Partisipasi Warga (Crowdsourcing) */}
          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                4. Partisipasi & Laporan Warga
              </span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-mono font-extrabold text-emerald-700">
                {reports.length} Laporan
              </span>
              <span className="text-xs font-mono text-teal-700 font-semibold">
                + {proposals.length} Usulan Sekat/Sumur
              </span>
            </div>
            <div className="text-xs text-slate-600 flex items-center justify-between border-t border-emerald-100 pt-2.5 font-mono">
              <span className="text-emerald-800 font-bold">
                {activeClusters} Kluster Spasial (500m)
              </span>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="text-emerald-700 hover:underline font-bold"
              >
                + Kirim Laporan
              </button>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE WEBGIS MAP & TIME-SERIES ANALYTICS CHART */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <PeatlandWebGIS
              nodes={nodes}
              reports={reports}
              proposals={proposals}
              onVerifyAndDispatch={handleVerifyAndDispatch}
              onConfirmReport={handleConfirmReport}
              onSelectNode={(code) => setSelectedNodeCode(code)}
              onPickMapCoordinates={(lat, lng) => {
                setModalLat(lat);
                setModalLng(lng);
                setPropLat(lat);
                setPropLng(lng);
              }}
              onOpenReportModalWithCoords={(lat, lng) => {
                setModalLat(lat);
                setModalLng(lng);
                setIsReportModalOpen(true);
              }}
            />
          </div>
          <div className="lg:col-span-5">
            <TmaMicroclimateChart
              data={timeSeries}
              selectedNodeCode={selectedNodeCode}
            />
          </div>
        </section>

        {/* 4. PANEL TABEL VERIFIKASI CROWDSOURCING & STATUS STASIUN LORAWAN */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Crowdsourcing Verification, Upvote Confirmation & Dispatch Table */}
          <div className="xl:col-span-7 eco-card rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-700 font-bold">
                  CROWDSOURCING WARGA & KONFIRMASI KOMUNITAS (HAVERSINE 500M)
                </span>
                <h3 className="text-base md:text-lg font-extrabold text-emerald-950">
                  Daftar Laporan Titik Api & Validasi Masyarakat Sekitar
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Lapor Titik Api dari Web
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-emerald-200 text-slate-600 font-mono text-[11px] bg-emerald-50/60">
                    <th className="py-2.5 px-2.5 rounded-tl-lg">ID & Kluster</th>
                    <th className="py-2.5 px-2.5">Pelapor & Keterangan Lokasi</th>
                    <th className="py-2.5 px-2.5">Validasi Warga Sekitar</th>
                    <th className="py-2.5 px-2.5">Keparahan</th>
                    <th className="py-2.5 px-2.5 rounded-tr-lg">Disposisi & Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-emerald-50/40 transition">
                      <td className="py-3 px-2.5 font-mono align-top">
                        <div className="font-bold text-emerald-950">
                          {rep.reportCode}
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-semibold">
                          {rep.clusterGroupId}
                        </span>
                      </td>
                      <td className="py-3 px-2.5 align-top max-w-xs">
                        <div className="font-bold text-slate-900">
                          {rep.reporterName}
                        </div>
                        <div className="text-emerald-800 font-semibold text-[11px]">
                          {rep.sector}
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                          {rep.description}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          📍 {rep.latitude.toFixed(4)}°N, {rep.longitude.toFixed(4)}°E • EXIF Verified
                        </div>
                      </td>
                      <td className="py-3 px-2.5 align-top">
                        <div className="font-mono text-[11px] text-emerald-900 font-bold mb-1.5">
                          👍 {rep.communityConfirmations || 1} Warga Mengonfirmasi
                        </div>
                        <button
                          type="button"
                          onClick={() => handleConfirmReport(rep.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-[11px] flex items-center gap-1 transition"
                        >
                          <ThumbsUp className="w-3 h-3 text-amber-700" />
                          Saya Juga Melihat Asap
                        </button>
                      </td>
                      <td className="py-3 px-2.5 font-mono align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            rep.severity === 'API_TERBUKA'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : rep.severity === 'ASAP_PEKAT_GAMBUT'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {rep.severity.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2.5 align-top">
                        <div className="flex items-center gap-1.5">
                          {rep.status !== 'DISPATCHED' ? (
                            <button
                              type="button"
                              onClick={() => handleVerifyAndDispatch(rep.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-sm"
                            >
                              <Navigation className="w-3 h-3" />
                              Dispatch Regu
                            </button>
                          ) : (
                            <span className="px-2 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              DITERJUNKAN
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteReport(rep.id)}
                            title="Hapus Laporan"
                            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LoRaWAN Sensor Nodes Telemetry Status Table */}
          <div className="xl:col-span-5 eco-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-700 font-bold">
                  JARINGAN TELEMETRI AIOT LORAWAN
                </span>
                <h3 className="text-base md:text-lg font-extrabold text-emerald-950">
                  Status Stasiun Sensor Sumatera & Kalimantan
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
                Klik stasiun untuk filter grafik
              </span>
            </div>

            <div className="space-y-2.5">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeCode(node.nodeCode)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    selectedNodeCode === node.nodeCode
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-sm'
                      : 'bg-white border-emerald-100 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono font-bold text-xs text-emerald-900">
                        {node.nodeCode}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {node.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 flex flex-wrap items-center gap-3">
                      <span>
                        TMA: <strong>{node.lastWaterLevelTMA} cm</strong>
                      </span>
                      <span>Lembab: {node.lastSoilMoisture10cm}%</span>
                      <span>Suhu: {node.lastSurfaceTemp}°C</span>
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold block ${
                        node.currentRiskStatus === 'KRITIS'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : node.currentRiskStatus === 'SIAGA'
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : node.currentRiskStatus === 'WASPADA'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {node.currentRiskStatus} ({node.predictedRiskScore}%)
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-600" />
                      {node.batteryPercent}% • {node.rssiDbm}dBm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PANEL PERENCANAAN & AKSI MITIGASI PARTISIPATIF MASYARAKAT (COMMUNITY ACTION PLAN) */}
        <section
          id="community-action-plan"
          className="eco-card rounded-3xl p-6 md:p-7 space-y-6 border-2 border-emerald-300/80"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                COMMUNITY ACTION PLAN & PARTICIPATORY PLANNING
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-emerald-950 mt-1.5">
                Perencanaan & Aksi Mitigasi Partisipatif Masyarakat Desa Gambut
              </h2>
              <p className="text-xs md:text-sm text-slate-600">
                Warga dan kelompok Masyarakat Peduli Api (MPA) dapat mengusulkan pembangunan sekat kanal/sumur bor baru serta mendaftarkan jadwal patroli kemarau secara langsung.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 p-1.5 rounded-xl border border-emerald-200">
              <button
                type="button"
                onClick={() => setActiveActionTab('proposals')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeActionTab === 'proposals'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                1. Usulan Sekat Kanal & Sumur Bor ({proposals.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveActionTab('patrols')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeActionTab === 'patrols'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                2. Jadwal Patroli MPA & Logistik Air ({patrols.length})
              </button>
            </div>
          </div>

          {activeActionTab === 'proposals' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Usulan Titik Sekat Kanal & Sumur Bor Baru */}
              <form
                onSubmit={handleSubmitProposal}
                className="lg:col-span-5 bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-3.5"
              >
                <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  Form Usulan Titik Sekat Kanal / Sumur Bor Warga
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Pengusul / Kelompok Tani / MPA
                  </label>
                  <input
                    type="text"
                    required
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    placeholder="Contoh: Kelompok Tani Sagu Lestari"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Desa / Lokasi Sektor
                    </label>
                    <input
                      type="text"
                      required
                      value={propVillage}
                      onChange={(e) => setPropVillage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jenis Infrastruktur Restorasi
                    </label>
                    <select
                      value={propType}
                      onChange={(e) => setPropType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="SEKAT_KANAL">Sekat Kanal (Canal Blocking)</option>
                      <option value="SUMUR_BOR">Sumur Bor Pemadam (Borehole)</option>
                      <option value="EMBUNG_AIR">Embung Air Komunitas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 block mb-1">
                      Latitude (Klik Peta)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={propLat}
                      onChange={(e) => setPropLat(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 block mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={propLng}
                      onChange={(e) => setPropLng(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 block mb-1">
                      Prioritas
                    </label>
                    <select
                      value={propUrgency}
                      onChange={(e) => setPropUrgency(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="TINGGI">Darurat Tinggi</option>
                      <option value="SEDANG">Menengah</option>
                      <option value="RENCANA_DESA">Rencana Desa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Alasan & Kondisi Kekeringan Lapangan
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={propReason}
                    onChange={(e) => setPropReason(e.target.value)}
                    placeholder="Jelaskan kondisi kanal kering atau jarak sumber air terdekat..."
                    className="w-full p-3 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 leading-relaxed resize-none focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MapPin className="w-4 h-4" />
                  Kirim Usulan Titik Restorasi ke Peta WebGIS
                </button>
              </form>

              {/* Daftar Usulan Infrastruktur Masyarakat */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-mono text-slate-500">
                  Seluruh titik usulan warga di bawah ini otomatis ditampilkan pada Peta WebGIS (Marker Hijau Toska) untuk dikaji bersama BRGM & Pemerintah Desa:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-teal-800">
                            {prop.proposalCode}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 border border-teal-300 text-teal-900 font-mono text-[10px] font-bold">
                            {prop.infrastructureType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-emerald-950">
                          {prop.villageName}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {prop.reason}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-emerald-100 flex items-center justify-between text-xs">
                        <div className="font-mono text-[11px] text-slate-500">
                          Oleh: <strong className="text-slate-700">{prop.proposerName}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVoteProposal(prop.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                          Dukung ({prop.votes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Pendaftaran Jadwal Patroli Relawan MPA & Logistik */}
              <form
                onSubmit={handleSubmitPatrol}
                className="lg:col-span-5 bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-3.5"
              >
                <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-700" />
                  Form Pendaftaran Patroli Relawan MPA & Logistik Air
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nama Regu / Kelompok Warga
                    </label>
                    <input
                      type="text"
                      required
                      value={patrolTeam}
                      onChange={(e) => setPatrolTeam(e.target.value)}
                      placeholder="Contoh: Regu MPA Merbau Jaya"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Koordinator Lapangan
                    </label>
                    <input
                      type="text"
                      required
                      value={patrolCoord}
                      onChange={(e) => setPatrolCoord(e.target.value)}
                      placeholder="Nama Ketua Regu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Rute Sektor Patroli Sekat Kanal
                  </label>
                  <input
                    type="text"
                    required
                    value={patrolRoute}
                    onChange={(e) => setPatrolRoute(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Tanggal Patroli
                    </label>
                    <input
                      type="date"
                      value={patrolDate}
                      onChange={(e) => setPatrolDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Shift Waktu
                    </label>
                    <select
                      value={patrolShift}
                      onChange={(e) => setPatrolShift(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="PAGI (07:00-12:00)">Pagi (07-12)</option>
                      <option value="SIANG (12:00-17:00)">Siang (12-17)</option>
                      <option value="SORE/MALAM (17:00-22:00)">Sore/Malam</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Kondisi Air Embung
                    </label>
                    <select
                      value={patrolWaterStatus}
                      onChange={(e) =>
                        setPatrolWaterStatus(e.target.value as any)
                      }
                      className="w-full px-2 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="MELIMPAH">Air Melimpah</option>
                      <option value="MENYUSUT_WASPADA">Mulai Menyusut</option>
                      <option value="KERING_KRITIS">Kering Kritis</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Kesiapan Peralatan & Logistik Regu
                  </label>
                  <textarea
                    rows={3}
                    value={patrolNotes}
                    onChange={(e) => setPatrolNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Calendar className="w-4 h-4" />
                  Daftarkan Jadwal Patroli & Laporan Air Desa
                </button>
              </form>

              {/* Daftar Jadwal Patroli Relawan Aktif */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-mono text-slate-500">
                  Jadwal kesiapsiagaan masyarakat desa dan ketersediaan air embung lokal yang terhubung langsung ke Posko BPBD:
                </div>
                <div className="space-y-3">
                  {patrols.map((pt) => (
                    <div
                      key={pt.id}
                      className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-emerald-950">
                            {pt.teamName}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                            {pt.scheduleDate} • {pt.shiftTime}
                          </span>
                        </div>
                        <div className="text-xs text-slate-700 font-medium">
                          Rute: {pt.sectorRoute}
                        </div>
                        <div className="text-xs text-slate-500">
                          Logistik: {pt.equipmentNotes}
                        </div>
                      </div>

                      <div className="sm:text-right font-mono space-y-1 shrink-0">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            pt.waterSourceStatus === 'KERING_KRITIS'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : pt.waterSourceStatus === 'MENYUSUT_WASPADA'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          AIR EMBUNG: {pt.waterSourceStatus.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[11px] text-slate-600">
                          Koordinator: <strong>{pt.coordinatorName}</strong> ({pt.personnelCount} Personel)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 6. MODAL LAPOR TITIK API / KONTRIBUSI WARGA LANGSUNG DARI WEBGIS */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-emerald-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    Lapor Titik Api / Kepulan Asap (Kontribusi Warga)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pin laporan otomatis tampil di Peta WebGIS & Posko BPBD
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitWebCitizenReport} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Pelapor / Relawan
                  </label>
                  <input
                    type="text"
                    required
                    value={modalReporterName}
                    onChange={(e) => setModalReporterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    No. WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={modalReporterPhone}
                    onChange={(e) => setModalReporterPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-300 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lokasi Sektor / Desa Gambut
                </label>
                <input
                  type="text"
                  required
                  value={modalSector}
                  onChange={(e) => setModalSector(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-slate-600 block mb-1">
                    Latitude (Bisa Klik di Peta)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={modalLat}
                    onChange={(e) => setModalLat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-50/50 border border-emerald-300 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-slate-600 block mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={modalLng}
                    onChange={(e) => setModalLng(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-50/50 border border-emerald-300 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Tingkat Keparahan Visual:
                </label>
                <div className="grid grid-cols-3 gap-2 font-bold">
                  {[
                    { id: 'ASAP_TIPIS', label: 'Asap Tipis' },
                    { id: 'ASAP_PEKAT_GAMBUT', label: 'Asap Pekat Gambut' },
                    { id: 'API_TERBUKA', label: 'Api Terbuka' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setModalSeverity(item.id as any)}
                      className={`py-2 px-2 rounded-xl border text-center transition ${
                        modalSeverity === item.id
                          ? 'bg-red-600 border-red-700 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Unggah Foto Bukti Lapangan atau Pilih Sampel Kamera Geotag:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-900 hover:file:bg-emerald-200 mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_FIELD_PHOTOS.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setModalPhotoUrl(sample.url)}
                      className={`p-1 rounded-lg border text-left transition ${
                        modalPhotoUrl === sample.url
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30'
                          : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-full h-12 object-cover rounded"
                      />
                      <span className="block text-[10px] font-medium text-slate-700 mt-1 truncate">
                        {sample.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deskripsi Kondisi Asap / Titik Api
                </label>
                <textarea
                  rows={3}
                  required
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-emerald-50/50 border border-emerald-300 text-slate-800 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold flex items-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Kirim Laporan & Tambahkan Pin ke Peta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
