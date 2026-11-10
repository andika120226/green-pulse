import { PrismaClient, RiskStatus, NodeStatus, ReportSeverity, ReportStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GREEN PULSE database seeding on green_pulse_db...');

  // 1. Clean existing data
  await prisma.telemetry.deleteMany();
  await prisma.citizenReport.deleteMany();
  await prisma.sensorNode.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users (BPBD Admin, Manggala Agni, Citizen)
  await prisma.user.createMany({
    data: [
      {
        email: 'komando.bpbd@greenpulse.go.id',
        name: 'Komandan Posko BPBD Riau',
        passwordHash: '$2b$10$greenpulsehashedpassword2026admin',
        role: UserRole.ADMIN_BPBD,
        unitName: 'Pusdalops BPBD Provinsi Riau',
        phone: '+628117502026',
      },
      {
        email: 'manggala.agni@greenpulse.go.id',
        name: 'Danru Manggala Agni Daops Sumatera IV',
        passwordHash: '$2b$10$greenpulsehashedpassword2026manggala',
        role: UserRole.MANGGALA_AGNI,
        unitName: 'Daops Manggala Agni Kepulauan Meranti',
        phone: '+628127602026',
      },
      {
        email: 'mpa.pulaupadang@greenpulse.id',
        name: 'Ahmad Syafii (Ketua MPA Desa Pulau Padang)',
        passwordHash: '$2b$10$greenpulsehashedpassword2026citizen',
        role: UserRole.CITIZEN,
        unitName: 'Masyarakat Peduli Api (MPA)',
        phone: '+6285271993812',
      },
    ],
  });

  // 3. Seed Sensor Nodes (KHG Pulau Tebing Tinggi & Pulau Padang, Riau)
  const nodesData = [
    {
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
      status: NodeStatus.ONLINE,
      currentRiskStatus: RiskStatus.KRITIS,
      lastWaterLevelTMA: -64.5,
      lastSoilMoisture10cm: 28.4,
      lastSoilMoisture40cm: 39.2,
      lastSurfaceTemp: 38.6,
      lastAirTemp: 35.8,
      lastAirHumidity: 46.0,
      lastPm25: 168.0,
      consecutiveDryDays: 14,
      predictedRiskScore: 94.2,
    },
    {
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
      status: NodeStatus.ONLINE,
      currentRiskStatus: RiskStatus.SIAGA,
      lastWaterLevelTMA: -48.2,
      lastSoilMoisture10cm: 36.8,
      lastSoilMoisture40cm: 48.5,
      lastSurfaceTemp: 35.1,
      lastAirTemp: 33.4,
      lastAirHumidity: 55.2,
      lastPm25: 94.0,
      consecutiveDryDays: 10,
      predictedRiskScore: 76.5,
    },
    {
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
      status: NodeStatus.ONLINE,
      currentRiskStatus: RiskStatus.AMAN,
      lastWaterLevelTMA: -14.8,
      lastSoilMoisture10cm: 68.5,
      lastSoilMoisture40cm: 78.2,
      lastSurfaceTemp: 28.9,
      lastAirTemp: 29.7,
      lastAirHumidity: 79.0,
      lastPm25: 22.0,
      consecutiveDryDays: 2,
      predictedRiskScore: 11.4,
    },
    {
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
      status: NodeStatus.WARNING,
      currentRiskStatus: RiskStatus.WASPADA,
      lastWaterLevelTMA: -32.6,
      lastSoilMoisture10cm: 46.2,
      lastSoilMoisture40cm: 57.0,
      lastSurfaceTemp: 32.8,
      lastAirTemp: 31.9,
      lastAirHumidity: 63.5,
      lastPm25: 58.0,
      consecutiveDryDays: 6,
      predictedRiskScore: 48.7,
    },
    {
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
      status: NodeStatus.ONLINE,
      currentRiskStatus: RiskStatus.KRITIS,
      lastWaterLevelTMA: -62.1,
      lastSoilMoisture10cm: 30.1,
      lastSoilMoisture40cm: 41.0,
      lastSurfaceTemp: 37.9,
      lastAirTemp: 35.2,
      lastAirHumidity: 48.5,
      lastPm25: 152.0,
      consecutiveDryDays: 14,
      predictedRiskScore: 91.8,
    },
  ];

  const createdNodes = [];
  for (const n of nodesData) {
    const node = await prisma.sensorNode.create({ data: n });
    createdNodes.push(node);
  }

  // 4. Seed 14-Day Historical Time-Series Telemetry for Node GP-KHG-01
  const primaryNode = createdNodes[0];
  const now = new Date();
  const telemetryHistory = [
    { dayOffset: 13, tma: -16.2, sm10: 66.0, sm40: 75.0, temp: 29.1, pm25: 25, status: RiskStatus.AMAN, score: 14.2 },
    { dayOffset: 12, tma: -19.5, sm10: 63.2, sm40: 72.1, temp: 29.8, pm25: 28, status: RiskStatus.AMAN, score: 18.5 },
    { dayOffset: 11, tma: -23.8, sm10: 58.5, sm40: 68.4, temp: 30.6, pm25: 35, status: RiskStatus.WASPADA, score: 29.0 },
    { dayOffset: 10, tma: -28.4, sm10: 54.1, sm40: 64.0, temp: 31.4, pm25: 42, status: RiskStatus.WASPADA, score: 36.8 },
    { dayOffset: 9,  tma: -33.1, sm10: 49.8, sm40: 59.5, temp: 32.2, pm25: 49, status: RiskStatus.WASPADA, score: 44.5 },
    { dayOffset: 8,  tma: -38.7, sm10: 45.2, sm40: 55.2, temp: 33.1, pm25: 58, status: RiskStatus.WASPADA, score: 53.1 },
    { dayOffset: 7,  tma: -43.2, sm10: 41.6, sm40: 51.0, temp: 34.0, pm25: 72, status: RiskStatus.SIAGA, score: 64.0 },
    { dayOffset: 6,  tma: -47.9, sm10: 38.9, sm40: 48.2, temp: 34.9, pm25: 86, status: RiskStatus.SIAGA, score: 71.4 },
    { dayOffset: 5,  tma: -52.4, sm10: 36.4, sm40: 45.8, temp: 35.6, pm25: 98, status: RiskStatus.SIAGA, score: 78.2 },
    { dayOffset: 4,  tma: -56.8, sm10: 34.2, sm40: 43.5, temp: 36.3, pm25: 115, status: RiskStatus.SIAGA, score: 83.9 },
    { dayOffset: 3,  tma: -60.2, sm10: 32.1, sm40: 41.8, temp: 37.0, pm25: 132, status: RiskStatus.KRITIS, score: 88.5 },
    { dayOffset: 2,  tma: -61.9, sm10: 30.5, sm40: 40.6, temp: 37.6, pm25: 145, status: RiskStatus.KRITIS, score: 91.0 },
    { dayOffset: 1,  tma: -63.4, sm10: 29.2, sm40: 39.8, temp: 38.1, pm25: 156, status: RiskStatus.KRITIS, score: 92.8 },
    { dayOffset: 0,  tma: -64.5, sm10: 28.4, sm40: 39.2, temp: 38.6, pm25: 168, status: RiskStatus.KRITIS, score: 94.2 },
  ];

  for (const item of telemetryHistory) {
    const recordedAt = new Date(now.getTime() - item.dayOffset * 24 * 60 * 60 * 1000);
    await prisma.telemetry.create({
      data: {
        nodeId: primaryNode.id,
        waterLevelTMA: item.tma,
        soilMoisture10cm: item.sm10,
        soilMoisture40cm: item.sm40,
        surfaceTemp: item.temp,
        airTemp: Number((item.temp - 2.4).toFixed(1)),
        airHumidity: Number((85 - (14 - item.dayOffset) * 2.7).toFixed(1)),
        pm25: item.pm25,
        consecutiveDryDays: 14 - item.dayOffset,
        rssiDbm: -74,
        batteryPercent: 89.4,
        riskStatus: item.status,
        predictedRiskScore: item.score,
        payloadSignature: 'hmac-sha256:8f9c2d1e4a7b6c3d9e0f1a2b3c4d5e6f',
        recordedAt,
      },
    });
  }

  // 5. Seed Citizen Crowdsourcing Reports (with Spatial Clustering DBSCAN/Haversine IDs)
  await prisma.citizenReport.createMany({
    data: [
      {
        reportCode: 'GP-REP-2026-001',
        reporterName: 'Ahmad Syafii (MPA Pulau Padang)',
        reporterPhone: '+6285271993812',
        sector: 'Sektor Desa Pulau Padang Utara (Blok A1)',
        description: 'Kepulan asap putih pekat berbau gambut menyengat muncul dari bawah permukaan dekat sekat kanal kering.',
        latitude: 0.2584,
        longitude: 102.4033,
        gpsAccuracyMeters: 3.2,
        photoUrl: '/images/peat-smoke-sample-1.jpg',
        exifVerified: true,
        isMockLocation: false,
        severity: ReportSeverity.ASAP_PEKAT_GAMBUT,
        status: ReportStatus.DISPATCHED,
        clusterGroupId: 'CLUSTER-KHG01-2026A',
        dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
        verifiedBy: 'Komandan Posko BPBD Riau',
        verifiedAt: new Date(now.getTime() - 12 * 60 * 1000),
      },
      {
        reportCode: 'GP-REP-2026-002',
        reporterName: 'Hendra Wijaya (Warga Desa Mekar Sari)',
        reporterPhone: '+6281365448901',
        sector: 'Sektor Desa Pulau Padang Utara (Blok A1 - Radius 180m)',
        description: 'Terlihat bara api merambat di semak pakis kering sekitar 180 meter dari titik pantau GP-KHG-01.',
        latitude: 0.2595,
        longitude: 102.4042,
        gpsAccuracyMeters: 4.1,
        photoUrl: '/images/peat-smoke-sample-2.jpg',
        exifVerified: true,
        isMockLocation: false,
        severity: ReportSeverity.API_TERBUKA,
        status: ReportStatus.VERIFIED,
        clusterGroupId: 'CLUSTER-KHG01-2026A',
        dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
        verifiedBy: 'Komandan Posko BPBD Riau',
        verifiedAt: new Date(now.getTime() - 8 * 60 * 1000),
      },
      {
        reportCode: 'GP-REP-2026-003',
        reporterName: 'Siti Rahmawati (Petani Sagu Lukun)',
        reporterPhone: '+6282178331044',
        sector: 'Sektor Kanal Sekat Lukun Timur (Blok B3)',
        description: 'Asap tipis mulai terlihat di pinggir kebun sagu dekat kanal sekat yang airnya menyusut.',
        latitude: 0.8318,
        longitude: 102.8221,
        gpsAccuracyMeters: 2.8,
        photoUrl: '/images/peat-smoke-sample-3.jpg',
        exifVerified: true,
        isMockLocation: false,
        severity: ReportSeverity.ASAP_TIPIS,
        status: ReportStatus.PENDING,
        clusterGroupId: 'CLUSTER-KHG02-2026B',
      },
    ],
  });

  console.log('✅ GREEN PULSE seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

