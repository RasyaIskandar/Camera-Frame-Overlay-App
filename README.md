📸 Camera Frame Overlay App

Aplikasi web untuk mengambil foto menggunakan kamera dengan overlay frame PNG khusus. Dibangun menggunakan Next.js + React + TypeScript + Tailwind CSS, aplikasi ini memudahkan pengguna untuk membuat foto ber-frame secara instan tanpa aplikasi tambahan.

🚀 Fitur Utama

Pilih bingkai foto:

Portrait (9:16)

Landscape (16:9)

Kamera otomatis menyesuaikan rasio tampilan

Frame PNG tampil langsung di atas kamera

Hasil foto sudah menyatu dengan frame

Preview sebelum download

Download hasil foto dalam format PNG

📂 Struktur Folder
/public
  /frames
    frame-portrait.png
    frame-landscape.png

/app
  page.tsx   ← file utama berisi logika kamera & frame

🛠️ Cara Install & Menjalankan

Clone repo:

git clone https://github.com/USERNAME/NAMA-REPO.git


Masuk folder project:

cd NAMA-REPO


Install dependencies:

npm install


Jalankan development server:

npm run dev


Buka browser dan akses:

http://localhost:3000

📦 Build Project
npm run build
npm start

📁 Tambah / Ganti Frame

Masukkan file frame PNG kamu ke:

/public/frames/


Dengan nama:

frame-portrait.png

frame-landscape.png

Pastikan resolusi frame sesuai dengan rasio:

Portrait → 9:16

Landscape → 16:9

🧩 Teknologi yang Digunakan

Next.js

React

TypeScript

Tailwind CSS

Browser MediaDevices API

HTML Canvas API

🧑‍💻 Kontribusi

Pull request sangat diterima.

📜 Lisensi

Project ini menggunakan lisensi MIT.
