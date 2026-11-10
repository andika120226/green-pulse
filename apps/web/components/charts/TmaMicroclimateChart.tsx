'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { TimeSeriesPoint } from '@/lib/mock-data';
import { TrendingDown, Flame, AlertTriangle } from 'lucide-react';

interface TmaMicroclimateChartProps {
  data: TimeSeriesPoint[];
  selectedNodeCode?: string;
}

export default function TmaMicroclimateChart({
  data,
  selectedNodeCode = 'GP-KHG-01',
}: TmaMicroclimateChartProps) {
  const latest = data[data.length - 1] || {
    waterLevelTMA: -64.5,
    surfaceTemp: 38.6,
    soilMoisture10cm: 28.4,
    predictedRiskScore: 94.2,
  };

  return (
    <div className="eco-card rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono font-bold">
              ANALITIK 14 HARI KEMARAU
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              Stasiun: {selectedNodeCode}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-emerald-950 mt-1">
            Degradasi TMA Gambut (cm) vs Kenaikan Suhu Permukaan (°C)
          </h3>
          <p className="text-xs text-slate-600">
            Korelasi inversi penyusutan muka air tanah gambut terhadap anomali termal & ambang regulasi BRGM (-40 cm)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
            <span className="text-slate-600">TMA:</span>
            <span className="text-red-600 font-bold">
              {latest.waterLevelTMA} cm
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-slate-600">Suhu:</span>
            <span className="text-orange-600 font-bold">
              {latest.surfaceTemp}°C
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[310px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
          >
            <defs>
              <linearGradient id="tmaFreshGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.32} />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#475569"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[-75, 0]}
              stroke="#059669"
              fontSize={11}
              tickFormatter={(v) => `${v}cm`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[25, 44]}
              stroke="#EA580C"
              fontSize={11}
              tickFormatter={(v) => `${v}°C`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#A7F3D0',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#0F172A',
                boxShadow: '0 8px 24px rgba(6, 78, 59, 0.12)',
              }}
              labelStyle={{ color: '#064E3B', fontWeight: 700 }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                paddingTop: '8px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: '#1E293B',
              }}
            />

            {/* Garis Merah Putus-Putus Batas Regulasi BRGM (-40 cm) */}
            <ReferenceLine
              yAxisId="left"
              y={-40}
              stroke="#DC2626"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: 'Batas Regulasi BRGM (-40 cm)',
                position: 'insideBottomLeft',
                fill: '#DC2626',
                fontSize: 11,
                fontWeight: 700,
              }}
            />

            {/* Ambang Kritis Bawah Permukaan (-60 cm) */}
            <ReferenceLine
              yAxisId="left"
              y={-60}
              stroke="#EA580C"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: 'Batas Kritis (-60 cm)',
                position: 'insideTopLeft',
                fill: '#EA580C',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="waterLevelTMA"
              name="TMA Gambut (cm)"
              stroke="#059669"
              strokeWidth={2.5}
              fill="url(#tmaFreshGradient)"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="surfaceTemp"
              name="Suhu Permukaan (°C)"
              stroke="#EA580C"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#EF4444', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#DC2626' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
        <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          Peringatan: TMA menembus -60 cm sejak H-3 disertai suhu permukaan &gt; 36°C
        </span>
        <span className="text-emerald-800 font-semibold">
          Model Inferensi: XGBoost v2.4 (R² = 0.942)
        </span>
      </div>
    </div>
  );
}
