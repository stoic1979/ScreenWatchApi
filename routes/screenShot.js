var express      = require('express');
var router       = express.Router();
var fileUpload   = require('express-fileupload');

var ScreenShot = require('../schema/screenShot');

var secretKey = "ScreenWatch";


router.get('/file_upload', function (req, res) {
    res.sendFile(__dirname + "/../public/views/general/" + "file_upload.html" );
})


router.post('/', function(req, res, next){
	var screenShot = new ScreenShot({
		user: req.body.user,
		memo: req.body.memo,
		img: req.body.img,
		created_at: req.body.created_at,
		
	});

	screenShot.save(function(err) {
        if(err) {
            res.send(err);
            console.log("Error", +err);
            return;
        }
        console.log("screenshot created");
    });

});

router.post('/file_upload', function (req, res) {

    if (!req.files)
    return res.status(400).send('No files were uploaded.');

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var sampleFile = req.files.sampleFile;

  console.log("sampleFile: " + sampleFile.name);

  var filePath = "./" + sampleFile.name;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(filePath, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });

})


module.exports = router;
