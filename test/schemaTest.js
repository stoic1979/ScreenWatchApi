const mongoose   = require('mongoose');
// const assert   = require('chai').assert;
mongoose.Promise = global.Promise;
const User       = require('../schema/user');
const ScreenShot = require('../schema/screenShot');

//const port     = process.env.PORT || process.env.TEAM_MANAGER_PORT;


//------------------------------------------------------------------
//
//                 DUMMY DATA
//
//------------------------------------------------------------------

/*
var auntpolly = {
    first_name: "Aunt",
    last_name: "Polly",
    username: "auntpolly",
    email: "auntpolly@gmail.com",
    password: "123",
    
};

var tomsawyer = {
    first_name: "Tom",
    last_name: "Sawyer",
    username: "tomsawyer",
    email: "tomsawer@gmail.com",
    password: "123",
   
};
*/

//------------------------------------------------------------------
// Add User
//------------------------------------------------------------------
function addUser(){
  var user = new User({
    first_name: "Aunt",
    last_name: "Polly",
    username: "auntpolly",
    email: "auntpolly@gmail.com",
    password: "123",

  });
  user.save(function(err, s){
    if (err) {
      console.log("failed to save the user, Got Exception: " + err);
    }
    else{
      console.log("Successfully saved user: \n" +s);
    }
  });
}

function addScreenShot(){
  var screenshot = new ScreenShot({
    user:"5a45fc8174c87f310df76ab2",
    memo: "test memo",
    img: "testing",
    

  });
  screenshot.save(function(err, s){
    if (err) {
      console.log("failed to save the screenshot, Got Exception: " + err);
    }
    else{
      console.log("Successfully saved screenshot: \n" +s);
    }
  });
}

//------------------------------------------------------------------
//
//                 CONNECTING TO MONGODB
//
//------------------------------------------------------------------
// this is uri for team manager's dev/test database
// const TEAM_MANAGER_TEST_MONGODB_URI = process.env.TEAM_MANAGER_TEST_MONGODB_URI;
// mongoose.Promise = global.Promise;
// mongoose.connection.openUri(TEAM_MANAGER_TEST_MONGODB_URI);  

//  step 1: conenct to mongodb
const MONGODB_URI = "mongodb://admin:123@localhost/ScreenWatch?authSource=admin";

mongoose.connect(MONGODB_URI, function(err) {
    if(err) {
        console.log("[SchemaTest] failed to connect to database: " + err);
        return;
    } 

    console.log("[SchemaTest] Successfully connected to database. ");

    // step 2: save schema's in db
   
    // addUser();
    addScreenShot();
});


//------------------------------------------------------------------
//
//                 TEST CASES FOR SCHEMA
//
//------------------------------------------------------------------
// describe('Schema', function(){

  
  
	
//   //-----------------
//   // add new user 
//   //-----------------
//   var user = new User(tomsawyer);
//   it('Schema should add new user', function(){
    
//         user.save(function(err, user){
//           assert.isNull(err, 'there was not error');
//           assert.isEqual(tomsawyer.username, user.username);
//         });

//   });

  

  
// });//describe-Schema

