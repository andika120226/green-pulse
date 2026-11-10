'use client';

import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import {
  SensorNodeData,
  CitizenReportData,
  CommunityProposalData,
} from '@/lib/mock-data';
import {
  Flame,
  Radio,
  ShieldCheck,
  Navigation,
  Camera,
  CheckCircle2,
  Layers,
  ThumbsUp,
  Droplets,
  MapPin,
  PlusCircle,
  Compass,
} from 'lucide-react';

interface PeatlandWebGISProps {
  nodes: SensorNodeData[];
  reports: CitizenReportData[];
  proposals?: CommunityProposalData[];
  onVerifyAndDispatch: (reportId: string) => void;
  onConfirmReport?: (reportId: string) => void;
  onSelectNode?: (nodeCode: string) => void;
  onPickMapCoordinates?: (lat: number, lng: number) => void;
  onOpenReportModalWithCoords?: (lat: number, lng: number) => void;
}

const RISK_COLORS: Record<SensorNodeData['currentRiskStatus'], string> = {
  AMAN: '#10B981',
  WASPADA: '#F59E0B',
  SIAGA: '#F97316',
  KRITIS: '#EF4444',
};

function MapClickCoordinatePicker({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(
        Number(e.latlng.lat.toFixed(4)),
        Number(e.latlng.lng.toFixed(4)),
      );
    },
  });
  return null;
}

function MapViewportController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.1 });
  }, [center, zoom, map]);
  return null;
}

