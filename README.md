# ⚡ ZApp API – Backend

**ZApp API** adalah backend service yang mendukung aplikasi **ZApp**, dibangun menggunakan **Express.js** dan **Sequelize ORM**.  
API ini menyediakan endpoint untuk autentikasi, manajemen data, serta integrasi dengan database yang fleksibel.

---

## 🚀 Teknologi Utama
- ⚡ **Express.js** – framework web server minimalis & cepat.
- 🗄️ **Sequelize ORM** – untuk migrasi, seeding, dan manajemen database.
- 🛠️ **Husky & Prettier** – menjaga kualitas kode dan konsistensi format.

---

## 📦 Setup

Clone repository & install dependencies:

```bash
pnpm install
```

---

## 🛠️ Script yang Tersedia

| Script                        | Perintah                                                       | Deskripsi                                                                 |
|-------------------------------|----------------------------------------------------------------|---------------------------------------------------------------------------|
| `format`                      | `pnpm format`                                                  | Memformat kode menggunakan **Prettier**.                                  |
| `lint`                        | `pnpm lint`                                                    | Mengecek kode dengan **ESLint**, tidak boleh ada warning.                 |
| `prepare`                     | `pnpm prepare`                                                 | Install hook **Husky**.                                                   |
| `migrate:dev`                 | `pnpm migrate:dev`                                             | Menjalankan migrasi database di environment development.                  |
| `migrate:dev:undo:all`        | `pnpm migrate:dev:undo:all`                                    | Menghapus semua migrasi di development.                                   |
| `migrate:prod`                | `pnpm migrate:prod`                                            | Menjalankan migrasi database di production.                               |
| `migrate:prod:undo:all`       | `pnpm migrate:prod:undo:all`                                   | Menghapus semua migrasi di production.                                    |
| `migrate:staging`             | `pnpm migrate:staging`                                         | Menjalankan migrasi database di staging.                                  |
| `migrate:staging:undo:all`    | `pnpm migrate:staging:undo:all`                                | Menghapus semua migrasi di staging.                                       |
| `seed:dev`                    | `pnpm seed:dev`                                                | Menjalankan seed database di development.                                 |
| `seed:prod`                   | `pnpm seed:prod`                                               | Menjalankan seed database di production.                                  |
| `seed:staging`                | `pnpm seed:staging`                                            | Menjalankan seed database di staging.                                     |
| `start:dev`                   | `pnpm start:dev`                                               | Menjalankan server Express di mode development.                           |
| `start:prod`                  | `pnpm start:prod`                                              | Menjalankan server Express di mode production.                            |
| `start:staging`               | `pnpm start:staging`                                           | Menjalankan server Express di mode staging.                               |

---

## 🚦 Cara Menjalankan

Jalankan server di mode development:
```bash
pnpm start:dev
```

Jalankan migrasi database:
```bash
pnpm migrate:dev
```

Jalankan seeding data awal:
```bash
pnpm seed:dev
```

Menjalankan server di production:
```bash
pnpm start:prod
```

---

## 📖 Roadmap

- [ ] Tambah dokumentasi Swagger untuk API.
- [ ] Implementasi autentikasi JWT.
- [ ] Tambah pengujian otomatis dengan Jest.  
