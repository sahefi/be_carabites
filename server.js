// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();
const initRoutes = require("./src/routes");
const db = require("./src/models");
const bodyParser = require('body-parser');




// Set base directory globally
global.__basedir = __dirname;

// Define CORS options
var corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Use environment variable or fallback to default
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
// Set batas ukuran payload menjadi 10MB (sesuaikan dengan kebutuhan Anda)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Init DB connection
// Init DB connection
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Initialize Routes
initRoutes(app);

// Simple route for testing
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

// Set port and start the server
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
