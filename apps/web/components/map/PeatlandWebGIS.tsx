'use client';

import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
} from 'react-leaflet';
import { SensorNodeData, CitizenReportData } from '@/lib/mock-data';
import {
  Flame,
  Radio,
  ShieldCheck,
  Navigation,
  Camera,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface PeatlandWebGISProps {
  nodes: SensorNodeData[];
  reports: CitizenReportData[];
  onVerifyAndDispatch: (reportId: string) => void;
  onSelectNode?: (nodeCode: string) => void;
}

const RISK_COLORS: Record<SensorNodeData['currentRiskStatus'], string> = {
  AMAN: '#10B981',
  WASPADA: '#F59E0B',
  SIAGA: '#F97316',
  KRITIS: '#EF4444',
};

export default function PeatlandWebGIS({
  nodes,
  reports,
  onVerifyAndDispatch,
  onSelectNode,
}: PeatlandWebGISProps) {
  const [showHeatzones, setShowHeatzones] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<'dark' | 'satellite'>('dark');

  // Center around KHG Pulau Padang & Pulau Tebing Tinggi, Kepulauan Meranti, Riau
  const mapCenter: [number, number] = [0.565, 102.61];

  return (
    <div className="tactical-glass rounded-2xl p-4 flex flex-col h-full relative overflow-hidden">
      {/* Header & Layer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-pulse-emerald/15 border border-pulse-emerald/40 text-pulse-emerald text-[11px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-pulse-emerald animate-ping" />
              INTERACTIVE WEBGIS — KHG RIAU
            </span>
            <span className="text-xs font-mono text-moss-white/60">
              EPSG:4326 | Spatial Clustering DBSCAN 500m
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-moss-white mt-0.5">
            Peta Sebaran Stasiun AIoT LoRaWAN, Zona Panas Gambut & Titik Laporan Warga
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowHeatzones((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showHeatzones
                ? 'bg-pulse-crimson/20 border-pulse-crimson text-pulse-crimson font-semibold'
                : 'bg-forest-slate/70 border-forest-border text-moss-white/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Heatzone Radius
          </button>
          <button
            type="button"
            onClick={() => setShowReports((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showReports
                ? 'bg-pulse-amber/20 border-pulse-amber text-pulse-amber font-semibold'
                : 'bg-forest-slate/70 border-forest-border text-moss-white/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Pin Crowdsourcing ({reports.length})
          </button>
          <button
            type="button"
            onClick={() =>
              setSelectedLayer((l) => (l === 'dark' ? 'satellite' : 'dark'))
            }
            className="px-2.5 py-1.5 rounded-lg bg-forest-slate/80 border border-forest-border text-moss-white/80 hover:border-pulse-emerald/50 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-pulse-emerald" />
            {selectedLayer === 'dark' ? 'Peta Satelit' : 'Peta Komando'}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[430px] rounded-xl overflow-hidden border border-forest-border">
        <MapContainer
          center={mapCenter}
          zoom={9}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          {selectedLayer === 'dark' ? (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> Tactical Dark'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; Esri World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {/* 1. Render Heatzone Interpolation Circles & Sensor Node Markers */}
          {nodes.map((node) => {
            const color = RISK_COLORS[node.currentRiskStatus] || '#10B981';
            const heatRadius =
              node.currentRiskStatus === 'KRITIS'
                ? 5500
                : node.currentRiskStatus === 'SIAGA'
                ? 4200
                : node.currentRiskStatus === 'WASPADA'
                ? 3000
                : 2000;

            return (
              <React.Fragment key={node.id}>
                {showHeatzones && (
                  <Circle
                    center={[node.latitude, node.longitude]}
                    radius={heatRadius}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity:
                        node.currentRiskStatus === 'KRITIS' ? 0.28 : 0.16,
                      weight: 1.5,
                      dashArray:
                        node.currentRiskStatus === 'KRITIS' ? undefined : '6 4',
                    }}
                  />
                )}

                <CircleMarker
                  center={[node.latitude, node.longitude]}
                  radius={node.currentRiskStatus === 'KRITIS' ? 11 : 9}
                  pathOptions={{
                    color: '#07120E',
                    weight: 2.5,
                    fillColor: color,
                    fillOpacity: 0.95,
                  }}
                  eventHandlers={{
                    click: () => {
                      if (onSelectNode) onSelectNode(node.nodeCode);
                    },
                  }}
                >
                  <Popup className="tactical-popup">
                    <div className="w-64 space-y-2.5 text-moss-white p-1">
                      <div className="flex items-center justify-between border-b border-forest-border pb-2">
                        <span className="font-mono font-bold text-xs text-pulse-emerald flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5" />
                          {node.nodeCode}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${color}25`,
                            color,
                            border: `1px solid ${color}`,
                          }}
                        >
                          STATUS: {node.currentRiskStatus}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-sm">{node.name}</div>
                        <div className="text-[11px] text-moss-white/60">
                          {node.sector} — Kec. {node.district}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 font-mono text-xs bg-forest-slate/90 p-2 rounded-lg border border-forest-border">
                        <div>
                          <span className="text-[10px] text-moss-white/50 block">
                            TMA Gambut
                          </span>
                          <span
                            className="font-bold"
                            style={{ color }}
                          >
                            {node.lastWaterLevelTMA} cm
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-moss-white/50 block">
                            Kelembaban 10cm
                          </span>
                          <span className="font-bold text-moss-white">
                            {node.lastSoilMoisture10cm}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-moss-white/50 block">
                            Suhu Permukaan
                          </span>
                          <span className="font-bold text-pulse-ember">
                            {node.lastSurfaceTemp}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-moss-white/50 block">
                            Skor AI XGBoost
                          </span>
                          <span className="font-bold text-pulse-crimson">
                            {node.predictedRiskScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-moss-white/60 pt-1">
                        <span>
                          GPS: {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}
                        </span>
                        <span>RSSI: {node.rssiDbm} dBm</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}

          {/* 2. Render Citizen Crowdsourced Fire/Smoke Report Pins */}
          {showReports &&
            reports.map((rep) => {
              const isDispatched = rep.status === 'DISPATCHED';
              const pinColor = isDispatched ? '#10B981' : '#F59E0B';

              return (
                <CircleMarker
                  key={rep.id}
                  center={[rep.latitude + 0.008, rep.longitude + 0.008]}
                  radius={8}
                  pathOptions={{
                    color: '#FFFFFF',
                    weight: 2,
                    fillColor: pinColor,
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <div className="w-72 space-y-2.5 text-moss-white p-1">
                      <div className="flex items-center justify-between border-b border-forest-border pb-1.5">
                        <span className="font-mono font-bold text-xs text-pulse-amber">
                          {rep.reportCode}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-pulse-emerald/20 border border-pulse-emerald/40 text-pulse-emerald text-[10px] font-mono">
                          EXIF & Anti-Mock Verified
                        </span>
                      </div>

                      {/* Visual Smoke Proof Thumbnail with Watermark */}
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-forest-border bg-forest-slate">
                        <img
                          src={rep.photoUrl}
                          alt={rep.sector}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2 font-mono text-[9px]">
                          <span className="text-pulse-emerald font-bold">
                            GREEN PULSE VERIFIED • ±{rep.gpsAccuracyMeters}m
                          </span>
                          <span className="text-moss-white/90">
                            LAT {rep.latitude.toFixed(4)}°N • LON{' '}
                            {rep.longitude.toFixed(4)}°E
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-xs">{rep.sector}</div>
                        <p className="text-[11px] text-moss-white/75 mt-0.5 line-clamp-2">
                          &ldquo;{rep.description}&rdquo;
                        </p>
                      </div>

                      <div className="text-[10px] font-mono bg-forest-slate/90 p-2 rounded border border-forest-border space-y-0.5">
                        <div>
                          Pelapor: <strong className="text-moss-white">{rep.reporterName}</strong>
                        </div>
                        <div>
                          Kluster Spasial:{' '}
                          <strong className="text-pulse-amber">{rep.clusterGroupId}</strong>
                        </div>
                        <div>
                          Status:{' '}
                          <strong className="text-pulse-emerald">{rep.status}</strong>
                        </div>
                      </div>

                      {rep.status !== 'DISPATCHED' ? (
                        <button
                          type="button"
                          onClick={() => onVerifyAndDispatch(rep.id)}
                          className="w-full py-2 px-3 rounded-lg bg-pulse-crimson hover:bg-pulse-crimson/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-crimson-glow transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Verifikasi & Terjunkan Manggala Agni
                        </button>
                      ) : (
                        <div className="w-full py-1.5 px-2.5 rounded-lg bg-pulse-emerald/20 border border-pulse-emerald/40 text-pulse-emerald font-mono text-[11px] flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {rep.dispatchedTeam || 'Manggala Agni Diterjunkan'}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
        </MapContainer>

        {/* Floating Tactical Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] tactical-glass p-3 rounded-xl text-[11px] font-mono space-y-1.5 max-w-xs">
          <div className="font-bold text-moss-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pulse-emerald" />
            LEGENDA STATUS TMA GAMBUT (BRGM)
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pulse-emerald inline-block" />
              <span>AMAN (&gt; -20cm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pulse-amber inline-block" />
              <span>WASPADA (-20..-40)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pulse-ember inline-block" />
              <span>SIAGA (-40..-60)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pulse-crimson animate-ping inline-block" />
              <span className="text-pulse-crimson font-bold">KRITIS (&le; -60cm)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

