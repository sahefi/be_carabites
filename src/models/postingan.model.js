module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        judul: String,
        konten: String,
        filename: [String], // Mengubah filename menjadi array of string
        kategori: {
          type: String,
          enum: ['amal', 'pendidikan', 'kesehatan'],
          default: 'amal'
        },     
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Postingan = mongoose.model("postingan", schema);
    return Postingan;
  };
  