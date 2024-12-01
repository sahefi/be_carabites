const db = require("../models");
const Penggalangan = db.penggalangan;
const Postingan = db.postingan;
const Produk = db.produk;
const User = db.user;
const TransaksiP = db.transaksi_p;
const Transaksi = db.transaksi;

module.exports = {
  async getTotalCounts(req, res) {
    try {
      const penggalanganCount = await Penggalangan.countDocuments({ status: "active" });
      const postinganCount = await Postingan.countDocuments();
      const produkCount = await Produk.countDocuments();
      const userCount = await User.countDocuments();
      const transaksiPTotalPrice = await TransaksiP.aggregate([
        { $group: { _id: null, total: { $sum: "$jumlah_penggalangan" } } }
      ]);
      const transaksi = await Transaksi.find();

      const transaksiProduct = transaksi.reduce((acc, doc) => acc + Number(doc.total_harga), 0);      


      const transaksiPenggalangan = transaksiPTotalPrice[0].total

      return res.status(200).json({
        penggalanganCount,
        postinganCount,
        produkCount,
        userCount,
        transaksiPenggalangan,
        transaksiProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving total counts",
        error: error.message
      });
    }
  },
};
