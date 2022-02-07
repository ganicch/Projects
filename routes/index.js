var express = require('express');
var router = express.Router();
var obj = require('../poolStorage.js');
const jwt = require("jsonwebtoken");
/* GET home page. */



router.get('/',function(req, res, next) {
  if(!req.cookies.tok){
    res.render('svi');
  }else {
    res.redirect('/home')
  }

});
router.get('/home',obj.dajZadnjih5artikala,function(req, res, next) {
  if(!req.cookies.tok){
    res.render('svi');
  }else {
    res.render('index',{pet:req.pet,tip:jwt.verify(req.cookies.tok, 'kljuc').tip});
  }

});


module.exports = router;
