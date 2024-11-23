const db = require("../models");
const Produk = db.produk;

const fs = require('fs');
const uploadFile = require("../middleware/upload");
// const baseUrl = "http://localhost:4001/public/upload/";


const findAll = (req, res) => {
  // Base URL for accessing uploaded images
  const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/images/`;

  Produk.find()
    .then(data => {
      // Map through the data to include full URL for filenames
      const transformedData = data.map(item => ({
        ...item._doc, // Include original product data
        filename: item.filename.map(file => `${baseUrl}${file}`), // Construct full URL for each file
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

const store = async (req, res) => {
  try {
    // Process file uploads
    await uploadFile(req, res);

    // Check if any files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload files!" });
    }

    // Extract filenames from uploaded files
    const uploadedFiles = req.files.map((file) => file.originalname);


    // Destructure and validate required fields from the request body
    const {
      nama_produk,
      deskripsi_produk,
      kategori_produk,
      jumlah_produk,
      harga,
      kota,
      kecamatan,
      kelurahan,
      alamat,
      tanggal_pengambilan,
      jam,
    } = req.body;

    // Validate required fields
    if (
      !nama_produk ||
      !deskripsi_produk ||
      !kategori_produk ||
      !jumlah_produk ||
      !harga ||
      !kota ||
      !kecamatan ||
      !kelurahan ||
      !alamat ||
      !tanggal_pengambilan ||
      !jam
    ) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Create a new product instance
    const produk = new Produk({
      nama_produk,
      deskripsi_produk,
      kategori_produk,
      jumlah_produk: parseInt(jumlah_produk, 10),
      harga: parseFloat(harga),
      filename: uploadedFiles, // Attach filenames
      kota,
      kecamatan,
      kelurahan,
      alamat,
      tanggal_pengambilan: new Date(tanggal_pengambilan),
      jam,
    });

    // Save the product to the database
    const data = await produk.save();

    // Respond with success, including filenames in the response
    res.status(200).send({
      message: "Files and product information uploaded successfully!",
      data: data,
    });
  } catch (err) {
    console.error("Error in store function:", err);

    // Respond with error
    res.status(500).send({
      message: `Could not upload the files: ${err.message || "Internal server error."}`,
    });
  }
};



const findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const produk = await Produk.findById(id);

    if (!produk) {
      return res.status(404).send({
        message: `Product with id ${id} not found.`,
      });
    }

    res.status(200).send(produk);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving product with id ${req.params.id}.`,
    });
  }
};

const update = async (req, res) => {
  try {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    await uploadFile(req, res);

    const { nama_produk, jenis_produk, harga, kategori_produk, lokasi_produk, deskripsi_produk, id_user } = req.body;

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    if (!nama_produk || !jenis_produk || !harga || !kategori_produk || !lokasi_produk || !deskripsi_produk || !id_user) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const id = req.params.id;
    const newFilename = req.file.originalname;

    const produk = await Produk.findById(id);

    if (!produk) {
      fs.unlinkSync(directoryPath + newFilename);
      return res.status(404).send({ message: "Not found Produk with id " + id });
    }

    produk.nama_produk = nama_produk;
    produk.jenis_produk = jenis_produk;
    produk.harga = harga;
    produk.kategori_produk = kategori_produk;
    produk.lokasi_produk = lokasi_produk;
    produk.deskripsi_produk = deskripsi_produk;
    produk.id_user = id_user;
    produk.filename = newFilename;

    const updatedData = await produk.save();
    res.send(updatedData);

  } catch (err) {
    console.error("Error updating produk:", err);
    res.status(500).send({ message: "Error updating produk with id=" + req.params.id });
  }
};
const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const produk = await Produk.findById(id);

    if (!produk) {
      return res.status(404).send({ message: `Produk with id=${id} not found.` });
    }
    // const filePath = __basedir + "/resources/static/assets/uploads/" + produk.filename;
    await Produk.findByIdAndDelete(id);
    res.send({ message: "Produk deleted successfully!" });

  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send({ message: `Error deleting product with id=${req.params.id}` });
  }
};

const findByName = async (req, res) => {
  try {
    const { nama_produk } = req.query;  // Get the name from query parameters

    if (!nama_produk) {
      return res.status(400).send({ message: "Product name is required." });
    }

    const products = await Produk.find({ nama_produk: new RegExp(nama_produk, "i") });

    if (products.length === 0) {
      return res.status(404).send({ message });
    }

    res.status(200).send(products);
  } catch (err) {
    console.error("Error finding products by name:", err);
    res.status(500).send({ message: "Error finding products by name." });
  }
};


module.exports = {
  findAll,
  store,
  findOne,
  update,
  deleteOne,
  findByName


}