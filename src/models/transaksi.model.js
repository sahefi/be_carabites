module.exports = mongoose => {
    const User = require('./user.model');
    const Produk = require('./produk.model');
    const schema = mongoose.Schema(
      {
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User
        id_produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk', required: true },
        metode_pembayaran: String,
        jumlah_produk: Number,
        nomor_invoice : String,
        harga: Number
    },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id,id_user,id_produk, ...object } = this.toObject();
      object.id = _id;
      object.user = id_user;    
      object.produk = id_produk;    
      return object;
    });
  
    const Transaksi = mongoose.model("transaksi", schema);
    return Transaksi;
  };
  