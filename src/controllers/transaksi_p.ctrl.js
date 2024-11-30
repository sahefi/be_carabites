const db = require("../models");
const Transaksi = db.transaksi_p;

// Find all records
const findAll = (req, res) => {
  Transaksi.find()
    .populate("id_user") // Populate user fields
    .populate("id_produk") // Populate product fields
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


const store = async (req, res) => {
  try {
    const transactions = req.body; 

    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).send({ message: "Input should be an array of transactions." });
    }

    
    const createdTransactions = [];

    for (const transactionData of transactions) {
      const { id_user, id_produk, metode_pembayaran, jumlah_produk, nomor_invoice } = transactionData;

      if (!id_user || !id_produk || !metode_pembayaran || !jumlah_produk || !nomor_invoice) {
        return res.status(400).send({ message: "All fields are required!" });
      }

      const product = await Produk.findById(id_produk);

      if (!product) {
        return res.status(404).send({ message: `Product with ID ${id_produk} not found!` });
      }

      const total_harga = product.harga * parseInt(jumlah_produk);

      const transaksi_p = new Transaksi({
        id_user,
        id_produk,
        metode_pembayaran,
        jumlah_produk: parseInt(jumlah_produk),
        total_harga,
        nomor_invoice,
      });

      const savedTransaction = await transaksi_p.save();
      createdTransactions.push(savedTransaction);
    }

    res.status(201).send({
      message: "Successfully created multiple transactions",
      data: createdTransactions.map((transaction) => ({
        id_user: transaction.id_user,
        id_produk: transaction.id_produk,
        metode_pembayaran: transaction.metode_pembayaran,
        jumlah_produk: transaction.jumlah_produk,
        nomor_invoice: transaction.nomor_invoice,
        total_harga: transaction.total_harga,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        id: transaction.id,
      })),
    });
  } catch (err) {
    console.error("Error in store function:", err);
    res.status(500).send({
      message: err.message || "Could not create the transactions.",
    });
  }
};


const update = async (req, res) => {
  try {
    const {
      id_user,
      id_produk,
      metode_pembayaran,
      jumlah_produk,
      nomor_invoice,
    } = req.body;

    
    if (!id_user || !id_produk || !metode_pembayaran || !jumlah_produk || !nomor_invoice) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const id = req.params.id;
    const transaksi_p = await Transaksi.findById(id);

    if (!transaksi_p) {
      return res.status(404).send({ message: `Transaction with id=${id} not found.` });
    }

    
    const product = await Produk.findById(id_produk);

    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }

    
    const total_harga = product.harga * parseInt(jumlah_produk);

    
    transaksi_p.id_user = id_user;
    transaksi_p.id_produk = id_produk;
    transaksi_p.metode_pembayaran = metode_pembayaran;
    transaksi_p.jumlah_produk = parseInt(jumlah_produk);
    transaksi_p.total_harga = total_harga;
    transaksi_p.nomor_invoice = nomor_invoice;

    const updatedData = await transaksi_p.save();
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
    const transaksi_p = await Transaksi.findById(id);

    if (!transaksi_p) {
      return res.status(404).send({ message: `Transaction with id=${id} not found.` });
    }

    await Transaksi.findByIdAndDelete(id);
    res.send({ message: "Transaction deleted successfully!" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).send({ message: `Error deleting transaction with id=${req.params.id}` });
  }
};

const countTotalHarga = async (req, res) => {
  try {
    const id_user = req.params.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();  
    const currentYear = currentDate.getFullYear();
    
    
    const transactions = await Transaksi.find({ id_user: id_user });
    console.log(transactions);
    
    if (transactions.length === 0) {
      return res.status(404).send({ message: `No transactions found for user with id=${id_user}` });
    }

    
    const totalHargaAllTime = transactions.reduce((acc, transaction) => {
      return acc + (Number(transaction.total_harga) || 0); 
    }, 0);

    
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt); 
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    
    const totalHargaThisMonth = filteredTransactions.reduce((acc, transaction) => {
      return acc + (Number(transaction.total_harga) || 0); 
    }, 0);

    const totalTransaksiAllTime = transactions.length;
    const totalTransaksiThisMonth = filteredTransactions.length;

    
    res.status(200).send({
      totalHargaAllTime,   
      totalHargaThisMonth, 
      totalTransaksiAllTime, 
      totalTransaksiThisMonth, 
      currentDate,
    });
  } catch (err) {
    console.error("Error counting total price:", err);
    res.status(500).send({
      message: "Error occurred while calculating the total price.",
    });
  }
};


module.exports = {
  findAll,
  store,
  deleteOne,
  update,
  countTotalHarga
};
