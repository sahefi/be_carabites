module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User
      namaGalangDana: String,
      deskripsi: String,
      kategori: String,
      target: Number,
      lokasi: String,
      status: { type: String, enum: ['active', 'inactive'], default: 'active' },
      tanggalMulai: { type: Date, required: true },
      tanggalAkhir: { type: Date, required: true },
      filename: [String],
      is_verif: {
        type: String,
        enum: ['0', '1', '2'], 
        default: '0', 
      },
      transaksi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaksi_p', required: true }], // Relasi one-to-many
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, id_user, ...object } = this.toObject();
    object.id = _id;
    object.user = id_user;  
    return object;
  });

  const Penggalangan = mongoose.model("penggalangan", schema);
  return Penggalangan;
};
