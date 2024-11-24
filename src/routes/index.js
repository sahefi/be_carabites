// routes.js
const express = require("express");
const router = express.Router();

// const verifyToken = require('../middleware/auth');
// const getUserName = require('../middleware/auth');
const authCtrl = require("../controllers/auth.ctrl");
const uploadCtrl = require("../controllers/upload.ctrl");
const produkCtrl = require("../controllers/produk.ctrl");
const komenCtrl = require("../controllers/komen.ctrl");
const postinganCtrl = require("../controllers/postingan.ctrl");
const penggalanganCtrl = require("../controllers/penggalangan.ctrl");
const transaksiCtrl = require("../controllers/transaksi.ctrl");


let routes = (app) => {
    // Rute yang tidak memerlukan autentikasi
    router.get("/public/upload/:name", uploadCtrl.readImage);
    router.post("/auth/register", authCtrl.register);
    router.post("/auth/login", authCtrl.login);

    // Middleware untuk memverifikasi token dan mendapatkan nama pengguna
    // router.use(verifyToken);
    // router.use(getUserName);

    // Rute yang memerlukan autentikasi
    router.get("/auth", authCtrl.findAll);

    // router.get("/produk/search",  produkCtrl.findByName); // Route baru untuk pencarian berdasarkan nama produk
    router.get("/produk", produkCtrl.findAll);
    router.get("/produk/:id", produkCtrl.findOne);
    router.post("/produk", produkCtrl.store);
    router.put("/produk/:id", produkCtrl.update);
    router.delete("/produk/:id", produkCtrl.deleteOne);


    router.get("/komen", komenCtrl.findAll);
    router.get("/komen/:id", komenCtrl.findOne);
    router.post("/komen", komenCtrl.store);
    router.put("/komen/:id", komenCtrl.update);
    router.delete("/komen/:id", komenCtrl.deleteOne);

    router.get("/postingan", postinganCtrl.findAll);
    router.get("/postingan/:id", postinganCtrl.findOne);
    router.post("/postingan", postinganCtrl.store);

    router.get("/penggalangan", penggalanganCtrl.findAll);
    router.post("/penggalangan", penggalanganCtrl.store);
    router.delete("/penggalangan/:id", penggalanganCtrl.deleteOne);
    router.put("/penggalangan/:id", penggalanganCtrl.update);

    router.get("/transaksi", transaksiCtrl.findAll);
    router.post("/transaksi", transaksiCtrl.store);


    app.use(router);
};

module.exports = routes;
