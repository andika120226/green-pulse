import { BadRequestException } from '@nestjs/common';
import { CrowdsourcingService } from './crowdsourcing.service';
import { ReportSeverityDto } from './dto/create-report.dto';

describe('CrowdsourcingService (Anti-Mock GPS & Haversine Spatial Clustering)', () => {
  let service: CrowdsourcingService;

  beforeEach(() => {
    const mockPrisma = { isConnected: false } as any;
    const mockGateway = { emitNewReport: jest.fn() } as any;
    service = new CrowdsourcingService(mockPrisma, mockGateway);
  });

  it('should automatically reject reports where isMockLocation === true', async () => {
    await expect(
      service.submitReport({
        reporterName: 'Pelapor Spoofing',
        reporterPhone: '+62811111111',
        sector: 'Sektor Palsu',
        description: 'Laporan dengan Fake GPS',
        latitude: 0.2584,
        longitude: 102.4033,
        isMockLocation: true,
        severity: ReportSeverityDto.API_TERBUKA,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should merge reports within 500m radius and 30 minutes into the same clusterGroupId', async () => {
    const res = await service.submitReport({
      reporterName: 'Budi Santoso (Warga Pulau Padang)',
      reporterPhone: '+6281299887766',
      sector: 'Sektor Desa Pulau Padang Utara (Blok A1)',
      description: 'Asap tebal terlihat 120 meter dari kanal sekat GP-KHG-01',
      latitude: 0.2589, // ~80 meters from existing report (0.2584, 102.4033)
      longitude: 102.4036,
      isMockLocation: false,
      severity: ReportSeverityDto.ASAP_PEKAT_GAMBUT,
    });

    expect(res.spatialClusterMerged).toBe(true);
    expect(res.haversineDistanceMeters).toBeLessThanOrEqual(500);
    expect(res.data.clusterGroupId).toBe('CLUSTER-KHG01-2026A');
  });
});

