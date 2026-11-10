# GREEN PULSE — Cloud Deployment & Local PostgreSQL Checklist (Skill Agent 07)

Panduan lengkap inisialisasi database lokal `green_pulse_db`, pengujian otomatis (`Jest`), simulasi AIoT sensor *real-time*, hingga proses *deployment* ke **Vercel** untuk proyek **GREEN PULSE**.

---

## 1. Persiapan Database Lokal PostgreSQL (`green_pulse_db`)

1. Pastikan layanan PostgreSQL berjalan pada port `5432`, kemudian buat database baru bernama `green_pulse_db`:
   ```sql
   CREATE DATABASE green_pulse_db;
   ```
2. Pastikan file environment `/apps/api/.env` dan `/apps/web/.env.local` berisi konfigurasi berikut:
   ```env
   DATABASE_URL="postgresql://postgres:12345678@localhost:5432/green_pulse_db?schema=public"
   NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
   NEXT_PUBLIC_WS_URL="http://localhost:4000"
   NEXT_PUBLIC_APP_NAME="GREEN PULSE"
   JWT_SECRET="green_pulse_super_secret_key_2026"
   PORT=4000
   ```
3. Jalankan generasi Prisma Client, sinkronisasi skema, dan *seeder* data KHG Kepulauan Meranti:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

---

## 2. Menjalankan Aplikasi Secara Lokal & Simulasi Real-Time

1. **Jalankan Backend NestJS (Port 4000 + Swagger Docs):**
   ```bash
   npm run dev:api
   ```
   - Endpoint REST API: `http://localhost:4000/api/v1`
   - Dokumentasi Swagger: `http://localhost:4000/api/docs`

2. **Jalankan Frontend Next.js 14 WebGIS & Mobile PWA (Port 3000):**
   ```bash
   npm run dev:web
   ```
   - Halaman Utama Command Center WebGIS: `http://localhost:3000/dashboard`
   - Halaman Aplikasi Mobile Warga/MPA: `http://localhost:3000/mobile-app`

3. **Jalankan Simulator Sensor AIoT LoRaWAN (Setiap 5 Detik):**
   ```bash
   npm --prefix apps/api run simulate
   ```

4. **Jalankan Pengujian Unit & Black-Box (`Jest`):**
   ```bash
   npm test:api
   ```

---

## 3. Langkah Deployment ke Produksi (Vercel CI/CD)

### A. Cloud PostgreSQL (Supabase / Neon / Railway)
1. Buat proyek PostgreSQL baru di Supabase/Neon/Railway.
2. Salin Connection String URI dan jalankan migrasi dari lokal ke database cloud:
   ```bash
   DATABASE_URL="postgresql://user:pass@cloud-host:5432/green_pulse_db?sslmode=require" npx prisma db push --schema=apps/api/prisma/schema.prisma
   ```

### B. Deploy Backend NestJS (`apps/api`) ke Vercel Serverless
1. Impor repositori ke Vercel dan pilih Root Directory: `apps/api`.
2. File `apps/api/vercel.json` dan entry point serverless `apps/api/api/index.ts` telah dikonfigurasi otomatis.
3. Tambahkan **Environment Variables** di Dashboard Vercel:
   - `DATABASE_URL` = *(URI Cloud PostgreSQL)*
   - `JWT_SECRET` = `green_pulse_super_secret_key_2026`
4. Klik **Deploy**. Catat URL produksi backend (mis. `https://green-pulse-api.vercel.app`).

### C. Deploy Frontend Next.js (`apps/web`) ke Vercel
1. Buat project baru di Vercel dan pilih Root Directory: `apps/web`.
2. Komponen peta interaktif `PeatlandWebGIS` sudah dibungkus dengan `dynamic(() => import('@/components/map/PeatlandWebGIS'), { ssr: false })` pada `apps/web/app/dashboard/page.tsx` sehingga bebas dari error `window is not defined` saat proses *build* SSR.
3. Tambahkan **Environment Variables** di Dashboard Vercel:
   - `NEXT_PUBLIC_API_URL` = `https://green-pulse-api.vercel.app/api/v1`
   - `NEXT_PUBLIC_WS_URL` = `https://green-pulse-api.vercel.app`
   - `NEXT_PUBLIC_APP_NAME` = `GREEN PULSE`
4. Klik **Deploy**.

