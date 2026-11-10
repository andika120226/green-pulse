import { z } from 'zod';

// Zod Validation Schema for Citizen Report Form
export const CitizenReportSchema = z.object({
  reporterName: z
    .string()
    .min(3, 'Nama pelapor minimal 3 karakter')
    .max(80, 'Nama pelapor terlalu panjang'),
  reporterPhone: z
    .string()
    .min(9, 'Nomor telepon tidak valid')
    .regex(/^[+0-9\s-]+$/, 'Format nomor telepon hanya boleh angka/+'),
  sector: z.string().min(4, 'Sektor lokasi wajib diisi'),
  description: z
    .string()
    .min(10, 'Deskripsi visual kepulan asap/api minimal 10 karakter'),
  latitude: z.number().min(-11).max(6),
  longitude: z.number().min(95).max(141),
  gpsAccuracyMeters: z.number().min(0.5).max(100),
  severity: z.enum(['ASAP_TIPIS', 'ASAP_PEKAT_GAMBUT', 'API_TERBUKA']),
  isMockLocation: z.boolean().refine((val) => val === false, {
    message:
      'Laporan ditolak! Sistem mendeteksi penggunaan Fake GPS / Mock Location.',
  }),
  exifVerified: z.boolean(),
});

export type CitizenReportInput = z.infer<typeof CitizenReportSchema>;

export interface SensorNodeData {
  id: string;
  nodeCode: string;
  name: string;
  sector: string;
  district: string;
  regency: string;
  province: string;
  island: 'SUMATERA' | 'KALIMANTAN';
  latitude: number;
  longitude: number;
  peatDepthCm: number;
  batteryPercent: number;
  rssiDbm: number;
  snrDb: number;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  currentRiskStatus: 'AMAN' | 'WASPADA' | 'SIAGA' | 'KRITIS';
  lastWaterLevelTMA: number;
  lastSoilMoisture10cm: number;
  lastSoilMoisture40cm: number;
  lastSurfaceTemp: number;
  lastAirTemp: number;
  lastAirHumidity: number;
  lastPm25: number;
  consecutiveDryDays: number;
  predictedRiskScore: number;
  lastSeenAt: string;
}

export interface CitizenReportData {
  id: string;
  reportCode: string;
  reporterName: string;
  reporterPhone: string;
  sector: string;
  description: string;
  latitude: number;
  longitude: number;
  gpsAccuracyMeters: number;
  photoUrl: string;
  exifVerified: boolean;
  isMockLocation: boolean;
  severity: 'ASAP_TIPIS' | 'ASAP_PEKAT_GAMBUT' | 'API_TERBUKA';
  status: 'PENDING' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED' | 'REJECTED';
  clusterGroupId: string;
  dispatchedTeam?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  communityConfirmations: number;
}

export interface CommunityProposalData {
  id: string;
  proposalCode: string;
  proposerName: string;
  villageName: string;
  infrastructureType: 'SEKAT_KANAL' | 'SUMUR_BOR' | 'EMBUNG_AIR';
  latitude: number;
  longitude: number;
  urgency: 'TINGGI' | 'SEDANG' | 'RENCANA_DESA';
  reason: string;
  votes: number;
  status: 'DIUSULKAN_WARGA' | 'DIKAJI_BRGM' | 'DISETUJUI';
  createdAt: string;
}

export interface PatrolScheduleData {
  id: string;
  teamName: string;
  coordinatorName: string;
  phone: string;
  sectorRoute: string;
  scheduleDate: string;
  shiftTime: 'PAGI (07:00-12:00)' | 'SIANG (12:00-17:00)' | 'SORE/MALAM (17:00-22:00)';
  waterSourceStatus: 'MELIMPAH' | 'MENYUSUT_WASPADA' | 'KERING_KRITIS';
  personnelCount: number;
  equipmentNotes: string;
  createdAt: string;
}

export interface TimeSeriesPoint {
  day: string;
  date: string;
  waterLevelTMA: number;
  soilMoisture10cm: number;
  soilMoisture40cm: number;
  surfaceTemp: number;
  pm25: number;
  riskStatus: 'AMAN' | 'WASPADA' | 'SIAGA' | 'KRITIS';
  predictedRiskScore: number;
  brgmLimit: number;
}

