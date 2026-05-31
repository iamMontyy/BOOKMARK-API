const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/bookmark_db')
    .then(() => console.log('Terhubung ke database'))
    .catch((err) => console.log('Gagal terhubung:', err));

const bookmarkSchema = new mongoose.Schema({
    judul: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
},

        web: { 
        type: String, 
        required: true 
},

    tanggal_disimpan: { 
        type: Date, 
        default: Date.now 
    }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
app.post('/bookmarks', async (req, res) => {
    try {
        
        const { judul, url, web } = req.body;
        
        const bookmarkBaru = new Bookmark({
            judul: judul,
            url: url,
            web: web
        });
        
        await bookmarkBaru.save(); 
        
        res.status(201).json({ 
            pesan: "Bookmark berhasil disimpan!", 
            data: bookmarkBaru 
        });
    } catch (error) {
        res.status(400).json({ pesan: "Gagal menyimpan bookmark", error: error.message });
    }
});
app.get('/bookmarks', async (req, res) => {
    try {
        const semuaBookmark = await Bookmark.find().sort({ tanggal_disimpan: -1 });
        
        res.status(200).json({ 
            pesan: "Ini daftar bookmark :", 
            total_data: semuaBookmark.length,
            data: semuaBookmark 
        });
    } catch (error) {
        res.status(500).json({ pesan: "Gagal mengambil data" });
    }
});
app.put('/bookmarks/:id', async (req, res) => {
    try {
        const idBookmark = req.params.id; 
        const dataUbah = req.body;      

        const bookmarkDiupdate = await Bookmark.findByIdAndUpdate(idBookmark, dataUbah, { new: true });
        
        if (!bookmarkDiupdate) {
            return res.status(404).json({ pesan: "Bookmark tidak ditemukan" });
        }
        
        res.status(200).json({ 
            pesan: "Bookmark berhasil diperbarui!", 
            data: bookmarkDiupdate 
        });
    } catch (error) {
        res.status(400).json({ pesan: "Gagal memperbarui data" });
    }
});
app.delete('/bookmarks/:id', async (req, res) => {
    try {
        const idBookmark = req.params.id;
        
        const bookmarkDihapus = await Bookmark.findByIdAndDelete(idBookmark);
        
        if (!bookmarkDihapus) {
            return res.status(404).json({ pesan: "Bookmark tidak ditemukan" });
        }
        
        res.status(200).json({ pesan: "Bookmark berhasil dihapus !" });
    } catch (error) {
        res.status(500).json({ pesan: "Gagal menghapus data" });
    }
});
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
