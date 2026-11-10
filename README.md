# GREEN PULSE — Peatland Wildfire AIoT, WebGIS & Mobile Crowdsourcing Platform

Sistem Peringatan Dini dan Mitigasi Kebakaran Hutan dan Lahan Gambut (Karhutla) Berbasis **AIoT LoRaWAN**, **WebGIS Command Center**, dan **Mobile Crowdsourcing (MPA)** dengan Standar Regulasi BRGM (`-40 cm`) dan Mesin Inferensi Risiko **XGBoost**.

## Struktur Monorepo
- `/apps/web`: Frontend Next.js 14+ (App Router, TypeScript, Tailwind CSS Eco-Pulse Tactical Palette, React-Leaflet WebGIS, Recharts, Mobile Citizen PWA).
- `/apps/api`: Backend NestJS (RESTful API, WebSocket Gateway, Prisma ORM, XGBoost RiskInferenceService, Haversine 500m Spatial Clustering, JWT + RBAC Security).
- `/apps/api/prisma`: Skema PostgreSQL (`green_pulse_db`) dan *seeder* data KHG Kepulauan Meranti, Riau.

## Cara Menjalankan Proyek
Lihat panduan lengkap pada [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) dan laporan pengujian pada [QA_SECURITY_TEST_REPORT.md](./QA_SECURITY_TEST_REPORT.md).
