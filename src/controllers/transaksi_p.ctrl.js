const db = require("../models");
const Transaksi = db.transaksi_p;

// Find all records
const findAll = (req, res) => {
  Transaksi.find()
    .populate("id_user") // Populate user fields
    .populate("id_penggalangan") // Populate transaksi fields
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
  const transactionData = req.body; 
    
    const { id_user, id_penggalangan, metode_pembayaran, jumlah_penggalangan, nomor_invoice } = transactionData;

    if (!id_user || !id_penggalangan || !metode_pembayaran || !jumlah_penggalangan || !nomor_invoice) {
      return res.status(400).send({ message: "All fields are required!" });
    }        
    
    const transaksi_p = new Transaksi({
      id_user,
      id_penggalangan,
      metode_pembayaran,
      jumlah_penggalangan,      
      nomor_invoice,
    });
    
    const savedTransaction = await transaksi_p.save();    
    
    res.status(201).send({
      message: "Successfully created transaksi",      
    });
  } catch (err) {
    console.error("Error in store function:", err);
    res.status(500).send({
      message: err.message || "Could not create the transaction.",
    });
  }
};



const update = async (req, res) => {
  try {
    const {
      id_user,
      id_penggalangan,
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

    
    const transaksi = await Transaksi.findById(id_produk);

    if (!transaksi) {
      return res.status(404).send({ message: "Product not found!" });
    }

    
    const total_harga = transaksi.harga * parseInt(jumlah_produk);

    
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

const counTotal = async (req, res) => {
  try {
    const id_user = req.params.id;
    const currentDate = new Date();
    
    
    const transactions = await Transaksi.find()
      .populate({
        path: 'id_penggalangan', // Populasi id_penggalangan untuk akses id_user
        match: { 'id_user': id_user }, // Hanya ambil penggalangan yang memiliki id_user yang sama
      })
      .exec();    
      
    
    if (transactions.length === 0) {
      return res.status(404).send({ message: `No transactions found for user with id=${id_user}` });
    }

    
    const totalHargaAllTime = transactions.reduce((acc, transaction) => {
      return acc + (Number(transaction.jumlah_penggalangan) || 0); 
    }, 0);

    
    const filteredTransactions = transactions.filter(transaction => {      
      return transaction.id_penggalangan && transaction.id_penggalangan.status === 'active';
    });
    
    const totalHargaActive = filteredTransactions.reduce((acc, transaction) => {      
          
      return acc + (Number(transaction.jumlah_penggalangan) || 0); 
    }, 0);
    
    console.log(totalHargaActive);   

    
    res.status(200).send({
      totalHargaAllTime,   
      totalHargaActive,       
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
  counTotal
};
