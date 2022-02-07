var express = require('express');
var router = express.Router();
var obj = require('../poolStorage');

const multer  = require('multer')
const jwt = require("jsonwebtoken");
const upload = multer({ dest: 'public/uploads/' })

/* GET users listing. */
var niz;
router.get('/korpa',obj.dajSveArtikleZaKorpu, function(req, res, next) {
  if(!req.cookies.tok){
    res.redirect('/')
  }
  else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
    res.render('korpa',{korpaArtikli:req.korpaArtikli})
  }else{
    res.redirect('/home')
  }

});
router.post('/korpa/brisi',obj.obrisiIzKorpe,function(req, res, next) {
  if(!req.cookies.tok){
    res.redirect('/')
  }
  else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
    res.redirect('/users/korpa')
  }else{
    res.redirect('/home')
  }

});
router.post('/korpa/potvrdi',obj.potvrdiKorpu,function(req, res, next) {
  res.redirect('/shop/sho')
});
router.post('/korpa/odbij',obj.odbijKorpu,function(req, res, next) {
  res.redirect('/shop/sho')
});
router.get('/nalog',obj.dajSvEoKorisnikuPoUsername,function(req, res, next) {
  res.render('nalog',{daj:req.daj,tip:jwt.verify(req.cookies.tok, 'kljuc').tip})
});
router.post('/naslovna',upload.single('naslovna_dodaj'),obj.promjeniNaslovnu,function(req, res, next) {
  res.redirect('/users/nalog')
});
router.post('/profilna',upload.single('profilna_dodaj'),obj.promjeniProfilnu,function(req, res, next) {
  res.redirect('/users/nalog')
});
module.exports = router;
