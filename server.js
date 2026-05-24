const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/bookmark_db')
    .then(() => console.log('Terhubung ke database Bookmark!'))
    .catch((err) => console.log('Gagal terhubung:', err));