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
const userCtrl = require("../controllers/user.ctrl");
const transaksiPCtrl = require("../controllers/transaksi_p.ctrl");
const adminCtrl = require("../controllers/admin.ctrl");


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

    router.get("/admin", adminCtrl.getTotalCounts);
    // router.get("/produk/search",  produkCtrl.findByName); // Route baru untuk pencarian berdasarkan nama produk
    router.get("/produk", produkCtrl.findAll);
    router.get("/produk/:id", produkCtrl.findOne);
    router.post("/produk", produkCtrl.store);
    router.put("/produk/:id", produkCtrl.update);
    router.delete("/produk/:id", produkCtrl.deleteOne);

    router.get("/user", userCtrl.findAll);
    router.get("/user/:id", userCtrl.findOne);
    router.post("/user", userCtrl.store);
    router.put("/user-verif", userCtrl.updateVerif);
    router.put("/user/:id", userCtrl.update);
    router.delete("/user/:id", produkCtrl.deleteOne);


    router.get("/komen", komenCtrl.findAll);
    router.get("/komen/:id", komenCtrl.findOne);
    router.post("/komen", komenCtrl.store);
    router.put("/komen/:id", komenCtrl.update);
    router.delete("/komen/:id", komenCtrl.deleteOne);

    router.get("/postingan", postinganCtrl.findAll);
    router.get("/postingan/:id", postinganCtrl.findOne);
    router.post("/postingan", postinganCtrl.store);
    router.put("/postingan-verif", postinganCtrl.updateVerif);

    router.get("/penggalangan", penggalanganCtrl.findAll);
    router.get("/penggalangan/:id", penggalanganCtrl.findOne);
    router.get("/penggalangan/count/:id", penggalanganCtrl.counTotal);
    router.post("/penggalangan", penggalanganCtrl.store);
    router.put("/penggalangan-verif", penggalanganCtrl.updateVerif);
    router.delete("/penggalangan/:id", penggalanganCtrl.deleteOne);
    router.put("/penggalangan/:id", penggalanganCtrl.update);

    router.get("/transaksi", transaksiCtrl.findAll);
    router.post("/transaksi", transaksiCtrl.store);
    router.get("/count/:id", transaksiCtrl.countTotalHarga);

    router.get("/transaksi-p", transaksiPCtrl.findAll);
    router.get("/transaksi-p/count/:id", transaksiPCtrl.counTotal);    
    router.post("/transaksi-p", transaksiPCtrl.store);
    router.delete("/transaksi-p/:id", transaksiPCtrl.deleteOne);
    router.put("/transaksi-p/:id", transaksiPCtrl.update);


    app.use(router);
};

module.exports = routes;
