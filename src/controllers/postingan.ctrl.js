const db = require("../models");
const Postingan = db.postingan;

const fs = require('fs');
const uploadFile = require("../middleware/upload");
const baseUrl = "http://localhost:4001/public/upload/";

const findAll = (req, res) => {
    Postingan.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving posts."
        });
      });
}

const store = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload files!" });
    }

    const uploadedFiles = req.files.map((file) => file.originalname);

    const { judul, konten, kategori } = req.body;

    // Validate required fields
    if (!judul || !konten) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Validate the `kategori` field
    const allowedCategories = ["amal", "pendidikan", "kesehatan"];
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


module.exports = {
    findAll,
    store
};
