const db = require("../models");
const Produk = db.produk;

const fs = require('fs');
const uploadFile = require("../middleware/upload");
// const baseUrl = "http://localhost:4001/public/upload/";


// Retrieve all products
const findAll =  (req, res) => {
    Produk.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving user."
        });
      });
}

const store = async (req, res) => {
    try {
      // Call the file upload middleware
      await uploadFile(req, res);
      
      // Check if the file is uploaded
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      // Validate the required fields
      const { nama_produk, jenis_produk, harga, kategori_produk, lokasi_produk, deskripsi_produk, id_user } = req.body;
  
      if (!nama_produk || !jenis_produk || !harga || !kategori_produk || !lokasi_produk || !deskripsi_produk || !id_user) {
        return res.status(400).send({ message: "All fields are required!" });
      }
  
      const produk = new Produk({
        nama_produk,
        filename: req.file.originalname, // The uploaded file name
        jenis_produk,
        harga,
        kategori_produk,
        lokasi_produk,
        deskripsi_produk,
        id_user
      });
  
      produk.save()
        .then(data => {
          res.status(200).send({
            message: "Successfully created product: " + req.file.originalname,
            data: data
          });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the product."
          });
        });
  
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file ? req.file.originalname : ''}. ${err}`,
      });
    }
  };
  const findOne = async (req, res) => {
    try {
      // Get the product ID from the request parameters (or use another field like nama_produk if needed)
      const id = req.params.id; // Assuming you're looking up by ID
  
      // Find the product by ID
      const produk = await Produk.findById(id);
  
      // If the product is not found, return an error
      if (!produk) {
        return res.status(404).send({
          message: `Product with id ${id} not found.`,
        });
      }
  
      // If found, return the product data
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
  

  


module.exports = {
    findAll,
    store,
    findOne,
    update,
    deleteOne
    

}