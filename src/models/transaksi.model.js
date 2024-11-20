module.exports = mongoose => {
    const User = require('./user.model');
    const Produk = require('./produk.model');
    const schema = mongoose.Schema(
      {
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
        id_produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk', required: true },
        metode_pembayaran: String,
        jumlah_produk: Number,
        nomor_invoice : String,
    },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Transaksi = mongoose.model("transaksi", schema);
    return Transaksi;
  };
  