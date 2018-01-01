var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var router       = express.Router();
var fileUpload   = require('express-fileupload');
const cors       = require('cors');
const logger     = require('../helpers/logger');
var ScreenShot   = require('../schema/screenShot');




var app = express();
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SECRET_KEY="ScreenWatch"
app.use(cors());


app.use(fileUpload());

router.get('/file_upload', function (req, res) {
    res.sendFile(__dirname + "../public/views/general/" + "file_upload.html" );
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
