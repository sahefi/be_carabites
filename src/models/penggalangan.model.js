module.exports = mongoose => {
    const schema = mongoose.Schema(
    {
    namaGalangDana: String,
    deskripsi: String,
    kategori: String,
    target : Number,
    tanggalMulai: { type: Date, required: true },
    tanggalAkhir: { type: Date, required: true },
    filename: [String]
}, {
    timestamps: true
});

  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Penggalangan = mongoose.model("penggalangan", schema);
    return Penggalangan;
  };
  