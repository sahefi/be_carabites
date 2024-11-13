const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(file.originalname);
  },
});

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("files", 10); // Mengizinkan hingga 10 file diunggah sekaligus

// Promisify the upload middleware
let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
