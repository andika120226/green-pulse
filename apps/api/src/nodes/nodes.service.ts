import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';

@Injectable()
export class NodesService {
  private memoryNodes: any[] = [
    {
      id: 'node-kal-01',
      nodeCode: 'GP-KAL-01',
      name: 'Stasiun KHG Kahayan–Sebangau (Eks-PLG Blok C)',
      sector: 'KHG Sebangau - Pulang Pisau, Kalimantan Tengah',
      district: 'Jabiren Raya',
      regency: 'Pulang Pisau',
      province: 'Kalimantan Tengah',
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
      lastSeenAt: new Date().toISOString(),
    },
    {
      id: 'node-kal-02',
      nodeCode: 'GP-KAL-02',
      name: 'Stasiun KHG Sungai Kapuas–Terentang',
      sector: 'KHG Kubu Raya - Rasau Jaya, Kalimantan Barat',
      district: 'Rasau Jaya',
      regency: 'Kubu Raya',
      province: 'Kalimantan Barat',
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
      lastSeenAt: new Date().toISOString(),
    },
    {
      id: 'node-sum-01',
      nodeCode: 'GP-SUM-01',
      name: 'Stasiun KHG Pulau Padang Utara',
      sector: 'KHG Pulau Padang - Kepulauan Meranti, Riau',
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
      lastSeenAt: new Date().toISOString(),
    },
    {
      id: 'node-sum-02',
      nodeCode: 'GP-SUM-02',
      name: 'Stasiun KHG Sungai Sugihan–Sungai Lumpur',
      sector: 'KHG Ogan Komering Ilir (OKI) - Sumatera Selatan',
      district: 'Pampangan',
      regency: 'Ogan Komering Ilir',
      province: 'Sumatera Selatan',
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
      lastSeenAt: new Date().toISOString(),
    },
    {
      id: 'node-sum-03',
      nodeCode: 'GP-SUM-03',
      name: 'Stasiun KHG Londerang–Sungai Kumpeh',
      sector: 'KHG Muaro Jambi - Provinsi Jambi',
      district: 'Kumpeh',
      regency: 'Muaro Jambi',
      province: 'Jambi',
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
      lastSeenAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    if (this.prisma.isConnected) {
      try {
        const dbNodes = await this.prisma.sensorNode.findMany({
          orderBy: { nodeCode: 'asc' },
        });
        if (dbNodes.length > 0) return dbNodes;
      } catch {
        // Fallback to memoryNodes
      }
    }
    return this.memoryNodes;
  }

  async findOne(nodeCode: string) {
    if (this.prisma.isConnected) {
      try {
        const node = await this.prisma.sensorNode.findUnique({ where: { nodeCode } });
        if (node) return node;
      } catch {
        // Fallback
      }
    }
    const found = this.memoryNodes.find((n) => n.nodeCode === nodeCode || n.id === nodeCode);
    if (!found) {
      throw new NotFoundException(`Sensor node ${nodeCode} not found`);
    }
    return found;
  }

  async create(dto: CreateNodeDto) {
    const newNode = {
      id: `node-${Date.now()}`,
      ...dto,
      regency: 'Kepulauan Meranti',
      province: 'Riau',
      peatDepthCm: dto.peatDepthCm ?? 450,
      batteryPercent: 98.0,
      rssiDbm: -72,
      snrDb: 9.5,
      status: 'ONLINE' as const,
      currentRiskStatus: 'AMAN' as const,
      lastWaterLevelTMA: -18.0,
      lastSoilMoisture10cm: 64.0,
      lastSoilMoisture40cm: 72.0,
      lastSurfaceTemp: 29.2,
      lastAirTemp: 30.0,
      lastAirHumidity: 76.0,
      lastPm25: 24.0,
      consecutiveDryDays: 1,
      predictedRiskScore: 15.0,
      lastSeenAt: new Date().toISOString(),
    };

    if (this.prisma.isConnected) {
      try {
        return await this.prisma.sensorNode.create({
          data: {
            nodeCode: newNode.nodeCode,
            name: newNode.name,
            sector: newNode.sector,
            district: newNode.district,
            latitude: newNode.latitude,
            longitude: newNode.longitude,
            peatDepthCm: newNode.peatDepthCm,
          },
        });
      } catch {
        // Fallback to memory
      }
    }

    this.memoryNodes.push(newNode);
    return newNode;
  }

  async update(nodeCode: string, payload: Partial<CreateNodeDto>) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.sensorNode.update({
          where: { nodeCode },
          data: payload,
        });
      } catch {
        // Fallback to memory
      }
    }

    const idx = this.memoryNodes.findIndex((n) => n.nodeCode === nodeCode || n.id === nodeCode);
    if (idx === -1) {
      throw new NotFoundException(`Sensor node ${nodeCode} not found`);
    }
    this.memoryNodes[idx] = { ...this.memoryNodes[idx], ...payload };
    return this.memoryNodes[idx];
  }

  async remove(nodeCode: string) {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.sensorNode.delete({ where: { nodeCode } });
        return { deleted: true, nodeCode };
      } catch {
        // Fallback
      }
    }

    const idx = this.memoryNodes.findIndex((n) => n.nodeCode === nodeCode || n.id === nodeCode);
    if (idx === -1) {
      throw new NotFoundException(`Sensor node ${nodeCode} not found`);
    }
    const removed = this.memoryNodes.splice(idx, 1)[0];
    return { deleted: true, nodeCode: removed.nodeCode };
  }

  async updateNodeFromTelemetry(nodeCode: string, telemetry: Record<string, any>) {
    const idx = this.memoryNodes.findIndex((n) => n.nodeCode === nodeCode);
    if (idx !== -1) {
      this.memoryNodes[idx] = {
        ...this.memoryNodes[idx],
        currentRiskStatus: telemetry.riskStatus,
        lastWaterLevelTMA: telemetry.waterLevelTMA,
        lastSoilMoisture10cm: telemetry.soilMoisture10cm,
        lastSoilMoisture40cm: telemetry.soilMoisture40cm,
        lastSurfaceTemp: telemetry.surfaceTemp,
        lastAirTemp: telemetry.airTemp,
        lastAirHumidity: telemetry.airHumidity,
        lastPm25: telemetry.pm25,
        consecutiveDryDays: telemetry.consecutiveDryDays,
        predictedRiskScore: telemetry.predictedRiskScore,
        rssiDbm: telemetry.rssiDbm ?? this.memoryNodes[idx].rssiDbm,
        batteryPercent: telemetry.batteryPercent ?? this.memoryNodes[idx].batteryPercent,
        lastSeenAt: new Date().toISOString(),
      };
    }

    if (this.prisma.isConnected) {
      try {
        await this.prisma.sensorNode.update({
          where: { nodeCode },
          data: {
            currentRiskStatus: telemetry.riskStatus,
            lastWaterLevelTMA: telemetry.waterLevelTMA,
            lastSoilMoisture10cm: telemetry.soilMoisture10cm,
            lastSoilMoisture40cm: telemetry.soilMoisture40cm,
            lastSurfaceTemp: telemetry.surfaceTemp,
            lastAirTemp: telemetry.airTemp,
            lastAirHumidity: telemetry.airHumidity,
            lastPm25: telemetry.pm25,
            consecutiveDryDays: telemetry.consecutiveDryDays,
            predictedRiskScore: telemetry.predictedRiskScore,
            lastSeenAt: new Date(),
          },
        });
      } catch {
        // Ignore if node doesn't exist in DB
      }
    }
  }
}

