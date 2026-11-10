'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  INITIAL_COMMUNITY_POSTS,
  INITIAL_CAMPAIGNS,
  INITIAL_TRANSACTIONS,
  SAMPLE_FIELD_PHOTOS,
  CommunityPostData,
  DonationCampaignData,
  DonationTransactionData,
  getStoredPosts,
  saveStoredPosts,
  getStoredCampaigns,
  saveStoredCampaigns,
  getStoredTransactions,
  saveStoredTransactions,
} from '@/lib/mock-data';
import {
  Flame,
  Trees,
  HeartHandshake,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  Send,
  Camera,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Users,
  ArrowLeft,
  Smartphone,
  Activity,
  Sparkles,
  Receipt,
  X,
  Newspaper,
} from 'lucide-react';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CommunityAndDonationPage() {
  const [posts, setPosts] = useState<CommunityPostData[]>(
    INITIAL_COMMUNITY_POSTS,
  );
  const [campaigns, setCampaigns] =
    useState<DonationCampaignData[]>(INITIAL_CAMPAIGNS);
  const [transactions, setTransactions] = useState<DonationTransactionData[]>(
    INITIAL_TRANSACTIONS,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // New Community Post Form State
  const [postAuthor, setPostAuthor] = useState(
    'Rizky Pratama (Relawan Muda Save Tree)',
  );
  const [postRole, setPostRole] = useState<CommunityPostData['authorRole']>(
    'WARGA_LOKAL',
  );
  const [postIsland, setPostIsland] =
    useState<CommunityPostData['island']>('KALIMANTAN');
  const [postLocation, setPostLocation] = useState(
    'KHG Sebangau, Pulang Pisau — Kalimantan Tengah',
  );
  const [postCategory, setPostCategory] =
    useState<CommunityPostData['category']>('BERITA_BENCANA_TERKINI');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string>(SAMPLE_FIELD_PHOTOS[0].url);
  const [showPostForm, setShowPostForm] = useState(false);

  // Comment input map per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Donation Modal State
  const [activeCampaign, setActiveCampaign] =
    useState<DonationCampaignData | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donationAmount, setDonationAmount] = useState<number>(150000);
  const [donorMessage, setDonorMessage] = useState(
    'Semoga bantuan ini mempercepat pemadaman gambut dan bibit pohon tumbuh subur!',
  );
  const [paymentMethod, setPaymentMethod] = useState(
    'QRIS Transparan Posko Pusat',
  );

  // Impact Report Modal State (Publish Realization Report -> Auto-Post to Community Feed)
  const [reportCampaign, setReportCampaign] =
    useState<DonationCampaignData | null>(null);
  const [reportSummaryInput, setReportSummaryInput] = useState('');
  const [reportTreesInput, setReportTreesInput] = useState<number>(500);

  useEffect(() => {
    setPosts(getStoredPosts());
    setCampaigns(getStoredCampaigns());
    setTransactions(getStoredTransactions());

    const handleSync = () => {
      setPosts(getStoredPosts());
      setCampaigns(getStoredCampaigns());
      setTransactions(getStoredTransactions());
    };
    window.addEventListener('greenpulse-sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('greenpulse-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPostImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // 1. Create a New Community News / Save Tree Post
  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: CommunityPostData = {
      id: `post-${Date.now()}`,
      authorName: postAuthor || 'Warga Peduli Gambut',
      authorRole: postRole,
      locationTag: postLocation,
      island: postIsland,
      category: postCategory,
      title: postTitle,
      content: postContent,
      imageUrl: postImage,
      likes: 1,
      treesPlantedImpact: postCategory === 'AKSI_SAVE_TREE' ? 50 : undefined,
      createdAt: 'Baru saja',
      comments: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);
    setPostTitle('');
    setPostContent('');
    setShowPostForm(false);
    setBannerMessage(
      `Berita komunitas "${newPost.title}" berhasil dipublikasikan ke lini masa warga!`,
    );
  }

  // 2. Like a Community Post
  function handleLikePost(postId: string) {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p,
    );
    setPosts(updated);
    saveStoredPosts(updated);
  }

  // 3. Add a Comment on a Community Post
  function handleAddComment(postId: string) {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [
          ...p.comments,
          {
            id: `c-${Date.now()}`,
            authorName: 'Warga Komunitas GREEN PULSE',
            authorRole: 'Kontributor Aktif',
            content: text,
            createdAt: 'Baru saja',
          },
        ],
      };
    });

    setPosts(updated);
    saveStoredPosts(updated);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  }

  // 4. Submit Transparent Citizen Donation & Save Tree Sponsorship
  function handleSubmitDonation(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCampaign) return;

    const cleanAmount = Math.max(10000, Number(donationAmount) || 50000);
    const sponsoredTrees = Math.max(1, Math.floor(cleanAmount / 20000));
    const txCode = `TX-GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: DonationTransactionData = {
      id: `tx-${Date.now()}`,
      txCode,
      donorName: donorName.trim() || 'Hamba Allah / Sahabat Gambut',
      campaignId: activeCampaign.id,
      campaignTitle: activeCampaign.title,
      amountRp: cleanAmount,
      treesSponsored: sponsoredTrees,
      message: donorMessage,
      paymentMethod,
      status: 'TERVERIFIKASI_PUBLIK',
      createdAt: 'Baru saja (Real-Time Ledger)',
    };

    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    saveStoredTransactions(updatedTx);

    const updatedCampaigns = campaigns.map((c) => {
      if (c.id !== activeCampaign.id) return c;
      const nextCollected = c.collectedAmountRp + cleanAmount;
      const nextTrees = c.plantedTrees + sponsoredTrees;
      return {
        ...c,
        collectedAmountRp: nextCollected,
        plantedTrees: nextTrees,
        donorCount: c.donorCount + 1,
        transparencyStage: Math.max(c.transparencyStage, 2) as 1 | 2 | 3 | 4,
      };
    });

    setCampaigns(updatedCampaigns);
    saveStoredCampaigns(updatedCampaigns);
    setActiveCampaign(null);
    setDonorName('');
    setBannerMessage(
      `Terima kasih! Donasi ${formatRupiah(
        cleanAmount,
      )} (${sponsoredTrees} Pohon Gambut) tercatat dengan Kode Audit ${txCode} dan langsung diteruskan ke Posko Pusat!`,
    );
  }

  // 5. Publish Execution & Impact Report -> Automatically Creates Verified News Post in Community Feed!
  function handlePublishImpactReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportCampaign || !reportSummaryInput.trim()) return;

    const auditCode = `AUDIT-PUSAT-2026-${Math.floor(100 + Math.random() * 899)}`;
    const addedTrees = Math.max(0, Number(reportTreesInput) || 0);

    // Update campaign status to TERLAKSANA_DILAPORKAN (Stage 4)
    const updatedCampaigns: DonationCampaignData[] = campaigns.map((c) => {
      if (c.id !== reportCampaign.id) return c;
      return {
        ...c,
        status: 'TERLAKSANA_DILAPORKAN',
        transparencyStage: 4,
        plantedTrees: c.plantedTrees + addedTrees,
        impactReportSummary: reportSummaryInput,
        impactReportDate: 'Baru saja (Terverifikasi Posko Pusat)',
        breakdown: c.breakdown.map((b) => ({ ...b, status: 'TERSALURKAN' })),
      };
    });

    setCampaigns(updatedCampaigns);
    saveStoredCampaigns(updatedCampaigns);

    // Automatically create a transparent news report post in the Community Feed!
    const autoReportPost: CommunityPostData = {
      id: `post-audit-${Date.now()}`,
      authorName: `Posko Transparansi Pusat & ${reportCampaign.organizer}`,
      authorRole: 'TIM_AUDIT_TRANSPARANSI',
      locationTag: reportCampaign.location,
      island: reportCampaign.island,
      category: 'LAPORAN_HASIL_DONASI',
      title: `[LAPORAN HASIL TERLAKSANA] Penyaluran Dana & Tanam Pohon: ${reportCampaign.title}`,
      content: `${reportSummaryInput} — Seluruh dana masyarakat sebesar ${formatRupiah(
        reportCampaign.collectedAmountRp,
      )} telah disalurkan secara transparan dari Posko Pusat ke lapangan dan diverifikasi bersama warga lokal.`,
      imageUrl: reportCampaign.imageUrl,
      likes: 15,
      treesPlantedImpact: reportCampaign.plantedTrees + addedTrees,
      disbursedAmountRp: reportCampaign.collectedAmountRp,
      linkedCampaignId: reportCampaign.id,
      verifiedAuditCode: auditCode,
      createdAt: 'Baru saja (Otomatis dari Laporan Posko)',
      comments: [],
    };

    const updatedPosts = [autoReportPost, ...posts];
    setPosts(updatedPosts);
    saveStoredPosts(updatedPosts);

    setReportCampaign(null);
    setReportSummaryInput('');
    setBannerMessage(
      `Laporan Hasil Pelaksanaan (${auditCode}) berhasil diterbitkan! Berita pertanggungjawaban otomatis muncul di Lini Masa Komunitas.`,
    );
  }

  const totalCollectedRp = campaigns.reduce(
    (acc, c) => acc + c.collectedAmountRp,
    0,
  );
  const totalPlantedTrees = campaigns.reduce(
    (acc, c) => acc + c.plantedTrees,
    0,
  );
  const totalDonors = campaigns.reduce((acc, c) => acc + c.donorCount, 0);

  const filteredPosts =
    selectedCategory === 'ALL'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F0F7F4] bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white text-slate-800 pb-14">
      {/* 1. TOP HEADER — ECO-FRESH FOREST GREEN */}
      <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="w-11 h-11 rounded-xl bg-emerald-800 border border-emerald-500/40 flex items-center justify-center shadow-emerald-glow hover:bg-emerald-700 transition"
            >
              <Trees className="w-6 h-6 text-emerald-300" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  KOMUNITAS WARGA, BERITA KARHUTLA & TRANSPARANSI SAVE TREE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 border border-emerald-400/50 text-emerald-100 font-mono text-[10px] font-bold">
                  100% AUDIT TRANSPARAN KE PUSAT
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                GREEN PULSE Community — Media Sosial Bencana & Donasi Save Tree
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => setShowPostForm((v) => !v)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-sm transition"
            >
              <Newspaper className="w-4 h-4" />
              + Tulis Berita / Kabar Warga
            </button>
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white font-semibold flex items-center gap-1.5 transition"
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              Peta WebGIS (/dashboard)
            </Link>
            <Link
              href="/mobile-app"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold flex items-center gap-1.5 transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              Aplikasi HP Warga
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-6 space-y-6">
        {/* Live Notification Banner */}
        {bannerMessage && (
          <div className="rounded-2xl bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between text-xs font-mono shadow-md border border-emerald-700">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{bannerMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="text-emerald-200 hover:text-white underline ml-4 shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 2. RINGKASAN TRANSPARANSI DAMPAK DONASI & SAVE TREE */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                1. Total Donasi Masyarakat
              </span>
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="my-2.5">
              <span className="text-2xl md:text-3xl font-mono font-extrabold text-emerald-800">
                {formatRupiah(totalCollectedRp)}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-600 border-t border-emerald-100 pt-2 flex justify-between">
              <span>Tersalurkan ke Posko Pusat</span>
              <span className="text-emerald-700 font-bold">Terverifikasi</span>
            </div>
          </div>

          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                2. Pohon Gambut Ditanam (Save Tree)
              </span>
              <Trees className="w-5 h-5 text-teal-600" />
            </div>
            <div className="my-2.5 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-mono font-extrabold text-teal-700">
                {totalPlantedTrees.toLocaleString('id-ID')} Pohon
              </span>
            </div>
            <div className="text-xs font-mono text-slate-600 border-t border-emerald-100 pt-2">
              Belangeran, Ramin, Jelutung & Sagu
            </div>
          </div>

          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                3. Kontributor & Relawan Aktif
              </span>
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div className="my-2.5">
              <span className="text-2xl md:text-3xl font-mono font-extrabold text-amber-700">
                {totalDonors.toLocaleString('id-ID')} Warga
              </span>
            </div>
            <div className="text-xs font-mono text-slate-600 border-t border-emerald-100 pt-2">
              Sumatera, Kalimantan & Seluruh Indonesia
            </div>
          </div>

          <div className="eco-card rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-900">
                4. Status Audit & Laporan Pusat
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="my-2.5">
              <span className="text-2xl md:text-3xl font-mono font-extrabold text-emerald-900">
                100% Transparan
              </span>
            </div>
            <div className="text-xs font-mono text-emerald-800 border-t border-emerald-200 pt-2 font-semibold">
              Wajib Laporan Foto & Rincian Realisasi
            </div>
          </div>
        </section>

        {/* 3. FORM TULIS BERITA / KABAR BENCANA TERKINI (JIKA TOMBOL DIKLIK) */}
        {showPostForm && (
          <section className="eco-card rounded-3xl p-6 border-2 border-emerald-400 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Publikasikan Berita Bencana Terkini / Aksi Save Tree Warga
                </h2>
                <p className="text-xs text-slate-600">
                  Bagikan kondisi lapangan, kegiatan pemadaman, atau aksi penanaman pohon gambut di daerah Anda
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Penulis / Komunitas
                  </label>
                  <input
                    type="text"
                    required
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Peran Kontributor
                  </label>
                  <select
                    value={postRole}
                    onChange={(e) => setPostRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-emerald-300 font-semibold text-slate-800"
                  >
                    <option value="WARGA_LOKAL">Warga Lokal / Komunitas</option>
                    <option value="RELAWAN_MPA">Relawan MPA Desa</option>
                    <option value="PETUGAS_BPBD_BRGM">Petugas Posko BPBD / BRGM</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Wilayah Pulau
                  </label>
                  <select
                    value={postIsland}
                    onChange={(e) => setPostIsland(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-emerald-300 font-semibold text-slate-800"
                  >
                    <option value="KALIMANTAN">Kalimantan (Kalteng/Kalbar/Kalsel)</option>
                    <option value="SUMATERA">Sumatera (Riau/Sumsel/Jambi)</option>
                    <option value="NASIONAL">Nasional</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kategori Berita
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-emerald-300 font-semibold text-slate-800"
                  >
                    <option value="BERITA_BENCANA_TERKINI">Berita Bencana Terkini</option>
                    <option value="AKSI_SAVE_TREE">Aksi Tanam Pohon (Save Tree)</option>
                    <option value="PERINGATAN_KOMUNITAS">Peringatan Dini Warga</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Judul Berita / Kabar Lapangan
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Contoh: Warga Desa Jabiren Bersama MPA Berhasil Padamkan Titik Asap..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Lokasi Spesifik (Desa / Kabupaten / Provinsi)
                  </label>
                  <input
                    type="text"
                    required
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Isi Berita / Kronologi & Dampak di Lapangan
                </label>
                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Tuliskan informasi lengkap kondisi terkini, kebutuhan relawan, atau hasil kegiatan..."
                  className="w-full p-3.5 rounded-xl bg-white border border-emerald-300 text-slate-800 leading-relaxed resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="font-semibold text-slate-700">
                    Unggah Foto Dokumentasi:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold flex items-center gap-2 shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                  Publikasikan Berita ke Komunitas
                </button>
              </div>
            </form>
          </section>
        )}

        {/* 4. MAIN 2-COLUMN LAYOUT: SOCIAL DISASTER NEWS FEED (LEFT) & TRANSPARENT DONATION CAMPAIGNS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLUMNS: MEDIA SOSIAL BERITA BENCANA & LAPORAN HASIL TERLAKSANA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="eco-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-700" />
                  Lini Masa Komunitas & Berita Pertanggungjawaban Donasi
                </h2>
                <p className="text-xs text-slate-600">
                  Update langsung dari warga terdampak, relawan MPA, dan laporan realisasi bantuan dari Posko Pusat
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {[
                  { id: 'ALL', label: 'Semua Berita' },
                  {
                    id: 'LAPORAN_HASIL_DONASI',
                    label: '✅ Laporan Dana Terlaksana',
                  },
                  { id: 'BERITA_BENCANA_TERKINI', label: '🔥 Kabar Karhutla' },
                  { id: 'AKSI_SAVE_TREE', label: '🌱 Aksi Save Tree' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      selectedCategory === tab.id
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Media Post Cards */}
            <div className="space-y-5">
              {filteredPosts.map((post) => {
                const isAuditReport =
                  post.category === 'LAPORAN_HASIL_DONASI';

                return (
                  <article
                    key={post.id}
                    className={`rounded-3xl p-5 md:p-6 space-y-4 transition ${
                      isAuditReport
                        ? 'bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/60 border-2 border-emerald-400 shadow-md'
                        : 'eco-card'
                    }`}
                  >
                    {/* Post Author & Verification Badge */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                            isAuditReport
                              ? 'bg-emerald-700'
                              : post.authorRole === 'RELAWAN_MPA'
                              ? 'bg-amber-600'
                              : 'bg-teal-700'
                          }`}
                        >
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-emerald-950">
                              {post.authorName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-[10px] font-bold">
                              {post.authorRole.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-emerald-800 font-medium">
                              <MapPin className="w-3 h-3" />
                              {post.locationTag}
                            </span>
                            <span>• {post.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
                          isAuditReport
                            ? 'bg-emerald-700 text-white'
                            : post.category === 'BERITA_BENCANA_TERKINI'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-teal-100 text-teal-900 border border-teal-300'
                        }`}
                      >
                        {post.category.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Title & Content */}
                    <div className="space-y-2">
                      <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Audit Transparency Highlight Box (if post is a realization/donation report) */}
                    {(post.disbursedAmountRp ||
                      post.treesPlantedImpact ||
                      post.verifiedAuditCode) && (
                      <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-300 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex flex-wrap items-center gap-4">
                          {post.disbursedAmountRp && (
                            <div>
                              <span className="text-[10px] text-slate-500 block">
                                DANA TERSALURKAN KE LAPANGAN
                              </span>
                              <span className="font-extrabold text-emerald-800 text-sm">
                                {formatRupiah(post.disbursedAmountRp)}
                              </span>
                            </div>
                          )}
                          {post.treesPlantedImpact && (
                            <div>
                              <span className="text-[10px] text-slate-500 block">
                                DAMPAK POHON DITANAM
                              </span>
                              <span className="font-extrabold text-teal-700 text-sm">
                                🌱 {post.treesPlantedImpact.toLocaleString('id-ID')}{' '}
                                Pohon Gambut
                              </span>
                            </div>
                          )}
                        </div>
                        {post.verifiedAuditCode && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            {post.verifiedAuditCode}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Post Image */}
                    {post.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-emerald-200 max-h-72 bg-slate-100">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Social Actions (Like & Comment Count) */}
                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-1.5 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                        Dukung & Apresiasi ({post.likes})
                      </button>

                      <span className="text-slate-500 font-mono flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        {post.comments.length} Komentar Warga
                      </span>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-emerald-50/60 rounded-2xl p-3.5 space-y-2.5 border border-emerald-100">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-950">
                              {c.authorName}{' '}
                              <span className="text-[10px] font-mono text-emerald-700 font-normal">
                                ({c.authorRole})
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {c.createdAt}
                            </span>
                          </div>
                          <p className="text-slate-700 mt-1">{c.content}</p>
                        </div>
                      ))}

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Tulis tanggapan, doa, atau konfirmasi warga..."
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Send className="w-3 h-3" />
                          Kirim
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: KAMPANYE DONASI SAVE TREE & ALUR TRANSPARANSI POSKO PUSAT */}
          <div className="lg:col-span-5 space-y-5">
            <div className="eco-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                CROWDFUNDING MITIGASI KARHUTLA & SAVE TREE
              </div>
              <h2 className="text-base md:text-lg font-extrabold text-emerald-950 mt-0.5">
                Program Donasi Warga & Pelacakan Penyaluran ke Pusat
              </h2>
              <p className="text-xs text-slate-600">
                Setiap rupiah donasi warga dicatat otomatis, disalurkan ke Posko Pusat, dan wajib diterbitkan laporan hasil pelaksanaannya ke berita komunitas.
              </p>
            </div>

            {/* Active & Completed Campaign Cards */}
            <div className="space-y-4">
              {campaigns.map((camp) => {
                const percent = Math.min(
                  100,
                  Math.round(
                    (camp.collectedAmountRp / camp.targetAmountRp) * 100,
                  ),
                );

                return (
                  <div
                    key={camp.id}
                    className="eco-card rounded-3xl p-5 space-y-4 border-2 border-emerald-200/90"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                        {camp.campaignCode} • {camp.island}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          camp.status === 'TERLAKSANA_DILAPORKAN'
                            ? 'bg-emerald-700 text-white'
                            : camp.status === 'DISALURKAN_KE_PUSAT'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-teal-100 text-teal-900 border border-teal-300'
                        }`}
                      >
                        {camp.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm md:text-base text-emerald-950 leading-snug">
                        {camp.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-1">
                        📍 {camp.location} • Penyelenggara:{' '}
                        <strong className="text-slate-700">
                          {camp.organizer}
                        </strong>
                      </div>
                    </div>

                    {/* Progress Bar Dana & Pohon */}
                    <div className="space-y-1.5 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-mono font-extrabold text-emerald-900 text-sm">
                          {formatRupiah(camp.collectedAmountRp)}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          dari target {formatRupiah(camp.targetAmountRp)} (
                          {percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-teal-900 pt-1">
                        <span>
                          🌱 Pohon Ditanam:{' '}
                          <strong>
                            {camp.plantedTrees.toLocaleString('id-ID')} /{' '}
                            {camp.targetTrees.toLocaleString('id-ID')}
                          </strong>
                        </span>
                        <span>👥 {camp.donorCount} Donatur</span>
                      </div>
                    </div>

                    {/* 4-Stage Transparency Pipeline Tracker */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono font-bold text-slate-700">
                        Alur Transparansi Penyaluran Bantuan ke Pusat:
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                        {[
                          { step: 1, label: '1. Donasi Warga' },
                          { step: 2, label: '2. Posko Pusat' },
                          { step: 3, label: '3. Salur/Tanam' },
                          { step: 4, label: '4. Berita Hasil' },
                        ].map((s) => (
                          <div
                            key={s.step}
                            className={`py-1.5 px-1 rounded-lg border font-bold ${
                              camp.transparencyStage >= s.step
                                ? 'bg-emerald-700 border-emerald-800 text-white'
                                : 'bg-slate-100 border-slate-200 text-slate-400'
                            }`}
                          >
                            {s.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rincian Alokasi Dana Transparan */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-bold text-slate-700 text-[11px] font-mono">
                        Rincian Alokasi & Realisasi Bantuan:
                      </div>
                      {camp.breakdown.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white border border-emerald-100 text-[11px]"
                        >
                          <span className="text-slate-700">{b.item}</span>
                          <div className="flex items-center gap-2 font-mono shrink-0">
                            <span className="font-bold text-slate-900">
                              {formatRupiah(b.amountRp)}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                b.status === 'TERSALURKAN'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.status === 'TERSALURKAN'
                                ? 'TERSALURKAN'
                                : 'PROSES'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Impact Report Summary Box */}
                    {camp.impactReportSummary && (
                      <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-[11px] text-teal-950 space-y-0.5">
                        <div className="font-mono font-bold text-teal-800 flex items-center gap-1">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Laporan Realisasi Posko ({camp.impactReportDate}):
                        </div>
                        <p className="leading-relaxed">
                          {camp.impactReportSummary}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons: Donate OR Publish Realization Report to Community Feed */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveCampaign(camp)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <HeartHandshake className="w-4 h-4 text-emerald-300" />
                        Donasi & Tanam Pohon
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReportCampaign(camp);
                          setReportSummaryInput(
                            `Penyaluran tahap terbaru kampanye "${camp.title}" telah selesai dilaksanakan di ${camp.location}. Seluruh logistik pompa pemadam dan bibit pohon gambut telah diterima oleh Regu MPA & ditanam bersama warga.`,
                          );
                        }}
                        className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <FileCheck2 className="w-4 h-4 text-amber-700" />
                        Terbitkan Laporan Hasil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BUKU BESAR TRANSPARANSI DONASI PUBLIK (PUBLIC LEDGER) */}
            <div className="eco-card rounded-3xl p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-extrabold text-sm text-emerald-950">
                    Buku Besar Transparansi Donasi Warga (Live Ledger)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  Audit Terbuka
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-emerald-900 text-[11px]">
                        {tx.txCode}
                      </span>
                      <span className="font-extrabold text-emerald-700">
                        {formatRupiah(tx.amountRp)} (+{tx.treesSponsored} Pohon)
                      </span>
                    </div>
                    <div className="font-bold text-slate-900">
                      {tx.donorName}
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      &ldquo;{tx.message}&rdquo;
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 flex justify-between pt-1">
                      <span>{tx.paymentMethod}</span>
                      <span>{tx.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: FORM DONASI TRANSPARAN & ADOPSI POHON (SAVE TREE) */}
      {activeCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-emerald-400 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                  DONASI TRANSPARAN KE POSKO PUSAT
                </span>
                <h3 className="text-base font-extrabold text-emerald-950 leading-snug">
                  {activeCampaign.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCampaign(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Pilih Paket Kontribusi Donasi & Adopsi Pohon Gambut:
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  {[
                    { amount: 50000, label: 'Rp 50rb (2 Pohon)' },
                    { amount: 150000, label: 'Rp 150rb (7 Pohon)' },
                    { amount: 500000, label: 'Rp 500rb (25 Pohon)' },
                  ].map((pkg) => (
                    <button
                      key={pkg.amount}
                      type="button"
                      onClick={() => setDonationAmount(pkg.amount)}
                      className={`py-2 px-2 rounded-xl border font-bold text-center transition ${
                        donationAmount === pkg.amount
                          ? 'bg-emerald-800 border-emerald-900 text-white'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      {pkg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nominal Donasi (Rp)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={10000}
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-300 font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Metode Penyaluran Pusat
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-300 font-semibold text-slate-800"
                  >
                    <option value="QRIS Transparan Posko Pusat">
                      QRIS Transparan Posko Pusat
                    </option>
                    <option value="Virtual Account Bank Nasional">
                      VA Bank Nasional (Audit BRGM)
                    </option>
                    <option value="Dana Komunitas Save Tree">
                      Dana Komunitas Save Tree
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Donatur / Komunitas (Kosongkan bila Hamba Allah)
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Contoh: Andika Pratama (Relawan Hijau)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-300 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pesan Doa & Dukungan untuk Relawan / Hutan Gambut
                </label>
                <textarea
                  rows={2}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-emerald-50/50 border border-emerald-300 text-slate-800 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-950">
                🌳 Estimasi Dampak: Donasi Anda setara dengan penanaman{' '}
                <strong>
                  {Math.max(1, Math.floor((Number(donationAmount) || 0) / 20000))}{' '}
                  Bibit Pohon Gambut
                </strong>{' '}
                & dukungan logistik pemadaman yang tercatat di Buku Besar Publik.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Kirim Donasi & Catat di Transparansi Pusat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TERBITKAN LAPORAN HASIL TERLAKSANA -> OTOMATIS JADI BERITA KOMUNITAS */}
      {reportCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-amber-400 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                  WORKFLOW PERTANGGUNGJAWABAN POSKO PUSAT KE KOMUNITAS
                </span>
                <h3 className="text-base font-extrabold text-emerald-950">
                  Terbitkan Laporan Hasil Pelaksanaan & Berita Komunitas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportCampaign(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishImpactReport} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                Kampanye: <strong>{reportCampaign.title}</strong>
                <br />
                Total Dana Disalurkan:{' '}
                <strong className="font-mono">
                  {formatRupiah(reportCampaign.collectedAmountRp)}
                </strong>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tambahan Bibit Pohon yang Selesai Ditanam pada Tahap Ini
                </label>
                <input
                  type="number"
                  min={0}
                  value={reportTreesInput}
                  onChange={(e) => setReportTreesInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ringkasan Laporan Hasil Pelaksanaan di Lapangan
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportSummaryInput}
                  onChange={(e) => setReportSummaryInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-emerald-300 text-slate-800 leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-sm"
              >
                <FileCheck2 className="w-4 h-4" />
                Sahkan Laporan & Terbitkan Berita ke Lini Masa Komunitas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
