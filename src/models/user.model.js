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
        token: {type: String, default : null},
        avatar: { type: String, default: null },
        alamat: { type: String, default: null },
        no_rek: { type: String, default: null },
        deskripsi: { type: String, default: null },
        is_verif: {
          type: String,
          enum: ['0', '1', '2'], 
          default: '0', 
        },
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      const baseUrl = 'http://localhost:8085/resources/uploads/'; // Replace with your actual base URL
      if (object.avatar) {
        object.avatar = `${baseUrl}${object.avatar}`;
      }
      return object;
    });
  
    const User = mongoose.model("user", schema);
    return User;
  };