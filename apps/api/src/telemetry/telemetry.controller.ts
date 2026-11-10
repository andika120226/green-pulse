import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { RiskInferenceService } from './risk-inference.service';
import { PrismaService } from '../prisma/prisma.service';
import { GreenPulseGateway } from '../gateway/green-pulse.gateway';
import { NodesService } from '../nodes/nodes.service';

@ApiTags('Telemetry & AI Risk Inference')
@Controller('telemetry')
export class TelemetryController {
  private memoryTelemetryHistory: any[] = [
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

  constructor(
    private readonly riskInferenceService: RiskInferenceService,
    private readonly prisma: PrismaService,
    private readonly gateway: GreenPulseGateway,
    private readonly nodesService: NodesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Ingest LoRaWAN sensor telemetry packet & execute XGBoost/BRGM risk inference',
  })
  async ingestTelemetry(@Body() dto: CreateTelemetryDto) {
    const inference = this.riskInferenceService.evaluatePeatRisk({
      waterLevelTMA: dto.waterLevelTMA,
      soilMoisture10cm: dto.soilMoisture10cm,
      surfaceTemp: dto.surfaceTemp,
      consecutiveDryDays: dto.consecutiveDryDays ?? 14,
    });

    const record = {
      id: `tel-${Date.now()}`,
      nodeCode: dto.nodeCode,
      waterLevelTMA: dto.waterLevelTMA,
      soilMoisture10cm: dto.soilMoisture10cm,
      soilMoisture40cm: dto.soilMoisture40cm ?? Number((dto.soilMoisture10cm + 10.5).toFixed(1)),
      surfaceTemp: dto.surfaceTemp,
      airTemp: dto.airTemp ?? Number((dto.surfaceTemp - 2.6).toFixed(1)),
      airHumidity: dto.airHumidity ?? 48.0,
      pm25: dto.pm25 ?? 168.0,
      consecutiveDryDays: dto.consecutiveDryDays ?? 14,
      rssiDbm: dto.rssiDbm ?? -74,
      batteryPercent: dto.batteryPercent ?? 89.0,
      riskStatus: inference.riskStatus,
      predictedRiskScore: inference.predictedRiskScore,
      featureContributions: inference.featureContributions,
      recommendation: inference.recommendation,
      payloadSignature: dto.payloadSignature,
      recordedAt: new Date().toISOString(),
    };

    // Update node state in DB or memory
    await this.nodesService.updateNodeFromTelemetry(dto.nodeCode, record);

    if (this.prisma.isConnected) {
      try {
        const node = await this.prisma.sensorNode.findUnique({
          where: { nodeCode: dto.nodeCode },
        });
        if (node) {
          await this.prisma.telemetry.create({
            data: {
              nodeId: node.id,
              waterLevelTMA: record.waterLevelTMA,
              soilMoisture10cm: record.soilMoisture10cm,
              soilMoisture40cm: record.soilMoisture40cm,
              surfaceTemp: record.surfaceTemp,
              airTemp: record.airTemp,
              airHumidity: record.airHumidity,
              pm25: record.pm25,
              consecutiveDryDays: record.consecutiveDryDays,
              rssiDbm: record.rssiDbm,
              batteryPercent: record.batteryPercent,
              riskStatus: record.riskStatus,
              predictedRiskScore: record.predictedRiskScore,
              payloadSignature: record.payloadSignature,
            },
          });
        }
      } catch {
        // Fallback gracefully to in-memory history
      }
    }

    this.memoryTelemetryHistory[this.memoryTelemetryHistory.length - 1] = {
      day: 'Live',
      date: '10 Nov (Live)',
      waterLevelTMA: record.waterLevelTMA,
      soilMoisture10cm: record.soilMoisture10cm,
      soilMoisture40cm: record.soilMoisture40cm,
      surfaceTemp: record.surfaceTemp,
      pm25: record.pm25,
      riskStatus: record.riskStatus,
      predictedRiskScore: record.predictedRiskScore,
      brgmLimit: -40,
    };

    this.gateway.emitTelemetryUpdate(record);

    return {
      status: 'SUCCESS',
      message: 'Telemetry ingested and AI risk inference completed',
      data: record,
    };
  }

  @Get('timeseries')
  @ApiOperation({
    summary: 'Query 14-day historical time-series telemetry for TMA vs Surface Temp analytics chart',
  })
  @ApiQuery({ name: 'nodeCode', required: false, example: 'GP-KHG-01' })
  async getTimeSeries(@Query('nodeCode') nodeCode = 'GP-KHG-01') {
    if (this.prisma.isConnected) {
      try {
        const node = await this.prisma.sensorNode.findUnique({
          where: { nodeCode },
        });
        if (node) {
          const rows = await this.prisma.telemetry.findMany({
            where: { nodeId: node.id },
            orderBy: { recordedAt: 'asc' },
            take: 14,
          });
          if (rows.length > 0) {
            return {
              nodeCode,
              regulatoryThresholdCm: -40,
              criticalThresholdCm: -60,
              series: rows.map((r, idx) => ({
                day: idx === rows.length - 1 ? 'Hari Ini' : `H-${rows.length - 1 - idx}`,
                date: new Date(r.recordedAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                }),
                waterLevelTMA: r.waterLevelTMA,
                soilMoisture10cm: r.soilMoisture10cm,
                soilMoisture40cm: r.soilMoisture40cm,
                surfaceTemp: r.surfaceTemp,
                pm25: r.pm25,
                riskStatus: r.riskStatus,
                predictedRiskScore: r.predictedRiskScore,
                brgmLimit: -40,
              })),
            };
          }
        }
      } catch {
        // Fallback to memory series
      }
    }

    return {
      nodeCode,
      regulatoryThresholdCm: -40,
      criticalThresholdCm: -60,
      series: this.memoryTelemetryHistory,
    };
  }
}