export default function PeatlandWebGIS({
  nodes,
  reports,
  proposals = [],
  onVerifyAndDispatch,
  onConfirmReport,
  onSelectNode,
  onPickMapCoordinates,
  onOpenReportModalWithCoords,
}: PeatlandWebGISProps) {
  const [showHeatzones, setShowHeatzones] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showProposals, setShowProposals] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<'standard' | 'satellite'>(
    'standard',
  );
  const [regionFocus, setRegionFocus] = useState<
    'ALL' | 'SUMATERA' | 'KALIMANTAN'
  >('ALL');
  const [viewState, setViewState] = useState<{
    center: [number, number];
    zoom: number;
  }>({
    // Default overview covering both Sumatera & Kalimantan
    center: [-1.25, 108.8],
    zoom: 5,
  });
  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  function handleRegionSwitch(region: 'ALL' | 'SUMATERA' | 'KALIMANTAN') {
    setRegionFocus(region);
    if (region === 'ALL') {
      setViewState({ center: [-1.25, 108.8], zoom: 5 });
    } else if (region === 'SUMATERA') {
      setViewState({ center: [-1.2, 103.8], zoom: 6 });
    } else {
      setViewState({ center: [-1.8, 112.5], zoom: 6 });
    }
  }

  function handleMapClick(lat: number, lng: number) {
    setClickedCoords({ lat, lng });
    if (onPickMapCoordinates) {
      onPickMapCoordinates(lat, lng);
    }
  }

  return (
    <div className="eco-card rounded-2xl p-4 flex flex-col h-full relative overflow-hidden">
      {/* Header & Interactive Layer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              WEBGIS NASIONAL — SUMATERA & KALIMANTAN
            </span>
            <span className="text-xs font-mono text-slate-500">
              Klik pada peta untuk memilih titik koordinat laporan
            </span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-emerald-950 mt-0.5">
            Peta Sebaran Titik Rawan Karhutla Gambut Sumatera & Kalimantan
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowHeatzones((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showHeatzones
                ? 'bg-red-50 border-red-400 text-red-700 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
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
                ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Pin Crowdsourcing ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setShowProposals((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showProposals
                ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Usulan Sekat/Sumur ({proposals.length})
          </button>
          <button
            type="button"
            onClick={() =>
              setSelectedLayer((l) =>
                l === 'standard' ? 'satellite' : 'standard',
              )
            }
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold ${
              selectedLayer === 'satellite'
                ? 'bg-emerald-900 border-emerald-950 text-white shadow-sm'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {selectedLayer === 'standard' ? 'Peta Satelit' : 'Peta Standar'}
          </button>
        </div>
      </div>

      {/* Quick Region Focus Bar: Sumatera & Kalimantan */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
        <span className="font-mono font-bold text-emerald-950 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-700" />
          Fokus Pantauan Wilayah Rawan Karhutla:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          <button
            type="button"
            onClick={() => handleRegionSwitch('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              regionFocus === 'ALL'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Semua (Sumatera & Kalimantan)
          </button>
          <button
            type="button"
            onClick={() => handleRegionSwitch('KALIMANTAN')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              regionFocus === 'KALIMANTAN'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-emerald-200 hover:bg-red-50'
            }`}
          >
            🔥 Kalimantan (Kalteng, Kalbar, Kalsel)
          </button>
          <button
            type="button"
            onClick={() => handleRegionSwitch('SUMATERA')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              regionFocus === 'SUMATERA'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-emerald-200 hover:bg-orange-50'
            }`}
          >
            🔥 Sumatera (Riau, Sumsel OKI, Jambi)
          </button>
        </div>
      </div>

      {/* Clicked Coordinate Interactive Action Strip */}
      {clickedCoords && (
        <div className="mb-2.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono text-amber-950">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Titik Dipilih: <strong>{clickedCoords.lat}°, {clickedCoords.lng}°</strong>
            </span>
          </div>
          {onOpenReportModalWithCoords && (
            <button
              type="button"
              onClick={() =>
                onOpenReportModalWithCoords(clickedCoords.lat, clickedCoords.lng)
              }
              className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Lapor Titik Api di Koordinat Ini
            </button>
          )}
        </div>
      )}

      {/* Main Map Container */}
      <div className="relative w-full h-[430px] rounded-xl overflow-hidden border border-emerald-200 shadow-inner">
        <MapContainer
          center={viewState.center}
          zoom={viewState.zoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <MapViewportController
            center={viewState.center}
            zoom={viewState.zoom}
          />
          <MapClickCoordinatePicker onMapClick={handleMapClick} />

          {/* 100% Free Tile Providers without API Key Requirement */}
          {selectedLayer === 'standard' ? (
            <TileLayer
              key="osm-standard"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              key="esri-satellite"
              attribution='&copy; Esri World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {/* 1. Render Heatzone Interpolation Circles & Sensor Node Markers */}
          {nodes.map((node) => {
            const color = RISK_COLORS[node.currentRiskStatus] || '#10B981';
            // Radius scaled so heatzones are clearly visible across Sumatera & Kalimantan
            const heatRadius =
              node.currentRiskStatus === 'KRITIS'
                ? 42000
                : node.currentRiskStatus === 'SIAGA'
                ? 32000
                : node.currentRiskStatus === 'WASPADA'
                ? 24000
                : 16000;

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
                        node.currentRiskStatus === 'KRITIS' ? 0.28 : 0.18,
                      weight: 2,
                      dashArray:
                        node.currentRiskStatus === 'KRITIS' ? undefined : '6 4',
                    }}
                  />
                )}

                <CircleMarker
                  center={[node.latitude, node.longitude]}
                  radius={node.currentRiskStatus === 'KRITIS' ? 11 : 9}
                  pathOptions={{
                    color: '#FFFFFF',
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
                  <Popup>
                    <div className="w-64 space-y-2.5 text-slate-800 p-1">
                      <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                        <span className="font-mono font-bold text-xs text-emerald-800 flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-emerald-600" />
                          {node.nodeCode} ({node.island})
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${color}20`,
                            color,
                            border: `1px solid ${color}`,
                          }}
                        >
                          STATUS: {node.currentRiskStatus}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-emerald-950">
                          {node.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {node.sector} — Prov. {node.province}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 font-mono text-xs bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/80">
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            TMA Gambut
                          </span>
                          <span className="font-bold" style={{ color }}>
                            {node.lastWaterLevelTMA} cm
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            Kelembaban 10cm
                          </span>
                          <span className="font-bold text-slate-800">
                            {node.lastSoilMoisture10cm}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            Suhu Permukaan
                          </span>
                          <span className="font-bold text-orange-600">
                            {node.lastSurfaceTemp}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            Skor AI XGBoost
                          </span>
                          <span className="font-bold text-red-600">
                            {node.predictedRiskScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>
                          GPS: {node.latitude.toFixed(4)},{' '}
                          {node.longitude.toFixed(4)}
                        </span>
                        <span>PM2.5: {node.lastPm25} µg/m³</span>
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
              const pinColor = isDispatched ? '#059669' : '#D97706';

              return (
                <CircleMarker
                  key={rep.id}
                  center={[rep.latitude + 0.04, rep.longitude + 0.04]}
                  radius={9}
                  pathOptions={{
                    color: '#FFFFFF',
                    weight: 2.5,
                    fillColor: pinColor,
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <div className="w-72 space-y-2.5 text-slate-800 p-1">
                      <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                        <span className="font-mono font-bold text-xs text-amber-700">
                          {rep.reportCode}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-semibold">
                          EXIF & Anti-Mock OK
                        </span>
                      </div>

                      {/* Visual Smoke Proof Thumbnail with Watermark */}
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-emerald-200 bg-slate-100">
                        <img
                          src={rep.photoUrl}
                          alt={rep.sector}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2 font-mono text-[9px]">
                          <span className="text-emerald-300 font-bold">
                            GREEN PULSE VERIFIED • ±{rep.gpsAccuracyMeters}m
                          </span>
                          <span className="text-white">
                            LAT {rep.latitude.toFixed(4)}° • LON{' '}
                            {rep.longitude.toFixed(4)}°
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-xs text-emerald-950">
                          {rep.sector}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          &ldquo;{rep.description}&rdquo;
                        </p>
                      </div>

                      <div className="text-[10px] font-mono bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 space-y-0.5 text-slate-700">
                        <div>
                          Pelapor:{' '}
                          <strong className="text-emerald-950">
                            {rep.reporterName}
                          </strong>
                        </div>
                        <div>
                          Kluster Spasial:{' '}
                          <strong className="text-amber-700">
                            {rep.clusterGroupId}
                          </strong>
                        </div>
                        <div>
                          Konfirmasi Warga Sekitar:{' '}
                          <strong className="text-emerald-700">
                            {rep.communityConfirmations || 1} Warga
                          </strong>
                        </div>
                      </div>

                      {onConfirmReport && (
                        <button
                          type="button"
                          onClick={() => onConfirmReport(rep.id)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-amber-700" />
                          Saya Juga Melihat Asap Ini (+
                          {rep.communityConfirmations || 1})
                        </button>
                      )}

                      {rep.status !== 'DISPATCHED' ? (
                        <button
                          type="button"
                          onClick={() => onVerifyAndDispatch(rep.id)}
                          className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Verifikasi & Terjunkan Manggala Agni
                        </button>
                      ) : (
                        <div className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {rep.dispatchedTeam || 'Manggala Agni Diterjunkan'}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

          {/* 3. Render Community Proposed Canal Blocks / Boreholes */}
          {showProposals &&
            proposals.map((prop) => (
              <CircleMarker
                key={prop.id}
                center={[prop.latitude, prop.longitude]}
                radius={7}
                pathOptions={{
                  color: '#FFFFFF',
                  weight: 2,
                  fillColor: '#0D9488',
                  fillOpacity: 0.95,
                }}
              >
                <Popup>
                  <div className="w-60 space-y-1.5 text-slate-800 p-1">
                    <div className="flex items-center justify-between border-b border-teal-100 pb-1">
                      <span className="font-mono font-bold text-[11px] text-teal-800">
                        {prop.proposalCode}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[10px] font-bold">
                        {prop.infrastructureType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-emerald-950">
                      {prop.villageName}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {prop.reason}
                    </p>
                    <div className="text-[10px] font-mono text-teal-800 pt-1 border-t border-teal-100 flex justify-between">
                      <span>Pengusul: {prop.proposerName}</span>
                      <strong>👍 {prop.votes} Dukungan</strong>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          {/* 4. Render Clicked Coordinate Marker */}
          {clickedCoords && (
            <CircleMarker
              center={[clickedCoords.lat, clickedCoords.lng]}
              radius={8}
              pathOptions={{
                color: '#064E3B',
                weight: 2.5,
                fillColor: '#10B981',
                fillOpacity: 1,
              }}
            />
          )}
        </MapContainer>

        {/* Floating Clean Botanical Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md border border-emerald-200 shadow-lg p-3 rounded-xl text-[11px] font-mono space-y-1.5 max-w-xs text-slate-700">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            LEGENDA STATUS TMA GAMBUT (BRGM)
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>AMAN (&gt; -20cm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>WASPADA (-20..-40)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span>SIAGA (-40..-60)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              <span className="text-red-600 font-bold">KRITIS (&le; -60cm)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
