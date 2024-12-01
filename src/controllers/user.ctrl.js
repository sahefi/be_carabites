const db = require("../models");
const User = db.user;

const fs = require('fs');
const uploadFile = require("../middleware/upload");
const moment = require("moment");
// const baseUrl = "http://localhost:4001/public/upload/";


const findAll = (req, res) => {
  // Base URL for accessing uploaded images
  const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;

  User.find()    
    .then(data => {      
        console.log(data);
        
      const transformedData = data.map(item => ({
        ...item._doc,
          avatar: item.avatar
              ? item.avatar.map(file => `${baseUrl}${file}`)
              : null 
      }));

      res.send(transformedData); 
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
    console.log(req.files);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload files!" });
    }
       
    // Extract filenames from uploaded files
    const uploadedFiles = req.files.map((file) => file.originalname);


    // Destructure and validate required fields from the request body
    const {
      nama_user,
      deskripsi_user,
      kategori_user,
      jumlah_user,
      harga,
      kota,
      kecamatan,
      kelurahan,
      alamat,
      tanggal_pengambilan,
      jam,
      id_user,
    } = req.body;

    // Validate required fields
    if (
      !nama_user ||
      !deskripsi_user ||
      !kategori_user ||
      !jumlah_user ||
      !harga ||
      !kota ||
      !kecamatan ||
      !kelurahan ||
      !alamat ||
      !tanggal_pengambilan ||
      !jam ||
      !id_user
    ) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Create a new product instance
    const user = new User({
      nama_user,
      deskripsi_user,
      kategori_user,
      jumlah_user: parseInt(jumlah_user, 10),
      harga: parseFloat(harga),
      filename: uploadedFiles, // Attach filenames
      kota,
      kecamatan,
      kelurahan,
      alamat,
      tanggal_pengambilan: new Date(tanggal_pengambilan),
      jam,
      id_user,
    });

    // Save the product to the database
    const data = await user.save();
    
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
        console.log(id);

        const produk = await User.findById(id);
        const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;
        console.log(produk);
        
        if (!produk) {
            return res.status(404).send({
                message: `User with id ${id} not found.`,
            });
        }

        
        if (produk.avatar && Array.isArray(produk.avatar)) {
            produk.avatar = produk.avatar.map(file => `${baseUrl}${file}`);
        } else {
            produk.avatar = null; 
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

    await uploadFile(req, res);    
    
    if (!req.files) {
      return res.status(400).send({ message: "Please upload a files!" });
    }
    
    const {
      nama_user,
      email,
      no_telp_user,    
      no_rek,
      alamat,
      deskripsi,       
    } = req.body;

    // Validate required fields
    if (
      !nama_user ||
      !email ||
      !no_telp_user ||
      !no_rek ||
      !alamat
    ) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const id = req.params.id;
    const uploadedFiles = req.files.map((file) => file.originalname);    
    
    const user = await User.findById(id);

    if (!user) {
      fs.unlinkSync(directoryPath + newFilename);
      return res.status(404).send({ message: "Not found User with id " + id });
    }

    user.avatar = uploadedFiles[0];
    user.nama_user = nama_user;
    user.email = email;
    user.no_telp_user = no_telp_user;   
    user.no_rek = no_rek;   
    user.deskripsi = deskripsi; 
    user.alamat = alamat;   
        
    const updatedData = await user.save();
    console.log(updatedData);
    
    res.send(updatedData);

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send({ message: "Error updating user with id=" + req.params.id });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: `User with id=${id} not found.` });
    }
    // const filePath = __basedir + "/resources/static/assets/uploads/" + user.filename;
    await User.findByIdAndDelete(id);
    res.send({ message: "User deleted successfully!" });

  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send({ message: `Error deleting product with id=${req.params.id}` });
  }
};

const findByName = async (req, res) => {
  try {
    const { nama_user } = req.query;  // Get the name from query parameters

    if (!nama_user) {
      return res.status(400).send({ message: "Product name is required." });
    }

    const products = await User.find({ nama_user: new RegExp(nama_user, "i") });

    if (products.length === 0) {
      return res.status(404).send({ message });
    }

    res.status(200).send(products);
  } catch (err) {
    console.error("Error finding products by name:", err);
    res.status(500).send({ message: "Error finding products by name." });
  }
};

const updateVerif = async (req, res) => {
  try {
    const { id, is_verif } = req.body; 
    if (!['0', '1', '2'].includes(is_verif)) {
      return res.status(400).send({ message: "Invalid value for is_verif. It must be '0', '1', or '2'." });
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: `User with id=${id} not found.` });
    }
    user.is_verif = is_verif;    
    const updatedUser = await user.save();    
    res.status(200).send({
      message: "User verification status updated successfully!",
      data: updatedUser
    });

  } catch (err) {
    console.error("Error updating verification status:", err);
    res.status(500).send({
      message: `Error updating verification status for user with id=${req.body.id}.`
    });
  }
};


module.exports = {
  findAll,
  store,
  findOne,
  update,
  deleteOne,
  findByName,
  updateVerif
}