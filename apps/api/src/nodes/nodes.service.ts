import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';

@Injectable()
export class NodesService {
  private memoryNodes: any[] = [
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
      lastSeenAt: new Date().toISOString(),
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
      lastSeenAt: new Date().toISOString(),
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
      lastSeenAt: new Date().toISOString(),
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
      lastSeenAt: new Date().toISOString(),
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

