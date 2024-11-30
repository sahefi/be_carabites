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
        total_harga : String,
    },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, id_user ,id_produk, ...object } = this.toObject();
      object.id = _id;
      object.id_user = object.id_user;
      object.user = id_user;    
      object.produk = id_produk;    
      const baseUrl = 'http://localhost:8085/resources/uploads/';
      object.user.avatar = id_user.avatar ? `${baseUrl}${id_user.avatar}` : nulll;
      object.produk.filename = id_produk.filename ? id_produk.filename.map(file => `${baseUrl}${file}`) : [];
      return object;
    });
  
    const Transaksi = mongoose.model("transaksi", schema);
    return Transaksi;
  };
  