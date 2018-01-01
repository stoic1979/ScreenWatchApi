var bodyParser   = require('body-parser');
var express      = require('express');
//var exphbs     = require('express-handlebars');
var mongoose     = require('mongoose');
var path         = require('path');
var session      = require('express-session');
var jsonwebtoken = require('jsonwebtoken');
var index        = require('./routes/index');
var users        = require('./routes/users');
var screenShots  = require('./routes/screenShot');
const cors       = require('cors');
const logger     = require('./helpers/logger');
var  fileUpload   = require('express-fileupload');


var fs           = require('fs');

//----------------------------------------------------------------------------
//  SETUP APP
//----------------------------------------------------------------------------
var app = express();
const SECRET_KEY="ScreenWatch"
app.use(cors());
app.use(fileUpload());


app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', exphbs({defaultLayout: 'main', extname: '.html'}));
//app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(session({secret: "Your secret key"}));

// 

// var dir = './Upload';
// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
//     }
// else {
//     console.log("directory already exists");
//     }


app.get('/file_upload', function (req, res) {
    res.sendFile(__dirname + "/public/views/general/" + "file_upload.html" );
})

app.post('/file_upload', function (req, res) {

     var dir = `./Upload`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        }
    else {
        console.log("directory already exists");
        }

    if (!req.files)
    return res.status(400).send('No files were uploaded.');

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var sampleFile = req.files.sampleFile;
  var user_id    = req.body.user_id;



 var dir = `./Upload/${user_id}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        }
    else {
        console.log("directory already exists");
        }

  console.log("sampleFile: " + sampleFile.name);

  var filePath = `./Upload/${user_id}/` + sampleFile.name;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(filePath, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });

})
//---------------------------------------------------
// url ignore list for token validation middleware
//---------------------------------------------------
var ignore_list = [
    '/users/signup', '/users/login' , '/screenShots/file_upload', '/file_upload',
   ]

//----------------------------------------------------------------------------
//   TOKEN VALIDATION
// 
//   This is middleware function with no mount path. 
//   The function is executed every time the app receives a request.
//   NOTE - register this middleware before registering routes
//----------------------------------------------------------------------------

app.use(function(req, res, next){

    logger.debug("api.use() :: Got some request, validating token, req=" + req.originalUrl);


    // if url is in ignore list, move onto next()
    if (ignore_list.indexOf(req.originalUrl) > -1) {
        return next();
    }

    // if(req.originalUrl.indexOf('/users/verify/') > -1) {
    //     return next();
    // }

    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    if(token) {

        jsonwebtoken.verify(token, SECRET_KEY, function(err, decoded){

            if(err) {
                //res.status(403).send({success: false, message: "Failed to authenticate user"});
                logger.warn("api.use() :: :: Failed to authenticate user");
            } else {
                req.decoded = decoded;
                logger.debug("api.use() :: -> decoded: " + JSON.stringify(req.decoded) );
                next();
            } 	
        });

    } else {
        logger.warn("api.use() :: No token provided");
        res.status(403).send({success: false, message: "No token provided"});
    }
});//use


//----------------------------------------------------------------------------
// adding routers
//----------------------------------------------------------------------------
app.use('/',            index);
app.use('/users',       users);
app.use('/screenShots', screenShots);

app.get('/time', function(request, response) {

   var d = new Date();
   res.send("Current Date: " + d);

});


//----------------------------------------------------------------------------
//   CONNECT TO MONGODB
//----------------------------------------------------------------------------
const MONGODB_URI = "mongodb://admin:123@localhost/ScreenWatch?authSource=admin";

mongoose.connect(MONGODB_URI, function(err) {
    if(err) {
        console.log("[SchemaTest] failed to connect to database: " + err);
        return;
    } 

    console.log("[SchemaTest] Successfully connected to database. ");

    
});



//--------------------------------------------------
//    STARTING SERVER
//--------------------------------------------------
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Screen Watch app listening at http://%s:%s", host, port);
})

