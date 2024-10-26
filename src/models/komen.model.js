module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        konten_komentar : String,
        id_user : String,
        id_postingan : String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Komen = mongoose.model("komen", schema);
    return Komen;
  };
  