export const SAMPLE_FIELD_PHOTOS = [
  {
    label: 'Asap Pekat Sekat Kanal Gambut',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Bara Api Semak Pakis Kering',
    url: 'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Asap Tipis Kebun Gambut Warga',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
];

// 8 Stasiun AIoT Titik Rawan Karhutla di SUMATERA & KALIMANTAN
export const INITIAL_NODES: SensorNodeData[] = [
  // === WILAYAH KALIMANTAN ===
  {
    id: 'node-kal-01',
    nodeCode: 'GP-KAL-01',
    name: 'Stasiun KHG Kahayan–Sebangau (Eks-PLG Blok C)',
    sector: 'KHG Sebangau - Pulang Pisau, Kalimantan Tengah',
    district: 'Jabiren Raya',
    regency: 'Pulang Pisau',
    province: 'Kalimantan Tengah',
    island: 'KALIMANTAN',
    latitude: -2.385,
    longitude: 114.082,
    peatDepthCm: 640,
    batteryPercent: 91.2,
    rssiDbm: -72,
    snrDb: 9.5,
    status: 'ONLINE',
    currentRiskStatus: 'KRITIS',
    lastWaterLevelTMA: -68.4,
    lastSoilMoisture10cm: 26.2,
    lastSoilMoisture40cm: 37.5,
    lastSurfaceTemp: 39.4,
    lastAirTemp: 36.5,
    lastAirHumidity: 44.0,
    lastPm25: 192.0,
    consecutiveDryDays: 16,
    predictedRiskScore: 96.4,
    lastSeenAt: 'Baru saja (Live)',
  },
  {
    id: 'node-kal-02',
    nodeCode: 'GP-KAL-02',
    name: 'Stasiun KHG Sungai Kapuas–Terentang',
    sector: 'KHG Kubu Raya - Rasau Jaya, Kalimantan Barat',
    district: 'Rasau Jaya',
    regency: 'Kubu Raya',
    province: 'Kalimantan Barat',
    island: 'KALIMANTAN',
    latitude: -0.245,
    longitude: 109.482,
    peatDepthCm: 530,
    batteryPercent: 88.5,
    rssiDbm: -75,
    snrDb: 8.9,
    status: 'ONLINE',
    currentRiskStatus: 'KRITIS',
    lastWaterLevelTMA: -63.0,
    lastSoilMoisture10cm: 29.5,
    lastSoilMoisture40cm: 40.8,
    lastSurfaceTemp: 38.1,
    lastAirTemp: 35.4,
    lastAirHumidity: 47.5,
    lastPm25: 164.0,
    consecutiveDryDays: 14,
    predictedRiskScore: 92.5,
    lastSeenAt: '5 detik lalu',
  },
  {
    id: 'node-kal-03',
    nodeCode: 'GP-KAL-03',
    name: 'Stasiun Koridor Gambut Liang Anggang–Landasan Ulin',
    sector: 'KHG Banjarbaru - Kalimantan Selatan',
    district: 'Liang Anggang',
    regency: 'Banjarbaru',
    province: 'Kalimantan Selatan',
    island: 'KALIMANTAN',
    latitude: -3.442,
    longitude: 114.765,
    peatDepthCm: 420,
    batteryPercent: 94.0,
    rssiDbm: -78,
    snrDb: 8.4,
    status: 'ONLINE',
    currentRiskStatus: 'SIAGA',
    lastWaterLevelTMA: -51.5,
    lastSoilMoisture10cm: 35.8,
    lastSoilMoisture40cm: 46.2,
    lastSurfaceTemp: 35.8,
    lastAirTemp: 34.0,
    lastAirHumidity: 52.0,
    lastPm25: 112.0,
    consecutiveDryDays: 11,
    predictedRiskScore: 79.8,
    lastSeenAt: '10 detik lalu',
  },
  {
    id: 'node-kal-04',
    nodeCode: 'GP-KAL-04',
    name: 'Stasiun KHG Mentaya–Seruyan',
    sector: 'KHG Sampit - Kotawaringin Timur, Kalimantan Tengah',
    district: 'Mentawa Baru Ketapang',
    regency: 'Kotawaringin Timur',
    province: 'Kalimantan Tengah',
    island: 'KALIMANTAN',
    latitude: -2.532,
    longitude: 112.951,
    peatDepthCm: 490,
    batteryPercent: 86.0,
    rssiDbm: -80,
    snrDb: 7.9,
    status: 'WARNING',
    currentRiskStatus: 'WASPADA',
    lastWaterLevelTMA: -34.2,
    lastSoilMoisture10cm: 45.1,
    lastSoilMoisture40cm: 56.4,
    lastSurfaceTemp: 33.1,
    lastAirTemp: 31.8,
    lastAirHumidity: 62.0,
    lastPm25: 64.0,
    consecutiveDryDays: 7,
    predictedRiskScore: 52.1,
    lastSeenAt: '18 detik lalu',
  },

  // === WILAYAH SUMATERA ===
  {
    id: 'node-sum-01',
    nodeCode: 'GP-SUM-01',
    name: 'Stasiun KHG Pulau Padang Utara',
    sector: 'KHG Pulau Padang - Kepulauan Meranti, Riau',
    district: 'Merbau',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
    island: 'SUMATERA',
    latitude: 0.2584,
    longitude: 102.4033,
    peatDepthCm: 520,
    batteryPercent: 89.4,
    rssiDbm: -74,
    snrDb: 9.2,
    status: 'ONLINE',
    currentRiskStatus: 'KRITIS',
    lastWaterLevelTMA: -64.5,
    lastSoilMoisture10cm: 28.4,
    lastSoilMoisture40cm: 39.2,
    lastSurfaceTemp: 38.6,
    lastAirTemp: 35.8,
    lastAirHumidity: 46.0,
    lastPm25: 168.0,
    consecutiveDryDays: 14,
    predictedRiskScore: 94.2,
    lastSeenAt: 'Baru saja (Live)',
  },
  {
    id: 'node-sum-02',
    nodeCode: 'GP-SUM-02',
    name: 'Stasiun KHG Sungai Sugihan–Sungai Lumpur',
    sector: 'KHG Ogan Komering Ilir (OKI) - Sumatera Selatan',
    district: 'Pampangan',
    regency: 'Ogan Komering Ilir',
    province: 'Sumatera Selatan',
    island: 'SUMATERA',
    latitude: -2.9845,
    longitude: 105.321,
    peatDepthCm: 580,
    batteryPercent: 90.8,
    rssiDbm: -76,
    snrDb: 8.7,
    status: 'ONLINE',
    currentRiskStatus: 'KRITIS',
    lastWaterLevelTMA: -66.2,
    lastSoilMoisture10cm: 27.1,
    lastSoilMoisture40cm: 38.0,
    lastSurfaceTemp: 38.9,
    lastAirTemp: 36.1,
    lastAirHumidity: 45.0,
    lastPm25: 184.0,
    consecutiveDryDays: 15,
    predictedRiskScore: 95.3,
    lastSeenAt: '6 detik lalu',
  },
  {
    id: 'node-sum-03',
    nodeCode: 'GP-SUM-03',
    name: 'Stasiun KHG Londerang–Sungai Kumpeh',
    sector: 'KHG Muaro Jambi - Provinsi Jambi',
    district: 'Kumpeh',
    regency: 'Muaro Jambi',
    province: 'Jambi',
    island: 'SUMATERA',
    latitude: -1.521,
    longitude: 103.894,
    peatDepthCm: 510,
    batteryPercent: 93.1,
    rssiDbm: -79,
    snrDb: 8.1,
    status: 'ONLINE',
    currentRiskStatus: 'SIAGA',
    lastWaterLevelTMA: -49.8,
    lastSoilMoisture10cm: 36.2,
    lastSoilMoisture40cm: 47.9,
    lastSurfaceTemp: 35.4,
    lastAirTemp: 33.6,
    lastAirHumidity: 54.0,
    lastPm25: 105.0,
    consecutiveDryDays: 10,
    predictedRiskScore: 78.4,
    lastSeenAt: '12 detik lalu',
  },
  {
    id: 'node-sum-04',
    nodeCode: 'GP-SUM-04',
    name: 'Stasiun Restorasi Kubah Gambut Sungai Tohor',
    sector: 'KHG Tebing Tinggi - Restorasi BRGM, Riau',
    district: 'Tebing Tinggi Timur',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
    island: 'SUMATERA',
    latitude: 0.8745,
    longitude: 102.7654,
    peatDepthCm: 610,
    batteryPercent: 96.8,
    rssiDbm: -68,
    snrDb: 10.5,
    status: 'ONLINE',
    currentRiskStatus: 'AMAN',
    lastWaterLevelTMA: -14.8,
    lastSoilMoisture10cm: 68.5,
    lastSoilMoisture40cm: 78.2,
    lastSurfaceTemp: 28.9,
    lastAirTemp: 29.7,
    lastAirHumidity: 79.0,
    lastPm25: 22.0,
    consecutiveDryDays: 2,
    predictedRiskScore: 11.4,
    lastSeenAt: '19 detik lalu',
  },
];

// Laporan Warga (Crowdsourcing) Tersebar di Kalimantan & Sumatera
export const INITIAL_REPORTS: CitizenReportData[] = [
  {
    id: 'rep-001',
    reportCode: 'GP-REP-2026-001',
    reporterName: 'Hendra Kusuma (MPA Desa Jabiren, Kalteng)',
    reporterPhone: '+6281349002188',
    sector: 'Sektor Gambut Jabiren Raya - Pulang Pisau, Kalimantan Tengah',
    description:
      'Kepulan asap putih tebal berbau gambut menyengat muncul dari bawah permukaan dekat kanal Eks-PLG Blok C yang mengering.',
    latitude: -2.379,
    longitude: 114.088,
    gpsAccuracyMeters: 2.9,
    photoUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'API_TERBUKA',
    status: 'DISPATCHED',
    clusterGroupId: 'CLUSTER-KALTENG-01',
    dispatchedTeam: 'Manggala Agni Daops Kalimantan I (Palangka Raya)',
    verifiedBy: 'Posko Satgas Karhutla Kalteng',
    verifiedAt: '10 Nov 2026, 06:50 WIB',
    createdAt: '10 Nov 2026, 06:42 WIB',
    communityConfirmations: 18,
  },
  {
    id: 'rep-002',
    reportCode: 'GP-REP-2026-002',
    reporterName: 'Ahmad Syafii (Ketua MPA Pulau Padang, Riau)',
    reporterPhone: '+6285271993812',
    sector: 'Sektor Desa Pulau Padang Utara - Kepulauan Meranti, Riau',
    description:
      'Asap pekat gambut terlihat mengepul di sekat kanal kering Blok A1, jarak 150 meter dari kebun sagu warga.',
    latitude: 0.2584,
    longitude: 102.4033,
    gpsAccuracyMeters: 3.2,
    photoUrl:
      'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'ASAP_PEKAT_GAMBUT',
    status: 'DISPATCHED',
    clusterGroupId: 'CLUSTER-RIAU-01',
    dispatchedTeam: 'Manggala Agni Daops Sumatera IV & MPA Merbau',
    verifiedBy: 'Komandan Posko BPBD Riau',
    verifiedAt: '10 Nov 2026, 06:58 WIB',
    createdAt: '10 Nov 2026, 06:54 WIB',
    communityConfirmations: 14,
  },
  {
    id: 'rep-003',
    reportCode: 'GP-REP-2026-003',
    reporterName: 'Dedi Pratama (Relawan Rasau Jaya, Kalbar)',
    reporterPhone: '+6281256774310',
    sector: 'Sektor Gambut Rasau Jaya - Kubu Raya, Kalimantan Barat',
    description:
      'Bara api bawah permukaan gambut mulai merambat ke semak pakis kering di koridor KHG Kapuas–Terentang.',
    latitude: -0.239,
    longitude: 109.489,
    gpsAccuracyMeters: 3.5,
    photoUrl:
      'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'API_TERBUKA',
    status: 'VERIFIED',
    clusterGroupId: 'CLUSTER-KALBAR-01',
    dispatchedTeam: 'Manggala Agni Daops Singkawang/Pontianak',
    verifiedBy: 'BPBD Kalimantan Barat',
    verifiedAt: '10 Nov 2026, 07:02 WIB',
    createdAt: '10 Nov 2026, 06:58 WIB',
    communityConfirmations: 11,
  },
  {
    id: 'rep-004',
    reportCode: 'GP-REP-2026-004',
    reporterName: 'Ruslan Effendi (Warga Pampangan OKI, Sumsel)',
    reporterPhone: '+6282178331044',
    sector: 'Sektor KHG Sungai Sugihan - Ogan Komering Ilir, Sumatera Selatan',
    description:
      'Kepulan asap gambut membumbung di lahan rawa gambut kering Pampangan, jarak pandang jalan lintas mulai menurun.',
    latitude: -2.978,
    longitude: 105.329,
    gpsAccuracyMeters: 2.8,
    photoUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'ASAP_PEKAT_GAMBUT',
    status: 'PENDING',
    clusterGroupId: 'CLUSTER-SUMSEL-01',
    dispatchedTeam: null,
    verifiedBy: null,
    verifiedAt: null,
    createdAt: '10 Nov 2026, 07:08 WIB',
    communityConfirmations: 9,
  },
  {
    id: 'rep-005',
    reportCode: 'GP-REP-2026-005',
    reporterName: 'Siti Rahmah (Relawan Liang Anggang, Kalsel)',
    reporterPhone: '+6285348112290',
    sector: 'Sektor Gambut Liang Anggang - Banjarbaru, Kalimantan Selatan',
    description:
      'Asap tipis mulai terlihat di lahan gambut kering koridor bandara Syamsudin Noor, warga sekitar bersiaga dengan pompa desa.',
    latitude: -3.436,
    longitude: 114.772,
    gpsAccuracyMeters: 3.1,
    photoUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'ASAP_TIPIS',
    status: 'PENDING',
    clusterGroupId: 'CLUSTER-KALSEL-01',
    dispatchedTeam: null,
    verifiedBy: null,
    verifiedAt: null,
    createdAt: '10 Nov 2026, 07:12 WIB',
    communityConfirmations: 6,
  },
];

// Usulan Sekat Kanal, Sumur Bor & Embung Air di Kalimantan & Sumatera
export const INITIAL_PROPOSALS: CommunityProposalData[] = [
  {
    id: 'prop-01',
    proposalCode: 'USUL-BRGM-01',
    proposerName: 'MPA Jabiren & Kelompok Tani Sebangau',
    villageName: 'Desa Jabiren, Kab. Pulang Pisau (Kalimantan Tengah)',
    infrastructureType: 'SEKAT_KANAL',
    latitude: -2.412,
    longitude: 114.115,
    urgency: 'TINGGI',
    reason:
      'Saluran kanal primer Eks-PLG menguras air kubah gambut terlalu cepat saat kemarau. Warga mengusulkan sekat kanal beton bertingkat.',
    votes: 34,
    status: 'DISETUJUI',
    createdAt: '08 Nov 2026',
  },
  {
    id: 'prop-02',
    proposalCode: 'USUL-BRGM-02',
    proposerName: 'Kelompok Tani Gambut Pulau Padang',
    villageName: 'Desa Pulau Padang, Kab. Kepulauan Meranti (Riau)',
    infrastructureType: 'SUMUR_BOR',
    latitude: 0.2645,
    longitude: 102.4112,
    urgency: 'TINGGI',
    reason:
      'Jarak sumber air ke blok rawan terbakar mencapai 1,4 km. Warga mengusulkan 3 titik sumur bor artesis untuk suplai pompa Manggala Agni.',
    votes: 28,
    status: 'DISETUJUI',
    createdAt: '09 Nov 2026',
  },
  {
    id: 'prop-03',
    proposalCode: 'USUL-BRGM-03',
    proposerName: 'Forum Masyarakat Peduli Api Kubu Raya',
    villageName: 'Desa Rasau Jaya Umum, Kab. Kubu Raya (Kalimantan Barat)',
    infrastructureType: 'EMBUNG_AIR',
    latitude: -0.261,
    longitude: 109.505,
    urgency: 'TINGGI',
    reason:
      'Pembangunan embung penampungan air hujan di perbatasan konsesi dan kebun warga untuk pembasahan gambut (rewetting).',
    votes: 21,
    status: 'DIKAJI_BRGM',
    createdAt: '09 Nov 2026',
  },
  {
    id: 'prop-04',
    proposalCode: 'USUL-BRGM-04',
    proposerName: 'Gapoktan Pampangan Peduli Gambut',
    villageName: 'Kec. Pampangan, Kab. OKI (Sumatera Selatan)',
    infrastructureType: 'SEKAT_KANAL',
    latitude: -3.012,
    longitude: 105.345,
    urgency: 'SEDANG',
    reason:
      'Rehabilitasi 4 titik sekat kanal kayu yang bocor agar muka air tanah (TMA) tetap terjaga di atas ambang -40 cm.',
    votes: 17,
    status: 'DIUSULKAN_WARGA',
    createdAt: '10 Nov 2026',
  },
];

export const INITIAL_PATROLS: PatrolScheduleData[] = [
  {
    id: 'patrol-01',
    teamName: 'Regu MPA Jabiren Raya — Kalimantan Tengah',
    coordinatorName: 'Hendra Kusuma',
    phone: '+6281349002188',
    sectorRoute: 'Koridor Kanal Eks-PLG Blok C s/d Perbatasan Sebangau',
    scheduleDate: '2026-11-10',
    shiftTime: 'SIANG (12:00-17:00)',
    waterSourceStatus: 'KERING_KRITIS',
    personnelCount: 10,
    equipmentNotes: '2 Unit Pompa Tohatsu, 8 Roll Selang, 1 Drone Termal Komunitas',
    createdAt: '10 Nov 2026, 06:30 WIB',
  },
  {
    id: 'patrol-02',
    teamName: 'Regu MPA Desa Pulau Padang — Riau (Sumatera)',
    coordinatorName: 'Ahmad Syafii',
    phone: '+6285271993812',
    sectorRoute: 'Jalur Sekat Kanal Blok A1 s/d Teluk Belitung',
    scheduleDate: '2026-11-10',
    shiftTime: 'SIANG (12:00-17:00)',
    waterSourceStatus: 'KERING_KRITIS',
    personnelCount: 8,
    equipmentNotes: '2 Unit Pompa Jinjing, Alat Ukur TMA Manual, HT Posko',
    createdAt: '10 Nov 2026, 06:45 WIB',
  },
  {
    id: 'patrol-03',
    teamName: 'Relawan Gambut Rasau Jaya — Kalimantan Barat',
    coordinatorName: 'Dedi Pratama',
    phone: '+6281256774310',
    sectorRoute: 'Sektor KHG Kapuas–Terentang & Sumur Bor Desa',
    scheduleDate: '2026-11-11',
    shiftTime: 'PAGI (07:00-12:00)',
    waterSourceStatus: 'MENYUSUT_WASPADA',
    personnelCount: 7,
    equipmentNotes: '1 Pompa Apung, 5 Roll Selang, Motor Patroli Roda Dua',
    createdAt: '10 Nov 2026, 07:10 WIB',
  },
];

export const INITIAL_TIMESERIES: TimeSeriesPoint[] = [
  { day: 'H-13', date: '28 Okt', waterLevelTMA: -16.2, soilMoisture10cm: 66.0, soilMoisture40cm: 75.0, surfaceTemp: 29.1, pm25: 25, riskStatus: 'AMAN', predictedRiskScore: 14.2, brgmLimit: -40 },
  { day: 'H-12', date: '29 Okt', waterLevelTMA: -19.5, soilMoisture10cm: 63.2, soilMoisture40cm: 72.1, surfaceTemp: 29.8, pm25: 28, riskStatus: 'AMAN', predictedRiskScore: 18.5, brgmLimit: -40 },
  { day: 'H-11', date: '30 Okt', waterLevelTMA: -23.8, soilMoisture10cm: 58.5, soilMoisture40cm: 68.4, surfaceTemp: 30.6, pm25: 35, riskStatus: 'WASPADA', predictedRiskScore: 29.0, brgmLimit: -40 },
  { day: 'H-10', date: '31 Okt', waterLevelTMA: -28.4, soilMoisture10cm: 54.1, soilMoisture40cm: 64.0, surfaceTemp: 31.4, pm25: 42, riskStatus: 'WASPADA', predictedRiskScore: 36.8, brgmLimit: -40 },
  { day: 'H-9',  date: '01 Nov', waterLevelTMA: -33.1, soilMoisture10cm: 49.8, soilMoisture40cm: 59.5, surfaceTemp: 32.2, pm25: 49, riskStatus: 'WASPADA', predictedRiskScore: 44.5, brgmLimit: -40 },
  { day: 'H-8',  date: '02 Nov', waterLevelTMA: -38.7, soilMoisture10cm: 45.2, soilMoisture40cm: 55.2, surfaceTemp: 33.1, pm25: 58, riskStatus: 'WASPADA', predictedRiskScore: 53.1, brgmLimit: -40 },
  { day: 'H-7',  date: '03 Nov', waterLevelTMA: -43.2, soilMoisture10cm: 41.6, soilMoisture40cm: 51.0, surfaceTemp: 34.0, pm25: 72, riskStatus: 'SIAGA', predictedRiskScore: 64.0, brgmLimit: -40 },
  { day: 'H-6',  date: '04 Nov', waterLevelTMA: -47.9, soilMoisture10cm: 38.9, soilMoisture40cm: 48.2, surfaceTemp: 34.9, pm25: 86, riskStatus: 'SIAGA', predictedRiskScore: 71.4, brgmLimit: -40 },
  { day: 'H-5',  date: '05 Nov', waterLevelTMA: -52.4, soilMoisture10cm: 36.4, soilMoisture40cm: 45.8, surfaceTemp: 35.6, pm25: 98, riskStatus: 'SIAGA', predictedRiskScore: 78.2, brgmLimit: -40 },
  { day: 'H-4',  date: '06 Nov', waterLevelTMA: -56.8, soilMoisture10cm: 34.2, soilMoisture40cm: 43.5, surfaceTemp: 36.3, pm25: 115, riskStatus: 'SIAGA', predictedRiskScore: 83.9, brgmLimit: -40 },
  { day: 'H-3',  date: '07 Nov', waterLevelTMA: -60.2, soilMoisture10cm: 32.1, soilMoisture40cm: 41.8, surfaceTemp: 37.0, pm25: 132, riskStatus: 'KRITIS', predictedRiskScore: 88.5, brgmLimit: -40 },
  { day: 'H-2',  date: '08 Nov', waterLevelTMA: -61.9, soilMoisture10cm: 30.5, soilMoisture40cm: 40.6, surfaceTemp: 37.6, pm25: 145, riskStatus: 'KRITIS', predictedRiskScore: 91.0, brgmLimit: -40 },
  { day: 'H-1',  date: '09 Nov', waterLevelTMA: -63.4, soilMoisture10cm: 29.2, soilMoisture40cm: 39.8, surfaceTemp: 38.1, pm25: 156, riskStatus: 'KRITIS', predictedRiskScore: 92.8, brgmLimit: -40 },
  { day: 'Hari Ini', date: '10 Nov', waterLevelTMA: -68.4, soilMoisture10cm: 26.2, soilMoisture40cm: 37.5, surfaceTemp: 39.4, pm25: 192, riskStatus: 'KRITIS', predictedRiskScore: 96.4, brgmLimit: -40 },
];

// LocalStorage Keys (v3 ensures fresh Sumatera + Kalimantan dataset loads automatically)
export const STORAGE_KEYS = {
  REPORTS: 'green_pulse_reports_v3_sumkal',
  PROPOSALS: 'green_pulse_proposals_v3_sumkal',
  PATROLS: 'green_pulse_patrols_v3_sumkal',
  COMMUNITY_POSTS: 'green_pulse_community_posts_v1',
  CAMPAIGNS: 'green_pulse_campaigns_v1',
  TRANSACTIONS: 'green_pulse_transactions_v1',
};

export interface CommunityCommentData {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface CommunityPostData {
  id: string;
  authorName: string;
  authorRole: 'WARGA_LOKAL' | 'RELAWAN_MPA' | 'PETUGAS_BPBD_BRGM' | 'TIM_AUDIT_TRANSPARANSI';
  locationTag: string;
  island: 'KALIMANTAN' | 'SUMATERA' | 'NASIONAL';
  category:
    | 'BERITA_BENCANA_TERKINI'
    | 'LAPORAN_HASIL_DONASI'
    | 'AKSI_SAVE_TREE'
    | 'PERINGATAN_KOMUNITAS';
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  treesPlantedImpact?: number;
  disbursedAmountRp?: number;
  linkedCampaignId?: string;
  verifiedAuditCode?: string;
  createdAt: string;
  comments: CommunityCommentData[];
}

export interface DonationBreakdownItem {
  item: string;
  amountRp: number;
  status: 'TERSALURKAN' | 'DALAM_PROSES';
}

export interface DonationCampaignData {
  id: string;
  campaignCode: string;
  title: string;
  location: string;
  island: 'KALIMANTAN' | 'SUMATERA';
  organizer: string;
  targetAmountRp: number;
  collectedAmountRp: number;
  targetTrees: number;
  plantedTrees: number;
  donorCount: number;
  imageUrl: string;
  status: 'PENGGALANGAN_AKTIF' | 'DISALURKAN_KE_PUSAT' | 'TERLAKSANA_DILAPORKAN';
  transparencyStage: 1 | 2 | 3 | 4; // 1: Terkumpul, 2: Diteruskan ke Pusat, 3: Eksekusi Lapangan, 4: Laporan Terbit
  summary: string;
  impactReportSummary?: string;
  impactReportDate?: string;
  breakdown: DonationBreakdownItem[];
}

export interface DonationTransactionData {
  id: string;
  txCode: string;
  donorName: string;
  campaignId: string;
  campaignTitle: string;
  amountRp: number;
  treesSponsored: number;
  message: string;
  paymentMethod: string;
  status: 'TERVERIFIKASI_PUBLIK';
  createdAt: string;
}

export const INITIAL_CAMPAIGNS: DonationCampaignData[] = [
  {
    id: 'camp-01',
    campaignCode: 'DONASI-KALTENG-01',
    title: 'Darurat Pompa Sekat Kanal & Reboisasi 5.000 Pohon Belangeran KHG Sebangau',
    location: 'Kab. Pulang Pisau & Palangka Raya, Kalimantan Tengah',
    island: 'KALIMANTAN',
    organizer: 'Posko Gabungan BPBD Kalteng, BRGM & MPA Jabiren Raya',
    targetAmountRp: 85000000,
    collectedAmountRp: 68450000,
    targetTrees: 5000,
    plantedTrees: 3850,
    donorCount: 342,
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    status: 'DISALURKAN_KE_PUSAT',
    transparencyStage: 3,
    summary:
      'Bantuan pengadaan selang pemadam tekanan tinggi, operasional pompa pembasahan kubah gambut Eks-PLG Blok C, serta penanaman kembali pohon endemik Belangeran & Jelutung.',
    impactReportSummary:
      'Tahap I & II (Rp 52.000.000) telah diteruskan ke Posko Pusat Satgas Kalteng: 2 unit pompa Tohatsu dan 3.850 bibit pohon Belangeran telah ditanam bersama warga Desa Jabiren.',
    impactReportDate: '10 Nov 2026',
    breakdown: [
      { item: '2 Unit Pompa Tekanan Tinggi & 10 Roll Selang Posko MPA', amountRp: 32000000, status: 'TERSALURKAN' },
      { item: '3.850 Bibit Pohon Gambut Belangeran & Pupuk Organik', amountRp: 20000000, status: 'TERSALURKAN' },
      { item: 'Logistik Masker N95, Oksigen & Nutrisi Regu Pemadam', amountRp: 16450000, status: 'DALAM_PROSES' },
    ],
  },
  {
    id: 'camp-02',
    campaignCode: 'DONASI-RIAU-02',
    title: 'Gerakan 4.000 Pohon Ramin (Save Tree) & Sumur Bor Desa Pulau Padang',
    location: 'Kab. Kepulauan Meranti, Provinsi Riau (Sumatera)',
    island: 'SUMATERA',
    organizer: 'Masyarakat Peduli Api (MPA) Merbau & KPH Riau',
    targetAmountRp: 55000000,
    collectedAmountRp: 55000000,
    targetTrees: 4000,
    plantedTrees: 4000,
    donorCount: 289,
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    status: 'TERLAKSANA_DILAPORKAN',
    transparencyStage: 4,
    summary:
      'Pembangunan 3 titik sumur bor artesis di koridor rawan terbakar Blok A1 dan penanaman 4.000 bibit pohon Ramin & Sagu untuk menjaga kelembaban tanah gambut.',
    impactReportSummary:
      '100% TERLAKSANA & TERSALURKAN: 3 titik sumur bor telah aktif mengalirkan air ke sekat kanal, dan 4.000 bibit pohon telah selesai ditanam oleh 65 relawan warga.',
    impactReportDate: '09 Nov 2026',
    breakdown: [
      { item: 'Pengeboran 3 Titik Sumur Bor Artesis + Pipa Hydrant Gambut', amountRp: 30000000, status: 'TERSALURKAN' },
      { item: 'Penanaman 4.000 Bibit Pohon Ramin & Sagu (Save Tree)', amountRp: 18000000, status: 'TERSALURKAN' },
      { item: 'Peralatan APD & Sepatu Boot Tahan Panas Relawan MPA', amountRp: 7000000, status: 'TERSALURKAN' },
    ],
  },
  {
    id: 'camp-03',
    campaignCode: 'DONASI-SUMSEL-KALBAR-03',
    title: 'Tanggap Asap & Restorasi Hutan Gambut OKI (Sumsel) & Kubu Raya (Kalbar)',
    location: 'Pampangan OKI (Sumsel) & Rasau Jaya (Kalbar)',
    island: 'SUMATERA',
    organizer: 'Koalisi Komunitas Save Tree Nusantara & BPBD Daerah',
    targetAmountRp: 70000000,
    collectedAmountRp: 43800000,
    targetTrees: 3500,
    plantedTrees: 1900,
    donorCount: 215,
    imageUrl:
      'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?auto=format&fit=crop&w=900&q=80',
    status: 'PENGGALANGAN_AKTIF',
    transparencyStage: 2,
    summary:
      'Pengiriman paket kesehatan warga terdampak kabut asap (masker N95, tabung oksigen portabel di puskesmas desa) serta restorasi lahan bekas terbakar.',
    impactReportSummary:
      'Dana tahap awal Rp 30.000.000 telah diverifikasi oleh Posko Pusat dan sedang didistribusikan dalam bentuk 2.500 masker N95 serta 1.900 bibit pohon Jelutung.',
    impactReportDate: '10 Nov 2026',
    breakdown: [
      { item: '2.500 Masker N95 & 15 Unit Air Purifier Posko Kesehatan Anak', amountRp: 18000000, status: 'TERSALURKAN' },
      { item: '1.900 Bibit Pohon Jelutung Rawa & Perawatan Lahan', amountRp: 12000000, status: 'TERSALURKAN' },
      { item: 'Operasional Patroli Sekat Kanal Kemarau', amountRp: 13800000, status: 'DALAM_PROSES' },
    ],
  },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPostData[] = [
  {
    id: 'post-01',
    authorName: 'Tim Audit & Transparansi Pusat GREEN PULSE',
    authorRole: 'TIM_AUDIT_TRANSPARANSI',
    locationTag: 'Desa Pulau Padang, Kepulauan Meranti — Riau (Sumatera)',
    island: 'SUMATERA',
    category: 'LAPORAN_HASIL_DONASI',
    title: '[LAPORAN TERLAKSANA 100%] 3 Sumur Bor Aktif & 4.000 Pohon Ramin Telah Ditanam Warga!',
    content:
      'Alhamdulillah, donasi masyarakat sebesar Rp 55.000.000 pada kampanye DONASI-RIAU-02 telah 100% tersalurkan melalui Posko Pusat ke MPA Merbau. Sebanyak 3 titik sumur bor artesis kini membasahi sekat kanal Blok A1 sehingga TMA naik kembali dari -64 cm menuju -38 cm, disertai penanaman 4.000 bibit pohon Ramin & Sagu bersama 65 warga lokal.',
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    likes: 128,
    treesPlantedImpact: 4000,
    disbursedAmountRp: 55000000,
    linkedCampaignId: 'camp-02',
    verifiedAuditCode: 'AUDIT-BRGM-2026-8841',
    createdAt: '2 jam yang lalu',
    comments: [
      {
        id: 'c-1',
        authorName: 'Ahmad Syafii (Ketua MPA Pulau Padang)',
        authorRole: 'Relawan MPA',
        content:
          'Terima kasih kepada seluruh donatur! Sumur bor di Blok A1 sangat membantu regu kami memadamkan asap bawah permukaan kemarin sore.',
        createdAt: '1 jam yang lalu',
      },
      {
        id: 'c-2',
        authorName: 'Dr. Rina Kusuma (Peneliti Hidrologi Gambut)',
        authorRole: 'Warga & Akademisi',
        content:
          'Transparansi laporan seperti ini sangat bagus, terlihat jelas foto lapangan dan rincian penggunaan dananya.',
        createdAt: '45 menit yang lalu',
      },
    ],
  },
  {
    id: 'post-02',
    authorName: 'Hendra Kusuma (Koordinator MPA Jabiren Raya)',
    authorRole: 'RELAWAN_MPA',
    locationTag: 'KHG Kahayan–Sebangau, Pulang Pisau — Kalimantan Tengah',
    island: 'KALIMANTAN',
    category: 'BERITA_BENCANA_TERKINI',
    title: 'Update Lapangan Kalteng: Pemadaman Titik Asap Blok C & Penyaluran Pompa Tahap I',
    content:
      'Siang ini suhu permukaan gambut di Jabiren Raya mencapai 39.4°C dengan TMA -68.4 cm. Berkat bantuan pompa tekanan tinggi dari donasi warga yang diteruskan Posko Pusat, regu Manggala Agni Daops Kalimantan I bersama 18 warga berhasil menyekat perambatan bara api agar tidak masuk ke hutan lindung Sebangau.',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    likes: 94,
    treesPlantedImpact: 3850,
    disbursedAmountRp: 52000000,
    linkedCampaignId: 'camp-01',
    verifiedAuditCode: 'AUDIT-BPBD-KT-2026-319',
    createdAt: '35 menit yang lalu',
    comments: [
      {
        id: 'c-3',
        authorName: 'Budi Raharjo (Donatur Jakarta)',
        authorRole: 'Kontributor Save Tree',
        content:
          'Semangat terus tim MPA Kalteng & Manggala Agni! Saya baru saja ikut donasi 20 bibit pohon Belangeran untuk Sebangau.',
        createdAt: '15 menit yang lalu',
      },
    ],
  },
  {
    id: 'post-03',
    authorName: 'Komunitas Save Tree & Relawan Muda Pontianak',
    authorRole: 'WARGA_LOKAL',
    locationTag: 'Rasau Jaya, Kab. Kubu Raya — Kalimantan Barat',
    island: 'KALIMANTAN',
    category: 'AKSI_SAVE_TREE',
    title: 'Aksi Akhir Pekan: Penanaman 1.900 Bibit Jelutung Rawa di Lahan Bekas Terbakar Kubu Raya',
    content:
      'Pohon Jelutung dan Belangeran adalah kunci menjaga air tanah gambut agar tidak mudah terbakar saat El Nino. Hari ini 45 relawan mahasiswa dan petani Rasau Jaya menanam 1.900 bibit hasil patungan warga di platform GREEN PULSE.',
    imageUrl:
      'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?auto=format&fit=crop&w=900&q=80',
    likes: 76,
    treesPlantedImpact: 1900,
    createdAt: '18 menit yang lalu',
    comments: [],
  },
];

export const INITIAL_TRANSACTIONS: DonationTransactionData[] = [
  {
    id: 'tx-01',
    txCode: 'TX-GP-2026-9041',
    donorName: 'Andika Pratama (Warga Peduli Gambut)',
    campaignId: 'camp-01',
    campaignTitle: 'Darurat Pompa Sekat Kanal & Reboisasi 5.000 Pohon Belangeran KHG Sebangau',
    amountRp: 500000,
    treesSponsored: 25,
    message: 'Semoga tim MPA Kalteng selalu diberi keselamatan dan hutan gambut kita kembali hijau.',
    paymentMethod: 'QRIS Transparan Pusat',
    status: 'TERVERIFIKASI_PUBLIK',
    createdAt: '10 Nov 2026, 07:30 WIB',
  },
  {
    id: 'tx-02',
    txCode: 'TX-GP-2026-9040',
    donorName: 'Siti Nurhaliza (Komunitas Hijau Sumatera)',
    campaignId: 'camp-02',
    campaignTitle: 'Gerakan 4.000 Pohon Ramin (Save Tree) & Sumur Bor Desa Pulau Padang',
    amountRp: 250000,
    treesSponsored: 12,
    message: 'Titip 12 pohon Ramin untuk Desa Pulau Padang Riau!',
    paymentMethod: 'Virtual Account Bank Nasional',
    status: 'TERVERIFIKASI_PUBLIK',
    createdAt: '10 Nov 2026, 07:12 WIB',
  },
  {
    id: 'tx-03',
    txCode: 'TX-GP-2026-9039',
    donorName: 'Hamba Allah (Palangka Raya)',
    campaignId: 'camp-03',
    campaignTitle: 'Tanggap Asap & Restorasi Hutan Gambut OKI (Sumsel) & Kubu Raya (Kalbar)',
    amountRp: 150000,
    treesSponsored: 7,
    message: 'Untuk bantuan masker N95 anak-anak di OKI Sumsel & Kubu Raya.',
    paymentMethod: 'QRIS Transparan Pusat',
    status: 'TERVERIFIKASI_PUBLIK',
    createdAt: '10 Nov 2026, 06:55 WIB',
  },
];

export function getStoredReports(): CitizenReportData[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return INITIAL_REPORTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REPORTS;
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveStoredReports(reports: CitizenReportData[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    window.dispatchEvent(new Event('greenpulse-sync'));
  } catch {
    // ignore storage quota errors
  }
}

export function getStoredProposals(): CommunityProposalData[] {
  if (typeof window === 'undefined') return INITIAL_PROPOSALS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    if (!raw) return INITIAL_PROPOSALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROPOSALS;
  } catch {
    return INITIAL_PROPOSALS;
  }
}

export function saveStoredProposals(proposals: CommunityProposalData[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
    window.dispatchEvent(new Event('greenpulse-sync'));
  } catch {
    // ignore
  }
}

export function getStoredPatrols(): PatrolScheduleData[] {
  if (typeof window === 'undefined') return INITIAL_PATROLS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PATROLS);
    if (!raw) return INITIAL_PATROLS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PATROLS;
  } catch {
    return INITIAL_PATROLS;
  }
}

export function saveStoredPatrols(patrols: PatrolScheduleData[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.PATROLS, JSON.stringify(patrols));
    window.dispatchEvent(new Event('greenpulse-sync'));
  } catch {
    // ignore
  }
}

