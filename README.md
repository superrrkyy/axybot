# 🤖 axybot Core V5

> Modular WhatsApp Bot Framework built with Node.js and Baileys.

axybot Core V5 adalah framework bot WhatsApp berbasis Node.js yang dibuat dengan arsitektur modular, sehingga fitur dapat dikembangkan, ditambahkan, dan dipelihara dengan lebih mudah.

Project ini dikembangkan untuk berjalan di **Termux, Linux, VPS**, maupun environment Node.js lainnya.

---

## 📖 Daftar Isi

- [Tentang axybot](#-tentang-axybot)
- [Apa Itu Bot WhatsApp](#-apa-itu-bot-whatsapp)
- [Cara Kerja](#-cara-kerja-axybot)
- [Fitur](#-fitur)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Menjalankan Bot](#-menjalankan-bot)
- [Command System](#-command-system)
- [Native Menu](#-native-menu)
- [Database](#-database)
- [Struktur Project](#-struktur-project)
- [Troubleshooting](#-troubleshooting)
- [Git Workflow](#-git-workflow)
- [PM2](#-menjalankan-dengan-pm2)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Responsible Use](#-responsible-use)
- [License](#-license)
- [Author](#-author)

---

# 🧩 Tentang axybot

**axybot Core V5** adalah framework bot WhatsApp yang dirancang menggunakan arsitektur modular.

Tujuan utama project ini adalah membuat sistem bot yang:

- Mudah dikembangkan
- Mudah dipelihara
- Modular
- Memiliki sistem permission
- Memiliki database
- Mendukung plugin
- Memiliki logging
- Memiliki sistem keamanan
- Dapat dikembangkan menuju production

axybot tidak menggunakan satu file besar untuk seluruh sistem.

Setiap bagian memiliki tanggung jawab masing-masing.

Contoh:

```text
Core
 ├── Connection
 ├── Message Handler
 ├── Command Registry
 ├── Permission
 ├── Logger
 └── Error Handler

Commands
 ├── General
 ├── Owner
 ├── Admin
 └── Premium

Database
 ├── SQLite
 ├── JSON
 ├── MongoDB
 └── PostgreSQL

Middleware
 ├── Anti Spam
 ├── Rate Limit
 ├── Blacklist
 └── Whitelist
📱 Apa Itu Bot WhatsApp?
Bot WhatsApp adalah program yang dapat menerima pesan dari pengguna, memproses pesan tersebut, kemudian memberikan respons secara otomatis.
Contoh sederhana:
User
 │
 │ ping
 ▼
WhatsApp
 │
 ▼
axybot
 │
 ├── Message Handler
 ├── Message Normalizer
 ├── Command Parser
 └── Command Registry
 │
 ▼
Command
 │
 ▼
Response
 │
 ▼
WhatsApp User
Contoh:
User:
ping

Bot:
🏓 Pong!

🟢 axybot Core V5 aktif.
Bot dapat digunakan untuk berbagai kebutuhan seperti:
Automation
Moderasi grup
Command system
User management
Database
Premium system
Plugin
Logging
Utility
Tools
Administration
⚙️ Cara Kerja axybot
Arsitektur dasar:
                    WhatsApp
                       │
                       ▼
                Baileys Layer
                       │
                       ▼
             Connection Manager
                       │
                       ▼
               Message Handler
                       │
                       ▼
             Message Normalizer
                       │
                       ▼
                Command Parser
                       │
                       ▼
               Command Registry
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          General     Admin     Owner
             │         │         │
             └─────────┼─────────┘
                       │
                       ▼
                Permission System
                       │
                       ▼
                    Database
                       │
                       ▼
                    Response
✨ Fitur
Core
WhatsApp connection
Authentication/session
Message listener
Message normalization
No-prefix command system
Command registry
Command metadata
Logger
Error handler
Graceful shutdown
Native interactive menu
Native buttons
User System
User registration
User ID
Name
Level
XP
Coin
Premium status
User persistence
Permission System
Owner
Admin
Premium
Permission middleware
Group permission foundation
Database
Database saat ini:
SQLite
Database yang direncanakan:
JSON
MongoDB
PostgreSQL
Security
Anti-spam
Rate limit
Blacklist
Whitelist
Security middleware
Plugin System
Direncanakan:
Plugin loader
Plugin registry
Enable/Disable plugin
Plugin reload
Plugin metadata
Dynamic commands
📦 Requirements
Pastikan environment memiliki:
Node.js 20+
npm
Git
WhatsApp
Termux / Linux / VPS
Cek Node.js:
node -v
Cek npm:
npm -v
Cek Git:
git --version
📲 Installation
Termux
Update package:
pkg update
pkg upgrade
Install Node.js:
pkg install nodejs
Install Git:
pkg install git
Clone repository:
git clone https://github.com/superrrkyy/axybot.git
Masuk ke project:
cd axybot
Install dependency:
npm install
🔐 Environment Configuration
Buat file:
.env
Contoh:
BOT_NAME=axybot
BOT_VERSION=5.0.0
OWNER_NUMBER=YOUR_OWNER_NUMBER
OWNER_LID=YOUR_OWNER_LID
NODE_ENV=development
DB_DRIVER=sqlite
Ganti:
YOUR_OWNER_NUMBER
YOUR_OWNER_LID
dengan konfigurasi owner milik pengguna.

⚠️ Jangan Upload .env
File .env dapat berisi informasi sensitif.
Jangan memasukkan:
Password
API Key
Access Token
Personal Access Token
WhatsApp Session
Private Credential
ke dalam source code atau repository publik.
Pastikan .gitignore memiliki:
node_modules/
sessions/
logs/
.env
*.db
*.sqlite
🚀 Menjalankan Bot
Jalankan:
npm start
Untuk development:
npm run dev
Jika session WhatsApp belum tersedia, axybot akan menampilkan QR Code.
Scan QR Code menggunakan WhatsApp.
Jika berhasil:
🟢 WhatsApp Connected
Bot siap digunakan.
🔑 Command System
axybot menggunakan sistem no-prefix command.
Artinya pengguna tidak perlu menggunakan:
!
/
.
#
Contoh command:
ping
menu
profile
owner
admin
Bukan:
!ping
/ping
.profile
🏓 Ping
Gunakan:
ping
Response:
🏓 Pong!

🟢 axybot Core V5 aktif.
👤 Profile
Gunakan:
profile
Profile mengambil data pengguna dari database.
Data pengguna dapat mencakup:
ID
Name
Level
XP
Coin
Premium
👑 Owner
Gunakan:
owner
Command owner hanya dapat digunakan oleh owner.
Contoh:
👑 OWNER

Status : Owner
Access : Full
Core   : axybot V5
🛡️ Admin
Gunakan:
admin
Command admin digunakan untuk fitur administrasi dan moderasi.
Contoh:
🛡️ ADMIN

Status : Admin
Access : Moderation
Core   : axybot V5
🧭 Native Menu
axybot memiliki native interactive menu.
Kategori dapat mencakup:
General
Tools
Owner
Admin
Premium
Plugins
Command dapat ditemukan berdasarkan metadata command.
Konsep:

Command File
     │
     ▼
Command Metadata
     │
     ▼
Command Registry
     │
     ▼
Native Menu
Dengan pendekatan ini, menu dapat dikembangkan secara dinamis ketika command baru ditambahkan.
🗄️ Database
Database default saat ini:
SQLite
Database digunakan untuk menyimpan data pengguna dan konfigurasi.
Contoh data:
ID
Name
Level
XP
Coin
Premium
Premium Expiration
Created At
Updated At
Database utama:
database/users.db
Database development/production sebaiknya tidak di-upload ke repository publik.
🧱 Database Abstraction
Target arsitektur:
                 DatabaseAdapter
                        │
          ┌─────────────┼─────────────┐
          │             │             │
        SQLite         JSON        MongoDB
                                      │
                                  PostgreSQL
Tujuannya agar core axybot tidak bergantung langsung pada satu jenis database.
Konfigurasi database:
DB_DRIVER=sqlite
Di masa depan dapat menggunakan:
DB_DRIVER=json
atau:
DB_DRIVER=mongodb
atau:
DB_DRIVER=postgres
📁 Struktur Project
axybot/
│
├── src/
│   │
│   ├── core/
│   │   ├── connection.js
│   │   ├── message.js
│   │   ├── normalize.js
│   │   ├── command.js
│   │   ├── interactive.js
│   │   ├── permissions.js
│   │   ├── identity.js
│   │   ├── loader.js
│   │   └── logger.js
│   │
│   ├── commands/
│   │   ├── general/
│   │   │   ├── menu.js
│   │   │   ├── ping.js
│   │   │   └── profile.js
│   │   │
│   │   ├── owner/
│   │   │   └── owner.js
│   │   │
│   │   ├── admin/
│   │   │   └── admin.js
│   │   │
│   │   └── premium/
│   │
│   ├── database/
│   │   ├── sqlite.js
│   │   ├── adapter.js
│   │   ├── json.js
│   │   ├── mongodb.js
│   │   └── postgres.js
│   │
│   ├── users/
│   │   ├── manager.js
│   │   └── service.js
│   │
│   ├── middleware/
│   │   ├── permissions.js
│   │   ├── antiSpam.js
│   │   ├── rateLimit.js
│   │   ├── blacklist.js
│   │   └── whitelist.js
│   │
│   └── config/
│       └── config.js
│
├── database/
├── plugins/
├── sessions/
├── logs/
├── assets/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
└── README.md
Beberapa file pada struktur di atas merupakan bagian dari arsitektur dan roadmap yang akan dikembangkan secara bertahap.
🐛 Troubleshooting
Bagian ini dibuat berdasarkan error yang ditemukan selama pengembangan axybot Core V5.
Tujuannya agar developer baru dapat memahami penyebab error dan mengetahui cara menghindarinya.
❌ Error 1 — Author identity unknown
Error:
Author identity unknown

Please tell me who you are.
Penyebab
Git belum memiliki username dan email.
Solusi
git config --global user.name "YOUR_GITHUB_USERNAME"
Kemudian:
git config --global user.email "YOUR_EMAIL"
Cek:
git config --global user.name
git config --global user.email
Setelah itu ulangi:
git commit -m "Initial commit"
❌ Error 2 — remote origin already exists
Error:
error: remote origin already exists.
Penyebab
Remote origin sudah dibuat.
Cek
git remote -v
Jika sudah terdapat:
origin  https://github.com/USERNAME/REPOSITORY.git
tidak perlu menjalankan git remote add origin lagi.
Jika ingin mengganti URL
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
Hindari menjalankan berkali-kali:
git remote add origin ...
❌ Error 3 — GitHub meminta Password
Saat menjalankan:
git push -u origin main
GitHub dapat meminta:
Username for 'https://github.com':
Password for 'https://github.com':
Penyebab
Autentikasi Git melalui HTTPS tidak menggunakan password akun GitHub biasa.
Solusi
Gunakan:
Username
→ GitHub username

Password
→ Personal Access Token
Gunakan Fine-grained Personal Access Token dengan akses seminimal mungkin.
Untuk push repository:
Repository
→ repository yang diperlukan

Contents
→ Read and write
Jangan pernah membagikan token.
Jangan memasukkan token ke:
Source code
README.md
.env yang di-upload
Git commit
GitHub Issue
Chat publik
❌ Error 4 — Cannot use import statement outside a module
Error:
Cannot use import statement outside a module
atau:
Unexpected token 'export'
Penyebab
Konfigurasi module Node.js tidak sesuai.
axybot menggunakan ES Module.
Di package.json:
{
  "type": "module"
}
Karena itu kode menggunakan:
import fs from "fs";
dan:
export function example() {
}
Hindari
Mencampurkan:
require(...)
dengan:
import ...
secara sembarangan.
❌ Error 5 — Dependency Baileys tidak ditemukan
Error:
Cannot find package '@whiskeysockets/baileys'
Solusi
Jalankan:
npm install
Jika dependency belum ada:
npm install @whiskeysockets/baileys
Cek:
npm list @whiskeysockets/baileys
❌ Error 6 — Bot membalas pesannya sendiri
Salah satu bug penting yang ditemukan adalah bot memproses pesan yang dibuat oleh bot sendiri.
Hal ini dapat menyebabkan response loop:
Bot
 │
 ▼
Pesan error
 │
 ▼
Bot membaca pesan sendiri
 │
 ▼
Pesan error lagi
 │
 ▼
Loop
Contoh:
❌ Command tidak ditemukan.

❌ Command tidak ditemukan.

❌ Command tidak ditemukan.
Penyebab
Message handler tidak mengabaikan:
message.key.fromMe
Solusi
Tambahkan:
if (message.key?.fromMe) continue;
Contoh:
for (const message of messages) {

  if (message.key?.fromMe) continue;

  if (!message.message) continue;

  // proses pesan
}
Kenapa penting?
Bot harus memproses:
User → Bot
dan tidak:
Bot → Bot
Hal ini mencegah infinite response loop.
❌ Error 7 — Owner tidak terdeteksi
WhatsApp dapat menggunakan identifier yang berbeda.
Contoh:
@s.whatsapp.net
dan:
@lid
Masalah
Jika permission system hanya memeriksa satu identifier, owner dapat dianggap sebagai user biasa.
Solusi
Gunakan identity utama dan alternatif:
sender
senderAlt
Contoh:

sender:
  message.key.participant ||
  message.key.participantAlt ||
  jid,

senderAlt:
  message.key.participantAlt ||
  message.key.participant ||
  null
Permission system dapat memeriksa identifier yang relevan.
❌ Error 8 — Permission command gagal
Jika command owner/admin tidak bekerja, periksa:
OWNER_NUMBER=...
OWNER_LID=...
Pastikan permission middleware memiliki:
checkPermission()
Command juga harus mempunyai metadata permission.
Contoh:
export default {
  name: "owner",
  category: "owner",
  permission: "owner",

  async execute() {
    // command
  }
};
❌ Error 9 — SQLite bermasalah
Pastikan directory database tersedia:
mkdir -p database
Database:
database/users.db
Jika ingin membuat ulang database untuk development:
rm database/users.db
Kemudian jalankan kembali bot.
Jangan melakukan ini pada database production tanpa backup.
❌ Error 10 — Jangan install semua database sekaligus
axybot dirancang untuk mendukung:
SQLite
JSON
MongoDB
PostgreSQL
Namun developer tidak perlu mengaktifkan semuanya sekaligus.
Untuk development awal:
DB_DRIVER=sqlite
SQLite digunakan sebagai database awal karena tidak membutuhkan database server terpisah.
❌ Error 11 — Testing ES Module
Untuk menguji module Node.js, gunakan:
node --input-type=module -e "import './src/config/config.js'"
Contoh membaca konfigurasi:
node --input-type=module -e "import { config } from './src/config/config.js'; console.log(config)"
🔍 Testing Sebelum Commit
Sebelum melakukan commit:
git status
Cek Node.js:
node -v
Cek dependency:
npm list
Cek syntax:
node --check index.js
Cek file tertentu:
node --check src/core/message.js
🔄 Git Workflow
Setelah melakukan perubahan:
git status
Kemudian:
git add .
Commit:
git commit -m "Update axybot Core V5"
Push:
git push
Workflow:
Edit
 │
 ▼
Test
 │
 ▼
git status
 │
 ▼
git add .
 │
 ▼
git commit
 │
 ▼
git push
🖥️ Menjalankan dengan PM2
Untuk menjalankan bot dalam waktu lama, PM2 dapat digunakan.
Install:
npm install -g pm2
Jalankan:
pm2 start index.js --name axybot
Cek status:
pm2 status
Lihat log:
pm2 logs axybot
Restart:
pm2 restart axybot
Stop:
pm2 stop axybot
🔒 Security
Keamanan credential sangat penting.
Jangan commit:
.env
sessions/
logs/
*.db
*.sqlite
Jangan membagikan:
GitHub Personal Access Token
WhatsApp Session
API Key
Password
Private Credential
Jika credential terlanjur masuk repository:
Segera revoke credential.
Buat credential baru.
Hapus credential dari source code.
Periksa Git history jika diperlukan.
Jangan gunakan credential lama lagi.
🚫 Hal yang Harus Dihindari
Developer baru sebaiknya menghindari:
❌ Commit .env
❌ Commit WhatsApp session
❌ Commit database production
❌ Membagikan GitHub token
❌ Menghapus database production tanpa backup
❌ Mencampurkan CommonJS dan ES Module sembarangan
❌ Menambahkan remote origin berkali-kali
❌ Menjalankan bot tanpa menangani fromMe
❌ Mengubah banyak bagian core sekaligus tanpa testing
❌ Menginstall dependency yang tidak diperlukan
✅ Hal yang Sebaiknya Dilakukan
Gunakan workflow:
1. Ubah satu bagian
       ↓
2. Test
       ↓
3. Cek error
       ↓
4. git status
       ↓
5. Commit
       ↓
6. Push
Untuk perubahan besar:
Backup
  ↓
Branch
  ↓
Development
  ↓
Testing
  ↓
Commit
  ↓
Merge
🗺️ Roadmap
Phase 1 — CORE
[x] Project initialization
[x] Node.js configuration
[x] Baileys
[x] WhatsApp connection
[x] Authentication/session
[x] Message listener
[x] Message normalizer
[x] No-prefix parser
[x] Command registry
[x] Logger
[x] Error handler
[x] Native menu
[x] Native buttons
Phase 2 — USER SYSTEM
[x] User model
[x] User registration
[x] Name
[x] Level
[x] XP
[x] Coin
[x] Premium status
[x] SQLite persistence
Phase 3 — PERMISSION
[x] Owner
[x] Admin
[x] Permission middleware
[x] Group permission foundation
Phase 4 — DATABASE
[x] SQLite foundation
[ ] DatabaseAdapter
[ ] Database Manager
[ ] JSON adapter
[ ] MongoDB adapter
[ ] PostgreSQL adapter
Phase 5 — PLUGIN SYSTEM
[ ] Plugin loader
[ ] Plugin registry
[ ] Enable/Disable
[ ] Reload
[ ] Plugin metadata
[ ] Dynamic commands
Phase 6 — SECURITY
[ ] Anti-spam
[ ] Rate limit
[ ] Blacklist
[ ] Whitelist
[ ] Security middleware
Phase 7 — PREMIUM
[ ] Real-time clock
[ ] HD photo
[ ] HD video
[ ] Premium manager
[ ] Premium expiration
Phase 8 — PRODUCTION
[ ] PM2
[ ] Auto restart
[ ] Graceful shutdown
[ ] Backup
[ ] Production configuration
[ ] Monitoring
[ ] Final documentation
🏗️ Architecture Goal
Target architecture:
                     axybot Core V5
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Commands        Middleware        Database
          │                │                │
          │          ┌─────┼─────┐          │
          │          │     │     │          │
          │       AntiSpam Rate  ACL      Adapter
          │                                  │
          │                     ┌────────────┼───────────┐
          │                     │            │           │
          │                   SQLite        JSON      MongoDB
          │                                                │
          │                                            PostgreSQL
          │
          └────────────── Message Engine
                                │
                                ▼
                           WhatsApp Layer
Tujuan akhirnya adalah membuat axybot menjadi framework bot WhatsApp yang modular dan extensible.
📚 Development Philosophy
axybot dikembangkan dengan beberapa prinsip:
Modular
Setiap fitur memiliki module sendiri.
Extensible
Fitur baru dapat ditambahkan tanpa mengubah seluruh core.
Maintainable
Kode dibuat agar mudah dibaca dan diperbaiki.
Secure
Credential dan data sensitif harus dipisahkan dari source code.
Testable
Setiap perubahan harus diuji sebelum commit.
Production Ready
Arsitektur dirancang agar dapat berkembang dari development menuju production.
⚠️ Responsible Use
axybot adalah framework pengembangan bot WhatsApp.
Gunakan bot secara bertanggung jawab.
Hindari:
Spam
Flood message
Penyalahgunaan akun
Pengumpulan data pribadi tanpa izin
Penyalahgunaan sistem
Aktivitas ilegal
Aktivitas yang melanggar ketentuan layanan platform
Developer bertanggung jawab atas penggunaan bot dan fitur yang dibuat menggunakan framework ini.
📄 License
MIT License
Copyright (c) 2026 axybot
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
👨‍💻 Author
superrrkyy
Project:
axybot Core V5
Repository:
https://github.com/superrrkyy/axybot
⭐ Support
Jika project ini membantu atau menarik untuk dipelajari, kamu dapat memberikan ⭐ pada repository.
axybot Core V5
Modular WhatsApp Bot Framework
Built with Node.js
📌 Current Status
Version : 5.0.0
Status  : Development
Runtime : Node.js
Database: SQLite
Platform: Termux / Linux / VPS
axybot Core V5 — Modular by design.
