const db = require("../models");
const Transaksi = db.transaksi;
const Produk = db.produk; // Ensure `produk` is correctly defined in your `models/index.js`

// Find all records
const findAll = (req, res) => {
  Transaksi.find()
    .populate("id_user", "nama email") // Populate user fields
    .populate("id_produk", "nama harga") // Populate product fields
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error("Error finding transactions:", err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

// Store a new record
const store = async (req, res) => {
  try {
    const {
      id_user,
      id_produk,
      metode_pembayaran,
      jumlah_produk,
      nomor_invoice,
    } = req.body;

    // Validate required fields
    if (!id_user || !id_produk || !metode_pembayaran || !jumlah_produk || !nomor_invoice) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Fetch the product data to get the price
    const product = await Produk.findById(id_produk);

    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }

    // Calculate the total price
    const total_harga = product.harga * parseInt(jumlah_produk);

    // Create the transaction
    const transaksi = new Transaksi({
      id_user,
      id_produk,
      metode_pembayaran,
      jumlah_produk: parseInt(jumlah_produk),
      total_harga,
      nomor_invoice,
    });

    const data = await transaksi.save();
    res.status(201).send({
      message: "Successfully created transaction",
      data: {
        id_user: data.id_user,
        id_produk: data.id_produk,
        metode_pembayaran: data.metode_pembayaran,
        jumlah_produk: data.jumlah_produk,
        nomor_invoice: data.nomor_invoice,
        total_harga: data.total_harga, // Include total_harga
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        id: data.id,
      },
    });
  } catch (err) {
    console.error("Error in store function:", err);
    res.status(500).send({
      message: err.message || "Could not create the transaction.",
    });
  }
};

// Update a record
const update = async (req, res) => {
  try {
    const {
      id_user,
      id_produk,
      metode_pembayaran,
      jumlah_produk,
      nomor_invoice,
    } = req.body;

    // Validate required fields
    if (!id_user || !id_produk || !metode_pembayaran || !jumlah_produk || !nomor_invoice) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const id = req.params.id;
    const transaksi = await Transaksi.findById(id);

    if (!transaksi) {
      return res.status(404).send({ message: `Transaction with id=${id} not found.` });
    }

    // Fetch the product data to get the price
    const product = await Produk.findById(id_produk);

    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }

    // Calculate the total price
    const total_harga = product.harga * parseInt(jumlah_produk);

    // Update fields
    transaksi.id_user = id_user;
    transaksi.id_produk = id_produk;
    transaksi.metode_pembayaran = metode_pembayaran;
    transaksi.jumlah_produk = parseInt(jumlah_produk);
    transaksi.total_harga = total_harga;
    transaksi.nomor_invoice = nomor_invoice;

    const updatedData = await transaksi.save();
    res.send({
      message: "Transaction updated successfully",
      data: updatedData,
    });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).send({ message: `Error updating transaction with id=${req.params.id}` });
  }
};

// Delete a record
const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const transaksi = await Transaksi.findById(id);

    if (!transaksi) {
      return res.status(404).send({ message: `Transaction with id=${id} not found.` });
    }

    await Transaksi.findByIdAndDelete(id);
    res.send({ message: "Transaction deleted successfully!" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).send({ message: `Error deleting transaction with id=${req.params.id}` });
  }
};

module.exports = {
  findAll,
  store,
  deleteOne,
  update,
};
