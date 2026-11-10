import { Injectable } from '@nestjs/common';

export type PeatRiskStatus = 'AMAN' | 'WASPADA' | 'SIAGA' | 'KRITIS';

export interface TelemetryRiskInput {
  waterLevelTMA: number; // cm (e.g. -64.5)
  soilMoisture10cm: number; // % (e.g. 28.4)
  surfaceTemp: number; // °C (e.g. 38.6)
  consecutiveDryDays?: number; // days without rain
}

export interface RiskInferenceResult {
  riskStatus: PeatRiskStatus;
  predictedRiskScore: number; // 0 - 100%
  featureContributions: {
    tmaWeight: number;
    moistureWeight: number;
    tempWeight: number;
    drySpellWeight: number;
  };
  recommendation: string;
}

@Injectable()
export class RiskInferenceService {
  /**
   * Evaluates peatland wildfire risk status according to BRGM regulatory thresholds
   * and computes simulated XGBoost feature-weighted subsurface fire probability (0-100%).
   */
  evaluatePeatRisk(input: TelemetryRiskInput): RiskInferenceResult {
    const {
      waterLevelTMA,
      soilMoisture10cm,
      surfaceTemp,
      consecutiveDryDays = 0,
    } = input;

    // 1. Determine BRGM & Microclimate Risk Status
    let riskStatus: PeatRiskStatus;

    if (waterLevelTMA > -20) {
      riskStatus = 'AMAN';
    } else if (waterLevelTMA <= -20 && waterLevelTMA > -40) {
      riskStatus = 'WASPADA';
    } else if (waterLevelTMA <= -40 && waterLevelTMA > -60) {
      riskStatus = 'SIAGA';
    } else {
      // waterLevelTMA <= -60 cm
      if (soilMoisture10cm < 35 && surfaceTemp > 36) {
        riskStatus = 'KRITIS';
      } else {
        riskStatus = 'SIAGA';
      }
    }

    // 2. XGBoost Feature-Weighted Subsurface Fire Probability (0 - 100%)
    // Weights: TMA (42%), Soil Moisture 10cm (28%), Surface Temp (20%), Consecutive Dry Days (10%)
    const normalizedTma = Math.min(
      100,
      Math.max(0, ((Math.abs(Math.min(0, waterLevelTMA)) - 10) / 60) * 100),
    );
    const normalizedMoisture = Math.min(
      100,
      Math.max(0, ((75 - soilMoisture10cm) / 55) * 100),
    );
    const normalizedTemp = Math.min(
      100,
      Math.max(0, ((surfaceTemp - 26) / 15) * 100),
    );
    const normalizedDryDays = Math.min(
      100,
      Math.max(0, (consecutiveDryDays / 16) * 100),
    );

    const tmaWeight = Number((normalizedTma * 0.42).toFixed(2));
    const moistureWeight = Number((normalizedMoisture * 0.28).toFixed(2));
    const tempWeight = Number((normalizedTemp * 0.20).toFixed(2));
    const drySpellWeight = Number((normalizedDryDays * 0.10).toFixed(2));

    let rawScore = tmaWeight + moistureWeight + tempWeight + drySpellWeight;

    // Boost non-linear interaction when all three critical thresholds are breached
    if (riskStatus === 'KRITIS') {
      rawScore = Math.max(88.0, Math.min(99.5, rawScore + 8.5));
    }

    const predictedRiskScore = Number(
      Math.min(100, Math.max(0, rawScore)).toFixed(1),
    );

    const recommendationMap: Record<PeatRiskStatus, string> = {
      AMAN: 'Kondisi hidrologis gambut basah dan stabil. Pertahankan operasional sekat kanal normal.',
      WASPADA:
        'Penurunan muka air terdeteksi (-20 s.d. -40 cm). Aktifkan pemantauan pintu sekat kanal desa.',
      SIAGA:
        'Melewati ambang regulasi BRGM (-40 cm). Siagakan regu MPA & buka pompa pembasahan kubah gambut.',
      KRITIS:
        'DARURAT KARHUTLA BAWAH PERMUKAAN! TMA <= -60 cm, kelembaban kritis < 35%, suhu > 36°C. Terjunkan Manggala Agni segera!',
    };

    return {
      riskStatus,
      predictedRiskScore,
      featureContributions: {
        tmaWeight,
        moistureWeight,
        tempWeight,
        drySpellWeight,
      },
      recommendation: recommendationMap[riskStatus],
    };
  }
}

