import { Test, TestingModule } from '@nestjs/testing';
import { RiskInferenceService } from './risk-inference.service';

describe('RiskInferenceService (BRGM & AI XGBoost Threshold Verification)', () => {
  let service: RiskInferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskInferenceService],
    }).compile();

    service = module.get<RiskInferenceService>(RiskInferenceService);
  });

  it('should classify AMAN when waterLevelTMA > -20 cm', () => {
    const result = service.evaluatePeatRisk({
      waterLevelTMA: -14.8,
      soilMoisture10cm: 68.5,
      surfaceTemp: 28.9,
      consecutiveDryDays: 2,
    });

    expect(result.riskStatus).toBe('AMAN');
    expect(result.predictedRiskScore).toBeLessThan(25);
  });

  it('should classify WASPADA when -20 >= waterLevelTMA > -40 cm', () => {
    const boundaryTop = service.evaluatePeatRisk({
      waterLevelTMA: -20.0,
      soilMoisture10cm: 52.0,
      surfaceTemp: 31.5,
      consecutiveDryDays: 5,
    });
    const midRange = service.evaluatePeatRisk({
      waterLevelTMA: -32.6,
      soilMoisture10cm: 46.2,
      surfaceTemp: 32.8,
      consecutiveDryDays: 6,
    });

    expect(boundaryTop.riskStatus).toBe('WASPADA');
    expect(midRange.riskStatus).toBe('WASPADA');
    expect(midRange.predictedRiskScore).toBeGreaterThanOrEqual(30);
    expect(midRange.predictedRiskScore).toBeLessThan(65);
  });

  it('should classify SIAGA when -40 >= waterLevelTMA > -60 cm', () => {
    const boundaryBrgm = service.evaluatePeatRisk({
      waterLevelTMA: -40.0,
      soilMoisture10cm: 40.0,
      surfaceTemp: 34.0,
      consecutiveDryDays: 9,
    });
    const deepSiaga = service.evaluatePeatRisk({
      waterLevelTMA: -48.2,
      soilMoisture10cm: 36.8,
      surfaceTemp: 35.1,
      consecutiveDryDays: 10,
    });

    expect(boundaryBrgm.riskStatus).toBe('SIAGA');
    expect(deepSiaga.riskStatus).toBe('SIAGA');
    expect(deepSiaga.predictedRiskScore).toBeGreaterThanOrEqual(60);
  });

  it('should classify KRITIS when waterLevelTMA <= -60 cm AND soilMoisture10cm < 35% AND surfaceTemp > 36°C', () => {
    const criticalResult = service.evaluatePeatRisk({
      waterLevelTMA: -64.5,
      soilMoisture10cm: 28.4,
      surfaceTemp: 38.6,
      consecutiveDryDays: 14,
    });

    expect(criticalResult.riskStatus).toBe('KRITIS');
    expect(criticalResult.predictedRiskScore).toBeGreaterThanOrEqual(88);
    expect(criticalResult.predictedRiskScore).toBeLessThanOrEqual(100);
  });

  it('should retain SIAGA if waterLevelTMA <= -60 cm but soilMoisture10cm >= 35% or surfaceTemp <= 36°C', () => {
    const result = service.evaluatePeatRisk({
      waterLevelTMA: -61.5,
      soilMoisture10cm: 39.0, // Not < 35%
      surfaceTemp: 34.5, // Not > 36°C
      consecutiveDryDays: 8,
    });

    expect(result.riskStatus).toBe('SIAGA');
  });
});

