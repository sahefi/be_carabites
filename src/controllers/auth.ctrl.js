const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const register = async (req, res) => {
    try {
      const { nama_user, email, password, jenis_kelamin, tgl_lahir_user, no_telp_user, alamat_user, role } = req.body;
  
      // Validate required fields
      if (!nama_user || !email || !password || !jenis_kelamin || !tgl_lahir_user || !no_telp_user || !alamat_user || !role) {
        return res.status(400).send({ message: "Input semua dong bang" });
      }
  
      // Check if user already exists
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(400).send({ message: "udah punya akun gitu bang" });
      }
  
      // Hash the password
      const encryptedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );
    user.token = token;
      // Create a new user instance
      const user = new User({
        nama_user,
        email,
        password: encryptedPassword,
        jenis_kelamin,
        tgl_lahir_user,
        no_telp_user,
        alamat_user,
        role,
      });
  
      // Save the user using async/await
      const savedUser = await user.save();
  
      // Respond with the saved user
      res.status(201).json(savedUser);
  
    } catch (err) {
      console.error("Error saving user:", err);
      res.status(500).send({ message: "Error Save Data!" });
    }
  };
const findAll =  (req, res) => {
    User.find()
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
  


// nama_user: String,
// email: { type:String, unique:true },
// password: String,
// jenis_kelamin,
// tgl_lahir_user,
// no_telp_user,
// alamat_user,
// token: String,
// role: String


module.exports = {
    register,
    findAll
}