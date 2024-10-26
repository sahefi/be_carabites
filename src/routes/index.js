const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth.ctrl");
const uploadCtrl = require("../controllers/upload.ctrl");
const produkCtrl = require("../controllers/produk.ctrl");
const komenCtrl = require("../controllers/komen.ctrl");
const postinganCtrl = require("../controllers/postingan.ctrl");


let routes = (app) => {
    router.get("/public/upload/:name", uploadCtrl.readImage);

    router.get("/auth", authCtrl.findAll);
    router.post("/auth/register", authCtrl.register);

    router.get("/produk", produkCtrl.findAll);
    router.get("/produk/:id", produkCtrl.findOne)
    router.post("/produk", produkCtrl.store);
    router.put("/produk/:id", produkCtrl.update);
    router.delete("/produk/:id", produkCtrl.deleteOne);

    router.get("/komen", komenCtrl.findAll);
    router.get("/komen/:id", komenCtrl.findOne);
    router.post("/komen", komenCtrl.store);
    router.put("/komen/:id", komenCtrl.update);
    router.delete("/komen/:id", komenCtrl.deleteOne);

    router.get("/postingan", postinganCtrl.findAll);







    app.use(router);
};


module.exports = routes;