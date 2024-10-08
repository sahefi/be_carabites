// require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const initRoutes = require("./src/routes");
const db = require("./src/models");

global.__basedir = __dirname;
var corsOptions = {
  origin: "http://localhost:8085"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Init DB
db.mongoose
  .connect(db.url, {
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

// init Routes
initRoutes(app);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


// set port, listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});




