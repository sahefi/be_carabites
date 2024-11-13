const db = require("../models");
const Penggalangan = db.penggalangan;
const fs = require('fs');
const uploadFile = require("../middleware/upload");



const findAll =  (req, res) => {
  Penggalangan.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Testimoni."
      });
    });
}

const store = async (req, res) => {
    try {
      await uploadFile(req, res);
  
      if (req.file === undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      const {
        id_lembaga,
        namaGalangDana,
        konten_galang_dana,
        target_galang_dana,
        tanggalMulai,
        tanggalAkhir
      } = req.body;
  
      if (!id_lembaga || !namaGalangDana || !konten_galang_dana || !target_galang_dana || !tanggalMulai || !tanggalAkhir) {
        return res.status(400).send({ message: "All fields are required!" });
      }
  
      const penggalangan = new Penggalangan({
        id_lembaga,
        namaGalangDana,
        konten_galang_dana,
        filename: req.file.originalname, 
        target_galang_dana,
        tanggalMulai,
        tanggalAkhir,
        statusGalangDana: 'pending'
      });
  
        penggalangan.save()
        .then(data => {
          res.status(200).send({
            message: "Successfully created galang Dana: " + namaGalangDana,
            data: data
          });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the fundraising."
          });
        });
  
    } catch (err) {
      res.status(500).send({
        message: err.message || "Could not upload the file."
      });
    }
  };

  const deleteOne = async (req, res) => {
    try {
      const id = req.params.id;
      const Penggalangan = await Penggalangan.findById(id);
  
      if (!Penggalangan) {
        return res.status(404).send({ message: `Produk with id=${id} not found.` });
      }
        // const filePath = __basedir + "/resources/static/assets/uploads/" + produk.filename;
      await penggalangan.findByIdAndDelete(id);
      res.send({ message: "Produk deleted successfully!" });
  
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).send({ message: `Error deleting product with id=${req.params.id}` });
    }
  };

  const update = async (req, res) => {
    try {
        const directoryPath = __basedir + "/resources/static/assets/uploads/";
        
        await uploadFile(req, res);
        
        const {
            id_lembaga,
            namaGalangDana,
            konten_galang_dana,
            target_galang_dana,
            statusGalangDana,
            tanggalMulai,
            tanggalAkhir
        } = req.body;

        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        if (!id_lembaga || !namaGalangDana || !konten_galang_dana || !target_galang_dana || !statusGalangDana || !tanggalMulai || !tanggalAkhir) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        const id = req.params.id;
        const newFilename = req.file.originalname;

        const penggalangan = await penggalangan.findById(id);

        if (!penggalangan) {
            fs.unlinkSync(directoryPath + newFilename);
            return res.status(404).send({ message: "Not found Produk with id " + id });
        }

        produk.id_lembaga = id_lembaga;
        produk.namaGalangDana = namaGalangDana;
        produk.konten_galang_dana = konten_galang_dana;
        produk.filename = newFilename;
        produk.target_galang_dana = target_galang_dana;
        produk.statusGalangDana = statusGalangDana;
        produk.tanggalMulai = tanggalMulai;
        produk.tanggalAkhir = tanggalAkhir;

        const updatedData = await produk.save();
        res.send(updatedData);

    } catch (err) {
        console.error("Error updating produk:", err);
        res.status(500).send({ message: "Error updating produk with id=" + req.params.id });
    }
};

  
  

module.exports = {
    findAll,
    store,
    deleteOne,
    update
}