module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      nama_produk: String,
      deskripsi_produk: String,
      kategori_produk : String,
      jumlah_produk : Number,
      harga: Number,
      files: String,
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
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Produk = mongoose.model("Produk", schema);
  return Produk;
};
