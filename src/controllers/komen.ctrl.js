const db = require("../models");
const Komen = db.komen;



const findAll =  (req, res) => {
  Komen.find()
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

const findOne =  (req, res) => {
  const id = req = req.params.id;
  Komen.findById(id)
  .then(data => {
    if (!data) {
      res.status(404).send({ message: "Not found Category with id " + id });
    } else res.send(data);
  })
  .catch(err => {
      res.status(500)
      .send({ message: "Error retrieving Category with id=" + id });
  });
};


const store = (req, res) => {
  if (!req.body.konten_komentar || !req.body.id_user || !req.body.id_postingan) {
    return res.status(400).send({ message: "Content komen can not be empty!" });
  }

  const komen = new Komen({
    konten_komentar: req.body.konten_komentar,
    id_user: req.body.id_user,
    id_postingan: req.body.id_postingan
  });

  komen.save(komen)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the comment."
      });
    });
};


const update =  (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  Komen.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data){
        res.status(404).send({
          message: `Cannot update Komen with id=${id}. Maybe Testimoni was not found!`
        });
      } else res.send({ message: "Komen was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Komen with id=" + id
      });
    });
  }

  const deleteOne =  (req, res) => {
    const id = req.params.id;
    Komen.findByIdAndDelete(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Komen with id=${id}. Maybe Komen was not found!`
          });
        } else {
          res.send({ 
            message: "Komen was deleted successfully!"
        });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Komen with id=" + id
        });
      });
  };



module.exports = {
    findAll,
    findOne,
    store,
    update,
    deleteOne
}