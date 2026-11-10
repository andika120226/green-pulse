import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { VerifyReportDto } from './dto/verify-report.dto';
import { GreenPulseGateway } from '../gateway/green-pulse.gateway';

@Injectable()
export class CrowdsourcingService {
  private memoryReports: any[] = [
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
      photoUrl: '/images/peat-smoke-sample-1.jpg',
      exifVerified: true,
      isMockLocation: false,
      severity: 'ASAP_PEKAT_GAMBUT',
      status: 'DISPATCHED',
      clusterGroupId: 'CLUSTER-KHG01-2026A',
      dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
      verifiedBy: 'Komandan Posko BPBD Riau',
      verifiedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
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
      photoUrl: '/images/peat-smoke-sample-2.jpg',
      exifVerified: true,
      isMockLocation: false,
      severity: 'API_TERBUKA',
      status: 'VERIFIED',
      clusterGroupId: 'CLUSTER-KHG01-2026A',
      dispatchedTeam: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
      verifiedBy: 'Komandan Posko BPBD Riau',
      verifiedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
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
      photoUrl: '/images/peat-smoke-sample-3.jpg',
      exifVerified: true,
      isMockLocation: false,
      severity: 'ASAP_TIPIS',
      status: 'PENDING',
      clusterGroupId: 'CLUSTER-KHG02-2026B',
      dispatchedTeam: null,
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: GreenPulseGateway,
  ) {}

  /**
   * Haversine Formula: calculates distance in meters between two GPS coordinates
   */
  calculateHaversineDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async findAll() {
    if (this.prisma.isConnected) {
      try {
        const dbReports = await this.prisma.citizenReport.findMany({
          orderBy: { createdAt: 'desc' },
        });
        if (dbReports.length > 0) return dbReports;
      } catch {
        // Fallback to memory
      }
    }
    return this.memoryReports;
  }

  async submitReport(dto: CreateReportDto) {
    // 1. Reject automatically if isMockLocation === true or missing GPS coordinates
    if (dto.isMockLocation === true) {
      throw new BadRequestException(
        'REJECTED: Terdeteksi penggunaan Fake GPS / Mock Location. Laporan ditolak oleh protokol keamanan GREEN PULSE.',
      );
    }

    if (
      dto.latitude === undefined ||
      dto.longitude === undefined ||
      dto.latitude === null ||
      dto.longitude === null ||
      Number.isNaN(Number(dto.latitude)) ||
      Number.isNaN(Number(dto.longitude))
    ) {
      throw new BadRequestException(
        'REJECTED: Metadata koordinat GPS kosong atau tidak valid.',
      );
    }

    // 2. Spatial Clustering (Haversine <= 500 meters within 30 minutes window)
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    const existingReports = await this.findAll();

    let assignedClusterId: string | null = null;
    let nearestDistanceMeters: number | null = null;

    for (const existing of existingReports) {
      const createdTime = new Date(existing.createdAt).getTime();
      if (createdTime >= thirtyMinutesAgo) {
        const dist = this.calculateHaversineDistanceMeters(
          dto.latitude,
          dto.longitude,
          existing.latitude,
          existing.longitude,
        );
        if (dist <= 500) {
          assignedClusterId =
            existing.clusterGroupId || `CLUSTER-${existing.reportCode}`;
          nearestDistanceMeters = Number(dist.toFixed(1));
          break;
        }
      }
    }

    const reportNumber = String(existingReports.length + 1).padStart(3, '0');
    const reportCode = `GP-REP-2026-${reportNumber}`;
    if (!assignedClusterId) {
      assignedClusterId = `CLUSTER-${reportCode}`;
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      reportCode,
      reporterName: dto.reporterName,
      reporterPhone: dto.reporterPhone,
      sector: dto.sector,
      description: dto.description,
      latitude: dto.latitude,
      longitude: dto.longitude,
      gpsAccuracyMeters: dto.gpsAccuracyMeters ?? 3.2,
      photoUrl: dto.photoUrl ?? '/images/peat-smoke-sample-1.jpg',
      exifVerified: dto.exifVerified ?? true,
      isMockLocation: false,
      severity: dto.severity,
      status: 'PENDING',
      clusterGroupId: assignedClusterId,
      dispatchedTeam: null,
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date().toISOString(),
    };

    if (this.prisma.isConnected) {
      try {
        await this.prisma.citizenReport.create({
          data: {
            reportCode: newReport.reportCode,
            reporterName: newReport.reporterName,
            reporterPhone: newReport.reporterPhone,
            sector: newReport.sector,
            description: newReport.description,
            latitude: newReport.latitude,
            longitude: newReport.longitude,
            gpsAccuracyMeters: newReport.gpsAccuracyMeters,
            photoUrl: newReport.photoUrl,
            exifVerified: newReport.exifVerified,
            isMockLocation: false,
            severity: newReport.severity as any,
            status: 'PENDING',
            clusterGroupId: newReport.clusterGroupId,
          },
        });
      } catch {
        // Fallback to memory
      }
    }

    this.memoryReports.unshift(newReport);
    this.gateway.emitNewReport(newReport);

    return {
      status: 'SUCCESS',
      message:
        nearestDistanceMeters !== null
          ? `Laporan diterima & digabungkan otomatis ke kluster spasial ${assignedClusterId} (jarak Haversine ${nearestDistanceMeters}m <= 500m).`
          : `Laporan titik api baru berhasil dibuat dengan ID kluster ${assignedClusterId}.`,
      spatialClusterMerged: nearestDistanceMeters !== null,
      haversineDistanceMeters: nearestDistanceMeters,
      data: newReport,
    };
  }

