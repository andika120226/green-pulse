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
    label: 'Asap Tipis Kebun Sagu Warga',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_NODES: SensorNodeData[] = [
  {
    id: 'node-khg-01',
    nodeCode: 'GP-KHG-01',
    name: 'Stasiun Sektor Desa Pulau Padang Utara',
    sector: 'KHG Pulau Padang - Blok A1',
    district: 'Merbau',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
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
    id: 'node-khg-02',
    nodeCode: 'GP-KHG-02',
    name: 'Stasiun Kanal Sekat Lukun Timur',
    sector: 'KHG Pulau Tebing Tinggi - Blok B3',
    district: 'Tebing Tinggi Timur',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
    latitude: 0.8312,
    longitude: 102.8215,
    peatDepthCm: 480,
    batteryPercent: 93.1,
    rssiDbm: -79,
    snrDb: 8.1,
    status: 'ONLINE',
    currentRiskStatus: 'SIAGA',
    lastWaterLevelTMA: -48.2,
    lastSoilMoisture10cm: 36.8,
    lastSoilMoisture40cm: 48.5,
    lastSurfaceTemp: 35.1,
    lastAirTemp: 33.4,
    lastAirHumidity: 55.2,
    lastPm25: 94.0,
    consecutiveDryDays: 10,
    predictedRiskScore: 76.5,
    lastSeenAt: '12 detik lalu',
  },
  {
    id: 'node-khg-03',
    nodeCode: 'GP-KHG-03',
    name: 'Stasiun Kubah Gambut Sungai Tohor',
    sector: 'KHG Pulau Tebing Tinggi - Restorasi BRGM',
    district: 'Tebing Tinggi Timur',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
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
    lastSeenAt: '18 detik lalu',
  },
  {
    id: 'node-khg-04',
    nodeCode: 'GP-KHG-04',
    name: 'Stasiun Perbatasan Konsesi Tanjung Sari',
    sector: 'KHG Pulau Padang - Blok C2',
    district: 'Tebing Tinggi Barat',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
    latitude: 0.9124,
    longitude: 102.5841,
    peatDepthCm: 430,
    batteryPercent: 78.2,
    rssiDbm: -86,
    snrDb: 6.4,
    status: 'WARNING',
    currentRiskStatus: 'WASPADA',
    lastWaterLevelTMA: -32.6,
    lastSoilMoisture10cm: 46.2,
    lastSoilMoisture40cm: 57.0,
    lastSurfaceTemp: 32.8,
    lastAirTemp: 31.9,
    lastAirHumidity: 63.5,
    lastPm25: 58.0,
    consecutiveDryDays: 6,
    predictedRiskScore: 48.7,
    lastSeenAt: '25 detik lalu',
  },
  {
    id: 'node-khg-05',
    nodeCode: 'GP-KHG-05',
    name: 'Stasiun Koridor Gambut Teluk Belitung',
    sector: 'KHG Pulau Padang - Blok D1',
    district: 'Merbau',
    regency: 'Kepulauan Meranti',
    province: 'Riau',
    latitude: 0.2715,
    longitude: 102.4198,
    peatDepthCm: 540,
    batteryPercent: 84.0,
    rssiDbm: -81,
    snrDb: 7.8,
    status: 'ONLINE',
    currentRiskStatus: 'KRITIS',
    lastWaterLevelTMA: -62.1,
    lastSoilMoisture10cm: 30.1,
    lastSoilMoisture40cm: 41.0,
    lastSurfaceTemp: 37.9,
    lastAirTemp: 35.2,
    lastAirHumidity: 48.5,
    lastPm25: 152.0,
    consecutiveDryDays: 14,
    predictedRiskScore: 91.8,
    lastSeenAt: '5 detik lalu',
  },
];

export const INITIAL_REPORTS: CitizenReportData[] = [
  {
    id: 'rep-001',
    reportCode: 'GP-REP-2026-001',
    reporterName: 'Ahmad Syafii (MPA Pulau Padang)',
    reporterPhone: '+6285271993812',
    sector: 'Sektor Desa Pulau Padang Utara (Blok A1)',
    description:
      'Kepulan asap putih pekat berbau gambut menyengat muncul dari bawah permukaan dekat sekat kanal kering.',
    latitude: 0.2584,
    longitude: 102.4033,
    gpsAccuracyMeters: 3.2,
    photoUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'ASAP_PEKAT_GAMBUT',
    status: 'DISPATCHED',
    clusterGroupId: 'CLUSTER-KHG01-2026A',
    dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
    verifiedBy: 'Komandan Posko BPBD Riau',
    verifiedAt: '10 Nov 2026, 06:58 WIB',
    createdAt: '10 Nov 2026, 06:54 WIB',
    communityConfirmations: 14,
  },
  {
    id: 'rep-002',
    reportCode: 'GP-REP-2026-002',
    reporterName: 'Hendra Wijaya (Warga Desa Mekar Sari)',
    reporterPhone: '+6281365448901',
    sector: 'Sektor Desa Pulau Padang Utara (Blok A1 - Radius 180m)',
    description:
      'Terlihat bara api merambat di semak pakis kering sekitar 180 meter dari titik pantau GP-KHG-01.',
    latitude: 0.2595,
    longitude: 102.4042,
    gpsAccuracyMeters: 4.1,
    photoUrl:
      'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'API_TERBUKA',
    status: 'VERIFIED',
    clusterGroupId: 'CLUSTER-KHG01-2026A',
    dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
    verifiedBy: 'Komandan Posko BPBD Riau',
    verifiedAt: '10 Nov 2026, 07:02 WIB',
    createdAt: '10 Nov 2026, 06:59 WIB',
    communityConfirmations: 9,
  },
  {
    id: 'rep-003',
    reportCode: 'GP-REP-2026-003',
    reporterName: 'Siti Rahmawati (Petani Sagu Lukun)',
    reporterPhone: '+6282178331044',
    sector: 'Sektor Kanal Sekat Lukun Timur (Blok B3)',
    description:
      'Asap tipis mulai terlihat di pinggir kebun sagu dekat kanal sekat yang airnya menyusut.',
    latitude: 0.8318,
    longitude: 102.8221,
    gpsAccuracyMeters: 2.8,
    photoUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    exifVerified: true,
    isMockLocation: false,
    severity: 'ASAP_TIPIS',
    status: 'PENDING',
    clusterGroupId: 'CLUSTER-KHG02-2026B',
    dispatchedTeam: null,
    verifiedBy: null,
    verifiedAt: null,
    createdAt: '10 Nov 2026, 07:06 WIB',
    communityConfirmations: 5,
  },
];

