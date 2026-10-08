<p align="center">
  <img src="./assets/banner.svg" width="100%" alt="axybot Core V5" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=2800&pause=700&color=4ADE80&center=true&vCenter=true&width=340&height=30&lines=Modular+%E2%80%A2+Ringan+%E2%80%A2+Cepat+%E2%9A%A1;Buat+command+dalam+1+file;Owner+%E2%80%A2+Admin+%E2%80%A2+Premium+%F0%9F%9B%A1%EF%B8%8F" alt="typing" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-5.0.0-7c3aed?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-%E2%89%A522.5-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Baileys-7.x-25D366?style=flat-square&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-7c3aed?style=flat-square" />
  <img src="https://img.shields.io/github/stars/superrrkyy/axybot?style=flat-square&color=7c3aed&logo=github" />
</p>

<p align="center">
  <a href="#-instalasi"><b>Instalasi</b></a> •
  <a href="#-cara-pakai"><b>Cara Pakai</b></a> •
  <a href="#-membuat-command-baru"><b>Buat Command</b></a> •
  <a href="#-struktur-folder"><b>Struktur</b></a>
</p>

---

### ✨ Fitur Utama

- 🧩 **Command modular**: cukup buat 1 file `.js`, otomatis termuat
- 🏷️ **Alias**: satu command banyak nama (`ping` / `p`)
- 🛡️ **Permission bawaan**: `ownerOnly`, `adminOnly`, `premium`
- 🔘 **Tombol interaktif**: menu native quick reply
- 💾 **SQLite bawaan**: memakai `node:sqlite`, tanpa dependency tambahan
- 👤 **Manajemen user** otomatis
- 🔄 **Auto reconnect**: scan QR cukup sekali, session tersimpan
- 📝 **Logger** terpusat

---

### 📋 Persyaratan

> [!NOTE]
> Membutuhkan **Node.js v22.5+** karena memakai modul bawaan `node:sqlite`.
> Bisa dijalankan di **PC, VPS, maupun Termux (Android)**.

---

### 🚀 Instalasi

```bash
git clone https://github.com/superrrkyy/axybot.git
cd axybot
npm install
cp .env.example .env
```

Lalu isi file `.env`:

```env
# Nomor owner (format internasional, tanpa + atau spasi)
OWNER_NUMBER=628123456789

# (Opsional) LID owner
OWNER_LID=
```

<details>
<summary><b>📱 Instalasi di Termux (ketuk untuk membuka)</b></summary>
<br>

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts git -y
node -v   # pastikan v22.5 atau lebih baru
git clone https://github.com/superrrkyy/axybot.git
cd axybot && npm install
cp .env.example .env && nano .env
```

</details>

---

### ▶️ Menjalankan Bot

```bash
npm start      # mode normal
npm run dev    # mode development (auto-restart)
```

1. QR code muncul di terminal
2. Buka WhatsApp → **Perangkat Tertaut** → **Tautkan Perangkat**
3. Scan QR. Jika berhasil, muncul `🟢 WhatsApp Connected`

> [!TIP]
> Session tersimpan di folder `sessions/`. Untuk login ulang, hapus folder itu lalu jalankan lagi.

---

### 💬 Cara Pakai

Ketik nama command langsung di chat, **tanpa prefix**:

| Command | Alias | Fungsi |
|:--|:--|:--|
| `menu` | `help` | Menu interaktif |
| `ping` | `p` | Cek status bot |
| `profile` | – | Profil user |

---

### 🧩 Membuat Command Baru

Buat file di `src/commands/<kategori>/`, contoh `src/commands/general/halo.js`:

```js
export default {
  name: "halo",
  aliases: ["hai", "hi"],
  description: "Menyapa pengguna",
  category: "general",
  usage: "halo",

  premium: false,   // hanya user premium
  ownerOnly: false, // hanya owner
  adminOnly: false, // hanya admin grup

  async execute({ sock, jid, args }) {
    await sock.sendMessage(jid, {
      text: "👋 Halo! " + (args?.join(" ") || "")
    });
  }
};
```

Restart bot, dan command `halo` langsung aktif ✅

---

### 📁 Struktur Folder

<details>
<summary><b>Lihat struktur lengkap</b></summary>
<br>

```
axybot/
├── index.js              # Entry point
├── src/
│   ├── commands/         # Command per kategori
│   │   ├── general/      #   menu, ping, profile
│   │   ├── admin/        #   khusus admin grup
│   │   └── owner/        #   khusus owner
│   ├── core/
│   │   ├── connection.js # Koneksi, QR, reconnect
│   │   ├── loader.js     # Auto-load command
│   │   ├── command.js    # Registry & eksekusi
│   │   ├── message.js    # Handler pesan
│   │   ├── interactive.js# Handler tombol
│   │   ├── normalize.js  # Normalisasi pesan
│   │   ├── permissions.js# Owner/admin/premium
│   │   ├── identity.js   # Identitas owner
│   │   └── logger.js
│   ├── middleware/       # Middleware permission
│   ├── database/         # SQLite
│   └── users/            # Manajemen user
├── sessions/             # Session WA (diabaikan git)
└── .env                  # Konfigurasi (diabaikan git)
```

</details>

---

### ⚠️ Disclaimer

> [!WARNING]
> axybot memakai [Baileys](https://github.com/WhiskeySockets/Baileys), library WhatsApp **tidak resmi**, sehingga **ada risiko nomor diblokir**. Gunakan nomor cadangan, jangan untuk spam, dan patuhi Ketentuan Layanan WhatsApp.

---

### 🤝 Kontribusi

1. Fork repo ini
2. `git checkout -b fitur-baru`
3. `git commit -m "feat: tambah fitur X"`
4. Push lalu buka **Pull Request**

---

<p align="center">
  Dibuat dengan 💜 oleh <a href="https://github.com/superrrkyy"><b>AXRYZURE</b></a> • Lisensi <a href="LICENSE">MIT</a>
  <br><br>
  <sub>⭐ Beri bintang jika repo ini membantumu!</sub>
</p>
