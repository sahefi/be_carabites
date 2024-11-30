const db = require("../models");
const Penggalangan = db.penggalangan;
const fs = require("fs");
const uploadFile = require("../middleware/upload");
const { isSet } = require("util/types");

const findAll = (req, res) => {
  // Base URL for accessing uploaded images
  const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;

  Penggalangan.find()
    .populate('id_user')  
    .then(data => {
      // Map through the data to include full URL for filenames
      const transformedData = data.map(item => ({
        ...item._doc, // Include original product data
        filename: item.filename.map(file => `${baseUrl}${file}`), // Construct full URL for each file
        user: item.id_user, 
      }));

      res.send(transformedData); // Send transformed data
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};


// Store a new record
const store = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload at least one file!" });
    }

    const filenames = req.files.map((file) => file.originalname);

    const {
      namaGalangDana,
      deskripsi,
      kategori,
      target,
      lokasi,
      tanggalMulai,
      tanggalAkhir,   
      id_user,   
    } = req.body;

    if (
      !namaGalangDana ||
      !deskripsi ||
      !kategori ||
      !target ||
      !tanggalMulai ||
      !tanggalAkhir ||
      !lokasi ||
      !id_user
    ) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const penggalangan = new Penggalangan({
      namaGalangDana,
      deskripsi,
      kategori,
      target: parseFloat(target),
      filename: filenames, // Save filenames as an array
      tanggalMulai,
      tanggalAkhir,
      lokasi,
      id_user
    });

    const data = await penggalangan.save();
    res.status(201).send({
      message: "Successfully created galang dana",
      data: data,
    });
  } catch (err) {
    console.error("Error in store function:", err);
    res.status(500).send({
      message: err.message || "Could not upload the files.",
    });
  }
};

// Delete a record
const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const penggalangan = await Penggalangan.findById(id);

    if (!penggalangan) {
      return res.status(404).send({ message: `Data with id=${id} not found.` });
    }

    // Delete associated files from the filesystem
    penggalangan.filename.forEach((file) => {
      const filePath = __basedir + "/resources/static/assets/uploads/" + file;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Penggalangan.findByIdAndDelete(id);
    res.send({ message: "Data deleted successfully!" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send({ message: `Error deleting data with id=${req.params.id}` });
  }
};

// Update a record
const update = async (req, res) => {
  try {
    await uploadFile(req, res);

    const {
      namaGalangDana,
      deskripsi,
      kategori,
      target,
      lokasi,
      tanggalMulai,
      tanggalAkhir,   
      id_user,   
    } = req.body;

    if (
      !namaGalangDana ||
      !deskripsi ||
      !kategori ||
      !target ||
      !tanggalMulai ||
      !tanggalAkhir ||
      !lokasi ||
      !id_user
    ) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const id = req.params.id;
    const penggalangan = await Penggalangan.findById(id);

    if (!penggalangan) {
      return res.status(404).send({ message: `Data with id=${id} not found.` });
    }

    if (req.files.length > 0) {             
      const newFilenames = req.files.map((file) => file.originalname);    
      penggalangan.filename = newFilenames; // Save new filenames  
    }


    // Delete old files from the filesystem
    penggalangan.filename.forEach((file) => {
      const filePath = __basedir + "/resources/static/assets/uploads/" + file;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Update fields
    penggalangan.namaGalangDana = namaGalangDana;
    penggalangan.deskripsi = deskripsi;
    penggalangan.kategori = kategori;
    penggalangan.target = parseFloat(target);
    penggalangan.tanggalMulai = tanggalMulai;
    penggalangan.tanggalAkhir = tanggalAkhir;
    penggalangan.lokasi = lokasi,
    penggalangan.id_user = id_user


    const updatedData = await penggalangan.save();
    res.send(updatedData);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).send({ message: `Error updating data with id=${req.params.id}` });
  }
};

const findOne = async (req, res) => {
  try {
    const id = req.params.id;    
    const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;
    
    const produk = await Penggalangan.findById(id).populate('id_user');

    if (!produk) {
      return res.status(404).send({
        message: `Product with id ${id} not found.`,
      });
    }
    
    if (produk.filename && Array.isArray(produk.filename)) {
      produk.filename = produk.filename.map(file => `${baseUrl}${file}`);
    }
    
    const response = {
    ...produk._doc, 
    user: produk.id_user, 
    };

    res.status(200).send(response);
  } catch (err) {
    console.error("Error retrieving product:", err);
    res.status(500).send({
      message: `Error retrieving product with id ${req.params.id}.`,
    });
  }
};

module.exports = {
  findAll,
  findOne,
  store,
  deleteOne,
  update,
};
