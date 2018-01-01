var express = require('express');

var router = express.Router();


// var getUserData = require('./helper');




/* GET home page. */
// router.get('/aaa', function(req, res, next) {
 
//   getUserData(req)
//   .then(function(data){
//     res.render('home', data);
//   })
//   .catch(function(err){
//     console.log("getUserData:: got error=" + err);
//   });
// });

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Screen Watch' });
});

router.get('/file_upload', function(req, res, next) {
  res.render('file_upload', { title: 'Screen Watch' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Screen Watch' });
});


module.exports = router;
 