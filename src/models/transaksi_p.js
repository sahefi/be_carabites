module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User
      id_penggalangan: { type: mongoose.Schema.Types.ObjectId, ref: 'penggalangan', required: true }, // Reference to Penggalangan
      metode_pembayaran: String,
      jumlah_penggalangan: Number,
      nomor_invoice: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, id_user, id_penggalangan, ...object } = this.toObject();
    object.id = _id;

    // Relasi ke User dan Penggalangan
    object.user = id_user;
    object.penggalangan = id_penggalangan;

    const baseUrl = 'http://localhost:8085/resources/uploads/';
    if (id_user && id_user.avatar) {
      object.user.avatar = `${baseUrl}${id_user.avatar}`;
    }
    if (id_penggalangan && id_penggalangan.filename) {
      object.penggalangan.filename = id_penggalangan.filename.map(file => `${baseUrl}${file}`);
    }

    return object;
  });

  const Transaksi = mongoose.model("transaksi_p", schema);
  return Transaksi;
};
