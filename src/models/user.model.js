module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        nama_user: String,
        email: { type:String, unique:true },
        password: String,
        jenis_kelamin : String,
        tgl_lahir_user : Date,
        no_telp_user: Number,
        alamat_user: String,
        token: String,
        role: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const User = mongoose.model("user", schema);
    return User;
  };