export const INITIAL_PROPOSALS: CommunityProposalData[] = [
  {
    id: 'prop-01',
    proposalCode: 'USUL-BRGM-01',
    proposerName: 'Kelompok Tani Gambut Makmur',
    villageName: 'Desa Pulau Padang, Kec. Merbau',
    infrastructureType: 'SEKAT_KANAL',
    latitude: 0.2645,
    longitude: 102.4112,
    urgency: 'TINGGI',
    reason:
      'Kanal drainase lama mengering cepat saat kemarau, perlu sekat kanal beton bertingkat (spillway) untuk menahan air kubah gambut.',
    votes: 28,
    status: 'DISETUJUI',
    createdAt: '08 Nov 2026',
  },
  {
    id: 'prop-02',
    proposalCode: 'USUL-BRGM-02',
    proposerName: 'MPA Desa Lukun & Tokoh Masyarakat',
    villageName: 'Desa Lukun, Kec. Tebing Tinggi Timur',
    infrastructureType: 'SUMUR_BOR',
    latitude: 0.8365,
    longitude: 102.8155,
    urgency: 'TINGGI',
    reason:
      'Jarak sumber air ke titik rawan api mencapai 1,4 km. Warga mengusulkan 2 titik sumur bor artesis untuk suplai pompa pemadam.',
    votes: 19,
    status: 'DIKAJI_BRGM',
    createdAt: '09 Nov 2026',
  },
  {
    id: 'prop-03',
    proposalCode: 'USUL-BRGM-03',
    proposerName: 'Karang Taruna Sungai Tohor',
    villageName: 'Desa Sungai Tohor, Kec. Tebing Tinggi Timur',
    infrastructureType: 'EMBUNG_AIR',
    latitude: 0.869,
    longitude: 102.771,
    urgency: 'SEDANG',
    reason:
      'Normalisasi embung penampungan air hujan di perbatasan kebun sagu warga untuk cadangan pembasahan gambut (rewetting).',
    votes: 12,
    status: 'DIUSULKAN_WARGA',
    createdAt: '10 Nov 2026',
  },
];

export const INITIAL_PATROLS: PatrolScheduleData[] = [
  {
    id: 'patrol-01',
    teamName: 'Regu MPA Desa Pulau Padang - Sektor Utara',
    coordinatorName: 'Ahmad Syafii',
    phone: '+6285271993812',
    sectorRoute: 'Jalur Sekat Kanal Blok A1 s/d Perbatasan Teluk Belitung',
    scheduleDate: '2026-11-10',
    shiftTime: 'SIANG (12:00-17:00)',
    waterSourceStatus: 'KERING_KRITIS',
    personnelCount: 8,
    equipmentNotes: '2 Unit Pompa Jinjing Tohatsu, 6 Roll Selang, Drone Termal Desa',
    createdAt: '10 Nov 2026, 06:30 WIB',
  },
  {
    id: 'patrol-02',
    teamName: 'Relawan Peduli Gambut Lukun Timur',
    coordinatorName: 'M. Ridwan',
    phone: '+6281275884410',
    sectorRoute: 'Koridor Kebun Sagu Lukun - Kanal Sekat B3',
    scheduleDate: '2026-11-11',
    shiftTime: 'PAGI (07:00-12:00)',
    waterSourceStatus: 'MENYUSUT_WASPADA',
    personnelCount: 6,
    equipmentNotes: '1 Pompa Apung, Alat Ukur TMA Manual, HT Komunitas',
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
  { day: 'Hari Ini', date: '10 Nov', waterLevelTMA: -64.5, soilMoisture10cm: 28.4, soilMoisture40cm: 39.2, surfaceTemp: 38.6, pm25: 168, riskStatus: 'KRITIS', predictedRiskScore: 94.2, brgmLimit: -40 },
];

// LocalStorage Keys & Shared Sync Helpers for Cross-Page Participatory Crowdsourcing
export const STORAGE_KEYS = {
  REPORTS: 'green_pulse_reports_v2',
  PROPOSALS: 'green_pulse_proposals_v2',
  PATROLS: 'green_pulse_patrols_v2',
};

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