export function getStoredPosts(): CommunityPostData[] {
  if (typeof window === 'undefined') return INITIAL_COMMUNITY_POSTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (!raw) return INITIAL_COMMUNITY_POSTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_COMMUNITY_POSTS;
  } catch {
    return INITIAL_COMMUNITY_POSTS;
  }
}

export function saveStoredPosts(posts: CommunityPostData[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.COMMUNITY_POSTS,
      JSON.stringify(posts),
    );
    window.dispatchEvent(new Event('greenpulse-sync'));
  } catch {
    // ignore
  }
}

export function getStoredCampaigns(): DonationCampaignData[] {
  if (typeof window === 'undefined') return INITIAL_CAMPAIGNS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (!raw) return INITIAL_CAMPAIGNS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_CAMPAIGNS;
  } catch {
    return INITIAL_CAMPAIGNS;
  }
}

export function saveStoredCampaigns(campaigns: DonationCampaignData[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.CAMPAIGNS,
      JSON.stringify(campaigns),
    );
    window.dispatchEvent(new Event('greenpulse-sync'));
  } catch {
    // ignore
  }
}

export function getStoredTransactions(): DonationTransactionData[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return INITIAL_TRANSACTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(txs: DonationTransactionData[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(txs),
    );
    window.dispatchEvent(new Event('greenpulse-sync'));
  } catch {
    // ignore
  }
}
