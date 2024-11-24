const util = require("util");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Maximum file size: 2MB
const maxSize = 2 * 1024 * 1024;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads"); // Use the validated upload directory
  },
  filename: (req, file, cb) => {
    console.log(`Uploading file: ${file.originalname}`);
    cb(null, `${file.originalname.replace(/\s+/g, "_")}`); // Add timestamp, sanitize filename
  },
});

// Multer middleware configuration
const uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize }, // Limit file size to 2MB
}).array("files", 10); // Allow up to 10 files with the field name "files"

// Promisify the upload middleware
const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
