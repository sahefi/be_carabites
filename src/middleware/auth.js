const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
const getUserName = async (req, res) => {
  try {
    // Ambil pengguna berdasarkan ID dari token
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    res.status(200).send({ nama_user: user.nama_user });
  } catch (error) {
    res.status(500).send("Error retrieving user data");
  }
};

module.exports = {
  verifyToken,
  getUserName
}