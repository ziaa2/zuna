# NOCTURNE — Immersive Music Player

Pemutar musik pribadi bergaya dark premium, mobile-first, dengan tampilan album immersive dan lirik sinkron dari file `.lrc`.

## Fitur
- Upload beberapa file audio lokal (MP3, M4A, OGG, WAV, FLAC).
- Tambahkan audio dari URL langsung (server harus mengizinkan akses audio/CORS bila diperlukan).
- Upload file `.LRC` untuk lirik sinkron. Ketuk baris lirik untuk lompat ke waktunya.
- Artwork opsional; player tetap jalan tanpa cover.
- Playlist/library, next/previous, shuffle, repeat-one, favorite, seek, volume.
- Penyimpanan file lokal di IndexedDB browser; link audio disimpan di localStorage.
- PWA: bisa dipasang dari browser yang mendukung install. Service worker aktif pada HTTPS (GitHub Pages mendukung HTTPS).

## Menjalankan
Buka `index.html` lewat local server atau deploy seluruh isi folder ke GitHub Pages. Untuk PWA, gunakan HTTPS.

## Format LRC
Contoh:
```text
[ti:Judul Lagu]
[ar:Nama Artis]
[00:12.30]Baris lirik pertama
[00:16.80]Baris lirik kedua
[00:21.00]Baris lirik ketiga
```
Pilih lagu di library, lalu tekan **ADD LRC** untuk memasangkan file lirik ke lagu yang sedang dipilih.

## Catatan penting
- File musik yang di-upload tersimpan di browser/perangkat itu saja, bukan ke server. Jika data browser dihapus atau pindah perangkat, file perlu di-upload ulang. Backup file audio dan LRC aslinya.
- URL audio harus berupa direct link ke file audio, bukan halaman Spotify/YouTube.
- Tidak ada katalog musik bawaan. Tambahkan hanya audio yang memang kamu punya hak untuk gunakan.
- Google Fonts digunakan sebagai peningkatan tampilan; bila offline, font sistem akan dipakai.