  async verifyAndDispatch(idOrCode: string, dto: VerifyReportDto) {
    const verifiedAt = new Date().toISOString();

    if (this.prisma.isConnected) {
      try {
        const updated = await this.prisma.citizenReport.updateMany({
          where: {
            OR: [{ id: idOrCode }, { reportCode: idOrCode }],
          },
          data: {
            status: dto.status as any,
            dispatchedTeam:
              dto.dispatchedTeam ?? 'Regu Manggala Agni Alpha-01 & MPA Desa',
            verifiedBy: dto.verifiedBy ?? 'Komandan Posko BPBD Riau',
            verifiedAt: new Date(verifiedAt),
          },
        });
        if (updated.count > 0) {
          const idx = this.memoryReports.findIndex(
            (r) => r.id === idOrCode || r.reportCode === idOrCode,
          );
          if (idx !== -1) {
            this.memoryReports[idx] = {
              ...this.memoryReports[idx],
              status: dto.status,
              dispatchedTeam:
                dto.dispatchedTeam ?? 'Regu Manggala Agni Alpha-01 & MPA Desa',
              verifiedBy: dto.verifiedBy ?? 'Komandan Posko BPBD Riau',
              verifiedAt,
            };
          }
          return {
            status: 'SUCCESS',
            message: `Laporan ${idOrCode} telah diverifikasi (${dto.status}) dan regu pemadam diterjunkan.`,
            data: this.memoryReports[idx] ?? { idOrCode, ...dto, verifiedAt },
          };
        }
      } catch {
        // Fallback to memory
      }
    }

    const idx = this.memoryReports.findIndex(
      (r) => r.id === idOrCode || r.reportCode === idOrCode,
    );
    if (idx === -1) {
      throw new NotFoundException(`Report ${idOrCode} not found`);
    }

    this.memoryReports[idx] = {
      ...this.memoryReports[idx],
      status: dto.status,
      dispatchedTeam:
        dto.dispatchedTeam ??
        this.memoryReports[idx].dispatchedTeam ??
        'Regu Manggala Agni Alpha-01 & MPA Desa',
      verifiedBy: dto.verifiedBy ?? 'Komandan Posko BPBD Riau',
      verifiedAt,
    };

    this.gateway.emitNewReport(this.memoryReports[idx]);

    return {
      status: 'SUCCESS',
      message: `Laporan ${this.memoryReports[idx].reportCode} berhasil diupdate ke status ${dto.status}.`,
      data: this.memoryReports[idx],
    };
  }

  async deleteReport(idOrCode: string) {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.citizenReport.deleteMany({
          where: {
            OR: [{ id: idOrCode }, { reportCode: idOrCode }],
          },
        });
      } catch {
        // Fallback
      }
    }

    const idx = this.memoryReports.findIndex(
      (r) => r.id === idOrCode || r.reportCode === idOrCode,
    );
    if (idx === -1) {
      throw new NotFoundException(`Report ${idOrCode} not found`);
    }
    const removed = this.memoryReports.splice(idx, 1)[0];
    return {
      status: 'SUCCESS',
      deletedReportCode: removed.reportCode,
    };
  }
}

