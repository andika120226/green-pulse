# Laporan Pengujian Keamanan Siber, Unit Test & Black-Box Testing — GREEN PULSE (Bab 4 KTI)

Dokumen ini menyajikan hasil pengujian otomatis (`Jest`) pada modul `RiskInferenceService` (Standar Regulasi BRGM & AI XGBoost) dan `CrowdsourcingService` (Anti-Mock GPS & Haversine Spatial Clustering), serta matriks pengujian *Black-Box* & keamanan API.

---

## 1. Tabel Hasil Pengujian Unit (`risk-inference.service.spec.ts`)

| Kode Uji | Skenario Ambang Batas TMA & Mikroklimat | Input Parameter (`TMA`, `Moisture`, `Temp`, `DryDays`) | Output Ekspektasi | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UT-01** | Kondisi Gambut Basah (Standar BRGM Aman `> -20 cm`) | `TMA: -14.8 cm`, `SM10: 68.5%`, `Temp: 28.9°C`, `Dry: 2 hr` | `AMAN` (`Score < 25%`) | `AMAN` (`11.4%`) | **LULUS (PASS)** |
| **UT-02** | Penurunan Muka Air Awal (`-20 >= TMA > -40 cm`) | `TMA: -32.6 cm`, `SM10: 46.2%`, `Temp: 32.8°C`, `Dry: 6 hr` | `WASPADA` (`30% - 65%`) | `WASPADA` (`48.7%`) | **LULUS (PASS)** |
| **UT-03** | Melewati Ambang Regulasi BRGM (`-40 >= TMA > -60 cm`) | `TMA: -48.2 cm`, `SM10: 36.8%`, `Temp: 35.1°C`, `Dry: 10 hr` | `SIAGA` (`Score >= 60%`) | `SIAGA` (`76.5%`) | **LULUS (PASS)** |
| **UT-04** | Darurat Karhutla Bawah Permukaan (`TMA <= -60 cm` & `SM10 < 35%` & `Temp > 36°C`) | `TMA: -64.5 cm`, `SM10: 28.4%`, `Temp: 38.6°C`, `Dry: 14 hr` | `KRITIS` (`Score >= 88%`) | `KRITIS` (`94.2%`) | **LULUS (PASS)** |
| **UT-05** | Validasi Kondisi Campuran (`TMA <= -60 cm` namun kelembaban `>= 35%`) | `TMA: -61.5 cm`, `SM10: 39.0%`, `Temp: 34.5°C`, `Dry: 8 hr` | `SIAGA` (Tidak memicu false-alarm Kritis) | `SIAGA` (`66.8%`) | **LULUS (PASS)** |

---

## 2. Tabel Pengujian Keamanan & Black-Box API (`crowdsourcing.service.spec.ts` & Guards)

| Kode Uji | Modul / Fitur Keamanan | Skenario Pengujian | Respon Sistem / HTTP Status | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Anti-Mock Location (`CrowdsourcingService`) | Pengiriman laporan warga dengan `isMockLocation: true` (Fake GPS aktif) | `400 Bad Request` — Laporan ditolak otomatis | **LULUS (PASS)** |
| **SEC-02** | Spatial Clustering (`Haversine Formula`) | Dua laporan warga dikirim dalam jarak `80 meter` (`<= 500m`) dan rentang `< 30 menit` | `201 Created` — Digabung otomatis ke `CLUSTER-KHG01-2026A` | **LULUS (PASS)** |
| **SEC-03** | Autentikasi JWT & RBAC (`JwtAuthGuard` + `RolesGuard`) | Akses endpoint `PATCH /api/v1/reports/:id/verify` tanpa token petugas `ADMIN_BPBD` / `MANGGALA_AGNI` | `401 Unauthorized` / `403 Forbidden` | **LULUS (PASS)** |
| **SEC-04** | Integritas Telemetri LoRaWAN (`LorawanHmacMiddleware`) | Paket sensor dikirim ke `POST /api/v1/telemetry` dengan signature `HMAC-SHA256` palsu | `401 Unauthorized` — Injeksi paket sensor ditolak | **LULUS (PASS)** |
| **SEC-05** | Proteksi Anti-Spam DDoS (`@nestjs/throttler`) | Pengiriman laporan beruntun melebihi batas *rate-limit* (10 req/menit per IP) | `429 Too Many Requests` | **LULUS (PASS)** |

