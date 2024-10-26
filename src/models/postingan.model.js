module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        judul : String,
        konten : String,
        filename : String,
        tag_lokasi : String
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
  