const db = require("../models");
const Postingan = db.postingan;

const fs = require('fs');
const uploadFile = require("../middleware/upload");


const findAll = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;
  Postingan.find()
    .populate('id_user') // Mem-populasi id_user dan memilih field nama_user dan avatar
    .then(data => {
      // Tambahkan baseUrl ke filename pada setiap postingan
      const updatedData = data.map(post => {
        post.filename = post.filename.map(file => baseUrl + file); // Menggabungkan baseUrl dengan filename
        return post;
      });
      
      res.send(updatedData); // Kirim data yang sudah dimodifikasi
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts."
      });
    });
};


const store = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload files!" });
    }

    const uploadedFiles = req.files.map((file) => file.originalname);

    const { judul, konten, kategori, id_user } = req.body;

    // Validate required fields
    if (!judul || !konten) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Validate the `kategori` field
    const allowedCategories = ['Technology',
        'Health',
        'Business',
        'Lifestyle',
        'Education'];
    if (kategori && !allowedCategories.includes(kategori)) {
      return res.status(400).send({
        message: `Invalid category. Allowed values are: ${allowedCategories.join(", ")}`,
      });
    }

    // Create a new Postingan instance
    const postingan = new Postingan({
      judul,
      konten,
      filename: uploadedFiles, // Array of uploaded file names
      kategori: kategori || "amal", // Default to "amal" if no category is provided
      id_user,
    });

    const data = await postingan.save();

    res.status(201).send({
      message: "Successfully created post",
      data: data,
    });
  } catch (err) {
    console.error("Error in store function:", err);

    res.status(500).send({
      message: `Could not process the request. ${err.message || "Internal server error"}`,
    });
  }
};

const findOne = (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL

  const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;

  Postingan.findById(id)
    .populate('id_user', 'nama_user avatar') // Mem-populasi id_user dan memilih field nama_user dan avatar
    .then(post => {
      if (!post) {
        return res.status(404).send({
          message: "Post not found with id " + id,
        });
      }

      // Menambahkan baseUrl ke filename
      post.filename = post.filename.map(file => baseUrl + file); // Menggabungkan baseUrl dengan filename
      
      res.send(post); // Mengirimkan data postingan
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the post.",
      });
    });
};

const updateVerif = async (req, res) => {
  try {
    const { id, is_verif } = req.body; 
    if (!['0', '1', '2'].includes(is_verif)) {
      return res.status(400).send({ message: "Invalid value for is_verif. It must be '0', '1', or '2'." });
    }
    const postingan = await Postingan.findById(id);

    if (!postingan) {
      return res.status(404).send({ message: `Postingan with id=${id} not found.` });
    }
    postingan.is_verif = is_verif;    
    const updatedPostingan = await postingan.save();    
    res.status(200).send({
      message: "Postingan verification status updated successfully!",
      data: updatedPostingan
    });

  } catch (err) {
    console.error("Error updating verification status:", err);
    res.status(500).send({
      message: `Error updating verification status for postingan with id=${req.body.id}.`
    });
  }
};

module.exports = {
    findAll,
    store,
    findOne,
    updateVerif
};
