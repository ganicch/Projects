var express = require('express');
var router = express.Router();
var obj = require('../poolStorage');
const jwt = require("jsonwebtoken");

/* GET users listing. */

router.get('/',obj.dajArtikalPoUsernameTrgovca,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.render('myshop',{artikliTrg:req.artikliTrg,trgovac:jwt.verify(req.cookies.tok, 'kljuc').ime});
    }else{
        res.redirect('/home')
    }

});




module.exports = router;