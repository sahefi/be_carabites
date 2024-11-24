module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User
      nama_produk: String,
      deskripsi_produk: String,
      kategori_produk : String,
      jumlah_produk : Number,
      harga: Number,
      filename: [String],
      kota: String,
      kecamatan: String,
      kelurahan: String,
      alamat: String,
      tanggal_pengambilan : Date,
      jam: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id,id_user, ...object } = this.toObject();    
    object.id = _id;
    object.user = id_user;  
    return object;
  });

  const Produk = mongoose.model("Produk", schema);
  return Produk;
};
