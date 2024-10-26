module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      nama_produk: String,
      filename: String,
      jenis_produk: String,
      harga: Number,
      kategori_produk: String,
      lokasi_produk: String,
      deskripsi_produk: String,
      id_user: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Produk = mongoose.model("Produk", schema);
  return Produk;
};
