import * as crypto from 'crypto';

/**
 * GREEN PULSE Live AIoT Sensor Node Simulator (Skill Agent 06)
 * Periodically dispatches realistic LoRaWAN telemetry packets (TMA decline & surface temp rise)
 * every 5 seconds to http://localhost:4000/api/v1/telemetry with HMAC-SHA256 payload signatures.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'green_pulse_super_secret_key_2026';

interface SimulatedNodeState {
  nodeCode: string;
  waterLevelTMA: number;
  soilMoisture10cm: number;
  surfaceTemp: number;
  pm25: number;
  consecutiveDryDays: number;
}

const activeNodes: SimulatedNodeState[] = [
  {
    nodeCode: 'GP-KHG-01',
    waterLevelTMA: -64.5,
    soilMoisture10cm: 28.4,
    surfaceTemp: 38.6,
    pm25: 168,
    consecutiveDryDays: 14,
  },
  {
    nodeCode: 'GP-KHG-02',
    waterLevelTMA: -48.2,
    soilMoisture10cm: 36.8,
    surfaceTemp: 35.1,
    pm25: 94,
    consecutiveDryDays: 10,
  },
  {
    nodeCode: 'GP-KHG-05',
    waterLevelTMA: -62.1,
    soilMoisture10cm: 30.1,
    surfaceTemp: 37.9,
    pm25: 152,
    consecutiveDryDays: 14,
  },
];

function computeHmacSignature(
  nodeCode: string,
  tma: number,
  moisture: number,
  temp: number,
): string {
  const canonical = `${nodeCode}:${tma}:${moisture}:${temp}`;
  return crypto.createHmac('sha256', JWT_SECRET).update(canonical).digest('hex');
}

async function dispatchPacket(state: SimulatedNodeState) {
  // Simulate gradual peat drying and temperature fluctuation
  state.waterLevelTMA = Number((state.waterLevelTMA - (Math.random() * 0.4 - 0.1)).toFixed(1));
  state.soilMoisture10cm = Number(
    Math.max(18, state.soilMoisture10cm - (Math.random() * 0.3 - 0.08)).toFixed(1),
  );
  state.surfaceTemp = Number(
    Math.min(44, state.surfaceTemp + (Math.random() * 0.35 - 0.1)).toFixed(1),
  );
  state.pm25 = Math.round(Math.max(25, state.pm25 + (Math.random() * 6 - 2)));

  const signature = computeHmacSignature(
    state.nodeCode,
    state.waterLevelTMA,
    state.soilMoisture10cm,
    state.surfaceTemp,
  );

  const payload = {
    nodeCode: state.nodeCode,
    waterLevelTMA: state.waterLevelTMA,
    soilMoisture10cm: state.soilMoisture10cm,
    soilMoisture40cm: Number((state.soilMoisture10cm + 10.5).toFixed(1)),
    surfaceTemp: state.surfaceTemp,
    airTemp: Number((state.surfaceTemp - 2.5).toFixed(1)),
    airHumidity: 46.5,
    pm25: state.pm25,
    consecutiveDryDays: state.consecutiveDryDays,
    rssiDbm: -74 - Math.floor(Math.random() * 8),
    batteryPercent: 89.2,
    payloadSignature: `hmac-sha256:${signature}`,
  };

  try {
    const response = await fetch(`${API_URL}/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lorawan-signature': signature,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    console.log(
      `📡 [LoRaWAN TX] ${state.nodeCode} | TMA: ${state.waterLevelTMA}cm | Moisture: ${state.soilMoisture10cm}% | Temp: ${state.surfaceTemp}°C -> Status: ${result?.data?.riskStatus} (Risk: ${result?.data?.predictedRiskScore}%)`,
    );
  } catch (err: any) {
    console.error(`⚠️ [LoRaWAN TX Failed] ${state.nodeCode}: ${err.message}`);
  }
}

async function startSimulation() {
  console.log('===================================================================');
  console.log('🔥 GREEN PULSE AIoT LoRaWAN Node Simulator Started (Every 5s)');
  console.log(`🎯 Target Endpoint: ${API_URL}/telemetry`);
  console.log('===================================================================');

  const maxCycles = process.argv.includes('--once') ? 1 : Infinity;
  let cycle = 0;

  while (cycle < maxCycles) {
    cycle++;
    for (const node of activeNodes) {
      await dispatchPacket(node);
    }
    if (cycle < maxCycles) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

startSimulation();

