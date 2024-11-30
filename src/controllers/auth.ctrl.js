const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;



const register = async (req, res) => {
  try {
    const { 
      nama_user, 
      email, 
      password, 
      konfirmasi_password, 
      no_telp_user, 
      role 
    } = req.body;

    
    
    
    
    if (!email || !password || !konfirmasi_password) {
      return res.status(400).send({ message: "All Field Required" });
    }

    if (password !== konfirmasi_password) {
      return res.status(400).send({ message: "Password dan konfirmasi password tidak cocok" });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).send({ message: "Already Registered" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      nama_user: nama_user || null,
      email,
      no_telp_user: no_telp_user || null,
      role: role || 'pengguna',
      password: encryptedPassword,
      token: null
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );
    user.token = token;

    const savedUser = await user.save();
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
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
  
      const baseUrl = `${req.protocol}://${req.get("host")}/resources/uploads/`;
      res.status(200).json({
        user: {
          id: user._id,
          nama_user: user.nama_user,
          email: user.email,
          role: user.role,
          no_telp_user: user.no_telp_user,
          avatar : `${baseUrl}${user.avatar}`,   
          no_rek:user.no_rek,
          deskripsi:user.deskripsi,
          alamat:user.alamat          
        },
        token
      });
  
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).send({ message: "Error during login" });
    }
  };
  




module.exports = {
    register,
    findAll,
    login
}