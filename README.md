# 👔 Interview BackEnd DOT Batch 2

Sebuah REST API Backend untuk studi kasus sistem manajemen Laundry. Dibangun dengan mematuhi prinsip Clean Architecture untuk memastikan keamanan data, skalabilitas, dan kemudahan pengujian. dan Separation Of Concerns

## 🛠️ Tech Stack yang Digunakan
* **Framework:** NestJS (TypeScript)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Security:** JWT (Passport.js) & Bcrypt (Password Hashing)
* **Testing:** Jest & Supertest (End-to-End Testing)

---

## 🏛️ Pattern Yang Digunakan
Aplikasi ini dirancang menggunakan arsitektur terstruktur berskala *Enterprise* untuk memastikan kemudahan pemeliharaan dan skalabilitas:

* **CSR (Controller-Service-Repository) Pattern:**
  * **Controller:** Lapisan terluar yang murni bertanggung jawab untuk menangani *HTTP request/response* dan mengamankan rute.
  * **Service:** Jantung aplikasi. Tempat seluruh *Business Logic* dieksekusi secara independen tanpa campur tangan protokol HTTP.
  * **Repository (via Prisma ORM):** Lapisan *Data Access Layer* (`PrismaService`) yang di-*inject* ke dalam Service menggunakan *Dependency Injection* NestJS, bertugas khusus untuk eksekusi *query* ke database.
* **Data Transfer Object (DTO) & Global Pipes:** Menggunakan `class-validator` dengan konfigurasi `whitelist: true` untuk menolak injeksi *payload* ilegal secara otomatis dari luar (*Mass Assignment Protection*).
* **Server-Side Calculation:** Kalkulasi finansial (seperti total harga cucian berdasarkan berat) diproses mutlak di sisi server (Service Layer). Sistem tidak pernah mempercayai input harga dari *client* demi mencegah manipulasi nota/transaksi.
* **Global Exception Filter:** Menangkap seluruh *error* dari berbagai lapisan (*Controller/Service/Prisma*) dan menyeragamkannya menjadi satu format *response* JSON yang elegan untuk dikonsumsi oleh tim *Frontend*.


## Dokumentasi API (Swagger)
Sistem ini menggunakan Swagger UI untuk dokumentasi endpoint yang interaktif.
Setelah server berjalan, dokumentasi dapat diakses secara lokal melalui browser di alamat:
http://localhost:3000/api/docs

(Catatan Pengujian: Sebagian besar rute dilindungi oleh JwtAuthGuard. Lakukan eksekusi pada rute POST /api/auth/login untuk mendapatkan Bearer Token, lalu tempelkan token tersebut di tombol Authorize pada pojok kanan atas halaman Swagger).

## 🚀 Cara Install & Get Started (Local Setup)
### ⚙️ Prasyarat Sistem (Prerequisites)
Pastikan lingkungan lokal Anda sudah terpasang perangkat lunak berikut:
* **Node.js** (v18 atau lebih baru disarankan)
* **PostgreSQL** (Menyala dan siap menerima koneksi)
* **Git**

### 🛠️ Langkah Instalasi & Eksekusi

**1. Kloning Repositori & Install Dependensi**
Unduh proyek ini ke dalam mesin lokal Anda dan pasang seluruh modul yang dibutuhkan:
```bash
git clone <url-repositori-github-anda>
cd <nama-folder-proyek>
npm install
npm run start:dev
```

# ERD Schema / Database
Skema dirancang menggunakan relasi *One-to-Many* yang dilengkapi dengan proteksi *Cascade Deletion* tingkat database.
![ERD Sistem Laundry](/public/erd.png)