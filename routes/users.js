var express      = require('express');
var router       = express.Router();
var jsonwebtoken = require('jsonwebtoken');

const TokenMaker = require('../helpers/tokenMaker');


var secretKey = "ScreenWatch";

var tokenMaker = new TokenMaker(secretKey);


var Users = require('../schema/user');

function checkSignIn(req, res){
    if(req.session.user){
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        next(err);  //Error, trying to access unauthorized page!
    }
}

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });


router.get('/get_user', function(req, res){
    Users.find({})
    .then( function(users){
        if(users){
            res.json({Users: users});
        }
        else{
            res.json({success: false, "getAllEvent Got error ": + err});
            console.log("getAllEvent Got error: " + err);
        }
    });
});

router.post('/signup', function(req, res, next) {

    var user = new Users({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        
    });

    var token = tokenMaker.createUserToken(user);
    user.save(function(err) {
        if(err) {
            res.send(err);
            return;
        }
    });

});



//-----------------------------------------------------
//   LOGIN
//-----------------------------------------------------
router.post('/login', function(req, res) {

    Users.findOne({
        username: req.body.username
            //}).select('password').exec(function(err, user) { // this will only select _id and password in user obj
        }).exec(function(err, user) {	//// this will select all fields in user obj

        if(err) throw err;

        if(!Users) {
            res.send({ success: false, message: 'User does not exist !'});
            //res.status(403).send( {success: false, message: 'User does not exist !'});
        } else if(user) {

            

            var validPassword = user.comparePassword(req.body.password);

            if(!validPassword) {
                res.json({ success: false, message: 'Invalid Password !'});
                //res.status(403).send( { success: false, message: 'Invalid Password !'});
            } else {

                //-------------------------
                // login ok, create token
                //-------------------------
                var token = tokenMaker.createUserToken(user);
                //req.session.user = user;
                //console.log("user logged in: " + user);
                //res.redirect('/');

                //FIXME - use it for REST APIS later !

                console.log("login ok");

                res.json({
                    success: true,
                    message: "Successfully login",
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    token: token
                });

            }
        }
    });
});

//-----------------------------------------------------
//   VERIFY
//-----------------------------------------------------
router.get('/verify/:token', function(req, res) {
	var token = req.params.token;

	console.log("Got verification token: " + token);

  	if(!token) {
  		res.send("No token found!");
  		return;
  	}

    jsonwebtoken.verify(token, secretKey, function(err, decoded){

            if(err) {
                res.send("Token verification failed!");
                return;
            } 

        // approving user
		Users.update({_id: decoded._id}, {is_verified: true}, function(err, numberAffected, rawResponse) {

			console.log("-- saved: " + err);
				if(err) res.send("Token verification failed!");
				else {

					res.send("User verified Successfully!");

                    // var parentDir  = __dirname.substring(0, __dirname.lastIndexOf('/'));

					// res.sendFile(parentDir + '/public/views/general/verification_done.html') ;
			}
		})
             	
    });//jsonwebtoken

    

	//res.send("ok");
});

//-----------------------------------------------------
//   LOGOUT
//-----------------------------------------------------
router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log("user logged out")
    });
    res.redirect('/');
});//logout

//-----------------------------------------------------
//   GET LOGGED IN USER INFO
//-----------------------------------------------------
router.get('/me', function(req, res){

	console.log("--- me ---");

	console.log("me: " + JSON.stringify(req.decoded));

    res.json(req.decoded);
});




module.exports = router;
