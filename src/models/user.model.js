module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        nama_user: {type: String, default : null},
        email: { type:String, unique:true },
        no_telp_user: {type: Number, default : null},
        role: {type: String, enum: ['pengguna', 'mitra', 'lembaga sosial'],
          default: 'pengguna'},
        password: String,
        konfirmasi_password: String,
        token: {type: String, default : null}
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