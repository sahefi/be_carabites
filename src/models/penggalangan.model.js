module.exports = mongoose => {
    const schema = mongoose.Schema(
    {
    id_lembaga: String,
    namaGalangDana: String,
    konten_galang_dana: String,
    filename: String,
    target_galang_dana :Number,
    statusGalangDana: { 
    type: String, 
    enum: ['pending', 'ongoing', 'completed', 'canceled'],
    default: 'pending'
    },
    tanggalMulai: { type: Date, required: true },
    tanggalAkhir: { type: Date, required: true }
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
  