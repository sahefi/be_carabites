  // Load environment variables from .env file
  require('dotenv').config();

  const express = require("express");
  const cors = require("cors");
  const path = require("path");
  const bodyParser = require('body-parser');
  const db = require("./src/models");
  const initRoutes = require("./src/routes");

  const app = express();

  // Set base directory globally
  global.__basedir = __dirname;

  // Define CORS options
  const corsOptions = {
    origin: (origin, callback) => {
      console.log('Origin:', origin);  // Log the request origin to debug
      if (process.env.FRONTEND_URL || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  // Apply CORS middleware
  app.use(cors(corsOptions));

  // Set payload size limits for JSON and URL-encoded data
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Serve static files for uploaded images
  app.use("/resources", express.static(path.join(__dirname, "public")));

  // Connect to the database
  db.mongoose
    .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch((err) => {
      console.error("Cannot connect to the database!", err);
      process.exit();
    });

  // Initialize routes
  initRoutes(app);

  // Simple test route
  app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the application." });
  });

  // Set the port and start the server
  const PORT = process.env.PORT || 8085;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
