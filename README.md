# Tugas 2 – REST API Produk dengan Prisma

REST API CRUD produk menggunakan **Express.js**, **TypeScript**, **Prisma ORM**, dan **PostgreSQL (Neon)**.

## Setup
1. Install dependensi
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env`, lalu isi connection string Neon
   ```env
   DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require"
   DIRECT_URL="postgresql://.../neondb?sslmode=require"
   PORT=4000
   ```
3. Generate Prisma Client, migrasi, dan seed data awal
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```
4. Jalankan server
   ```bash
   npm run dev
   ```
   Server berjalan di http://localhost:4000

## Endpoint

| Method | Endpoint | Body | Keterangan |
|---|---|---|---|
| GET | `/api/products` | – | Menampilkan seluruh data |
| POST | `/api/products` | `{ "name": "Pulpen", "price": 5000 }` | Membuat data baru |
| PUT | `/api/products` | `{ "id": 1, "name": "Pulpen Gel", "price": 7000 }` | Mengupdate data (body sama dengan POST + id) |
| DELETE | `/api/products/:id` | – | Menghapus data berdasarkan id |

Format response:
```json
{ "status": true, "message": "Berhasil mengambil data produk", "data": [] }
```

## Validasi
| Kondisi | Status | Pesan |
|---|---|---|
| `name` kosong / tidak ada | 400 | Nama produk wajib diisi |
| `price` kosong, bukan angka, atau ≤ 0 | 400 | Harga harus berupa bilangan bulat lebih dari 0 |
| `id` kosong / tidak valid | 400 | ID produk wajib diisi dan harus berupa bilangan bulat lebih dari 0 |
| `id` tidak ada di database | 404 | Produk dengan id X tidak ditemukan |
| Body bukan JSON yang valid | 400 | Format JSON tidak valid |
| Endpoint tidak terdaftar | 404 | Endpoint ... tidak ditemukan |
