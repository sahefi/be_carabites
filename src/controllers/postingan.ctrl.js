const db = require("../models");
const Postingan = db.postingan;

const fs = require('fs');
const uploadFile = require("../middleware/upload");
const baseUrl = "http://localhost:4001/public/upload/";

const findAll =  (req, res) => {
    Postingan.find()
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

module.exports = {
    findAll
  };





