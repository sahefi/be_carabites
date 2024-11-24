module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User
      judul: String,
      konten: String,
      filename: [String], // Array of file names
      kategori: {
        type: String,
        enum: ['Technology', 'Health', 'Business', 'Lifestyle', 'Education'],
        default: 'amal'
      },
    },
    { timestamps: true }
  );

  // Modify the toJSON method to populate fields
  schema.method("toJSON", function() {
    const { __v, _id, id_user, ...object } = this.toObject();

    // Add `id` and populate user details
    object.id = _id;
    object.user = id_user;    
    return object;
  });

  // Define the Postingan model
  const Postingan = mongoose.model("postingan", schema);
  return Postingan;
};
