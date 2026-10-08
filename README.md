<h1 align="center">🤖 axybot Core V5</h1>
<p align="center"><b>Framework bot WhatsApp yang modular, ringan, dan mudah dikembangkan.</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-5.0.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/node-%3E%3D22.5-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Baileys-7.x-25D366?style=flat-square&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>

---

## ✨ Fitur
- 🧩 **Sistem command modular**: cukup buat satu file `.js`, command otomatis dimuat
- 🏷️ **Alias command**: satu command bisa punya banyak nama (contoh: `ping` / `p`)
- 🛡️ **Permission bawaan**: `ownerOnly`, `adminOnly` (admin grup), dan `premium`
- 🗂️ **Kategori command**: `general`, `admin`, `owner`
- 🔘 **Native interactive button** (quick reply menu)
- 💾 **Database SQLite** bawaan (`node:sqlite`, tanpa dependency tambahan)
- 👤 **Manajemen user** otomatis
- 🔄 **Auto reconnect** dan session tersimpan, jadi QR cukup di-scan sekali
- 📝 Logger terpusat

## 📋 Persyaratan
- **Node.js v22.5 atau lebih baru** (karena memakai modul bawaan `node:sqlite`)
- Akun WhatsApp (disarankan nomor khusus untuk bot)
- Bisa berjalan di PC, VPS, maupun **Termux (Android)**

## 🚀 Instalasi

```bash
# 1. Clone repository
git clone https://github.com/superrrkyy/axybot.git
cd axybot

# 2. Install dependency
npm install

# 3. Buat file konfigurasi
cp .env.example .env
```

Isi file `.env`:

```env
# Nomor owner (format internasional, tanpa + atau spasi)
OWNER_NUMBER=628123456789

# (Opsional) LID owner, untuk identitas WhatsApp versi baru
OWNER_LID=
```

## ▶️ Menjalankan Bot

```bash
npm start      # mode normal
npm run dev    # mode development (auto-restart dengan nodemon)
```

1. QR code akan muncul di terminal.
2. Buka WhatsApp → **Perangkat Tertaut** → **Tautkan Perangkat**.
3. Scan QR. Jika berhasil, muncul `🟢 WhatsApp Connected`.

Session disimpan di folder `sessions/`. Untuk login ulang, hapus folder tersebut lalu jalankan lagi.

## 💬 Cara Pakai
Ketik nama command langsung di chat (tanpa prefix):

| Command | Alias | Deskripsi |
|---|---|---|
| `menu` | `help` | Menampilkan menu interaktif |
| `ping` | `p` | Mengecek status bot |
| `profile` | – | Menampilkan profil user |

## 📁 Struktur Folder

```
axybot/
├── index.js                 # Entry point
├── src/
│   ├── commands/            # Semua command, dikelompokkan per kategori
│   │   ├── general/         #   menu, ping, profile
│   │   ├── admin/           #   command khusus admin grup
│   │   └── owner/           #   command khusus owner
│   ├── core/
│   │   ├── connection.js    # Koneksi WhatsApp, QR, auto reconnect
│   │   ├── loader.js        # Auto-load command dari folder commands/
│   │   ├── command.js       # Registry, parser & eksekusi command
│   │   ├── message.js       # Handler pesan masuk
│   │   ├── interactive.js   # Handler tombol interaktif
│   │   ├── normalize.js     # Normalisasi data pesan
│   │   ├── permissions.js   # Logika owner / admin / premium
│   │   ├── identity.js      # Identitas owner (nomor / LID)
│   │   └── logger.js
│   ├── middleware/          # Middleware permission
│   ├── database/sqlite.js   # Koneksi SQLite (database/users.db)
│   └── users/               # Manajemen data user
├── sessions/                # Session WhatsApp (diabaikan git)
└── .env                     # Konfigurasi (diabaikan git)
```

## 🧩 Membuat Command Baru
Buat file baru di `src/commands/<kategori>/`, contoh `src/commands/general/halo.js`:

```js
export default {
  name: "halo",
  aliases: ["hai", "hi"],
  description: "Menyapa pengguna",
  category: "general",
  usage: "halo",

  premium: false,     // true = hanya user premium
  ownerOnly: false,   // true = hanya owner
  adminOnly: false,   // true = hanya admin grup

  async execute({ sock, jid, args }) {
    await sock.sendMessage(jid, {
      text: `👋 Halo! ${args?.length ? "Kamu bilang: " + args.join(" ") : ""}`
    });
  }
};
```

Restart bot, dan command `halo` langsung aktif. Tidak perlu mendaftarkannya secara manual.

## ⚠️ Disclaimer
Proyek ini memakai [Baileys](https://github.com/WhiskeySockets/Baileys), library **tidak resmi** WhatsApp, sehingga **ada risiko nomor diblokir**. Gunakan nomor cadangan, jangan gunakan untuk spam, dan patuhi Ketentuan Layanan WhatsApp. Penulis tidak bertanggung jawab atas penyalahgunaan.

## 🤝 Kontribusi
Pull request dan issue sangat diterima!
1. Fork repo ini
2. Buat branch: `git checkout -b fitur-baru`
3. Commit: `git commit -m "feat: tambah fitur X"`
4. Push dan buka Pull Request

## 📄 Lisensi
[MIT](LICENSE) © superrrkyy