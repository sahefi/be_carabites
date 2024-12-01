const db = require("../models");
const Penggalangan = db.penggalangan;
const fs = require("fs");
const uploadFile = require("../middleware/upload");

const findAll = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;

  Penggalangan.find()
    .populate('id_user')
    .populate('transaksi')
    .then(data => {
      const transformedData = data.map(item => ({
        ...item._doc,
        filename: item.filename.map(file => `${baseUrl}${file}`), // Transform file paths
        user: item.id_user, // Include user data
        transaksi: item.transaksi, // Include array of penggalangan
      }));

      res.send(transformedData);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving penggalangan.",
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

const counTotal = async (req, res) => {
  try {
    const id_user = req.params.id;
    const currentDate = new Date();
    
    
    const penggalangan = await Penggalangan.find({id_user:id_user})            
    
    if (penggalangan.length === 0) {
      return res.status(404).send({ message: `No penggalangan found for user with id=${id_user}` });
    }
    
    const totalActive = penggalangan.filter(transaction => {      
      return transaction.status === 'active';
    });
    
    totalPenggalangan = penggalangan.length || 0;
    totalPenggalanganActive = totalActive.length || 0;
    res.status(200).send({
      totalPenggalangan,   
      totalPenggalanganActive,             
    });
  } catch (err) {
    console.error("Error counting total price:", err);
    res.status(500).send({
      message: "Error occurred while calculating the total price.",
    });
  }
};

const updateVerif = async (req, res) => {
  try {
    const { id, is_verif } = req.body; 
    if (!['0', '1', '2'].includes(is_verif)) {
      return res.status(400).send({ message: "Invalid value for is_verif. It must be '0', '1', or '2'." });
    }
    const penggalangan = await Penggalangan.findById(id);

    if (!penggalangan) {
      return res.status(404).send({ message: `Penggalangan with id=${id} not found.` });
    }
    penggalangan.is_verif = is_verif;    
    const updatedPenggalangan = await penggalangan.save();    
    res.status(200).send({
      message: "Penggalangan verification status updated successfully!",
      data: updatedPenggalangan
    });

  } catch (err) {
    console.error("Error updating verification status:", err);
    res.status(500).send({
      message: `Error updating verification status for penggalangan with id=${req.body.id}.`
    });
  }
};

module.exports = {
  findAll,
  findOne,
  store,
  deleteOne,
  update,
  counTotal,
  updateVerif
};
