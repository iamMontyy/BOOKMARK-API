# 📌 Bookmark API

Aplikasi manajemen bookmark sederhana dengan Node.js, Express, dan MongoDB.

## Fitur
- Tambah bookmark (judul, url, kategori)
- Lihat semua bookmark
- Edit bookmark
- Hapus bookmark
- Pencarian realtime

## Teknologi
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript (Vanilla)

## Cara Menjalankan

### 1. Clone repository
```bash
git clone https://github.com/iamMontyy/BOOKMARK-API.git
cd BOOKMARK-API
```

### 2. Install dependencies
```bash
npm install
```

### 3. Buat file `.env`
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/bookmark_db
```

### 4. Jalankan server
```bash
npm start
```

### 5. Buka browser
```
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/bookmarks` | Ambil semua bookmark |
| POST | `/bookmarks` | Tambah bookmark baru |
| PUT | `/bookmarks/:id` | Update bookmark |
| DELETE | `/bookmarks/:id` | Hapus bookmark |
