const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require("./user.model.js")(mongoose);
db.produk = require("./produk.model.js")(mongoose);
db.komen = require("./komen.model.js")(mongoose);
db.postingan = require("./postingan.model.js")(mongoose);
db.penggalangan = require("./penggalangan.model.js")(mongoose);




module.exports = db;