const util = require("util");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Maximum file size: 2MB
const maxSize = 2 * 1024 * 1024;

// Define the upload directory
const uploadDir = path.join(__dirname, "/resources/static/assets/uploads/");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the validated upload directory
  },
  filename: (req, file, cb) => {
    console.log(`Uploading file: ${file.originalname}`);
    cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to avoid overwriting
  },
});

// Multer middleware configuration
let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize }, // Limit file size to 2MB
}).array("files", 10); // Allow up to 10 files with the field name "files"

// Promisify the upload middleware
let uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
