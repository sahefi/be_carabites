const fs = require('fs');
const readImage = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
  fs.readFile(directoryPath + fileName, function(err, data) {
    if (err){
      res.status(500).send({
        message: "Error: " + err,
      });
    } else{
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data); // Send the file data to the browser.
    } 
  });
};

module.exports = {
  readImage,
};