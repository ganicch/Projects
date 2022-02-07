var express = require('express');
var router = express.Router();
var obj = require('../poolStorage');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});
router.post('/loguj',obj.provjeriLogin,function(req, res, next) {
    var token = jwt.sign(req.korisnik, 'kljuc');
    res.cookie('tok',token)
    if(req.korisnik.tip === 3){
        res.redirect('/admin')
    }else{
        res.redirect('/home')
    }
    console.info(jwt.verify(req.cookies.tok, 'kljuc').username)
});
router.get('/logout', function(req, res, next) {
    res.clearCookie('tok');
    res.redirect('/login');
});

module.exports = router;
