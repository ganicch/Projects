var express = require('express');
var router = express.Router();
var obj = require('../poolStorage');
var formidable = require('formidable');
var fs = require('fs');
const {Pool} = require("pg");
const multer  = require('multer')
const jwt = require("jsonwebtoken");
const upload = multer({ dest: 'public/uploads/' })

var cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'edin111edin',
    api_key: '815432241273389',
    api_secret: 'ehoAf8N1GrBdQWSALLidtlNWIzE'
});
const pool = new Pool({
    user: 'ctnjktwg',
    host: 'kashin.db.elephantsql.com',
    database: 'ctnjktwg',
    password: 'O9E_C1zPygn_SYz7-fn_CPz48qBSBlFh',
    port: 5432,
})


/* GET users listing. */

var niz2 = [];
var niz = [];

router.get('/',obj.funk,function(req, res, next) {
    res.render('shop',{artikli:niz2 ,ispisi:req.ispisi,tip:jwt.verify(req.cookies.tok, 'kljuc').tip});
    niz2 = [];
});
router.post('/search',obj.search,function(req, res, next) {
    niz2 = req.search;
    res.redirect('/shop')


});

router.get('/sho',obj.dajArtikle,function(req, res, next) {
    niz2 = req.artikli;
    res.redirect('/shop')
});

router.post('/shopp',obj.dajArtikle,function(req, res, next) {
    niz = req.artikli;
    niz2 = [];
    console.info(req.body)
    if (req.body.filter1 === "All" && req.body.filter2 === ""){
        niz2 = niz;
    }
    else if(req.body.filter1 !== "All" && req.body.filter2 === ""){
        for(let i=0;i<niz.length;i++){
            if(niz[i].kat === req.body.filter1){
                niz2.push(niz[i])
            }
        }
    }else if(req.body.filter1 === "All" && req.body.filter2 !== ""){
        for(let i=0;i<niz.length;i++){
            if(parseInt(niz[i].cijena) < parseInt(req.body.filter2)){
                niz2.push(niz[i])
            }
        }
    }else {
        for(let i=0;i<niz.length;i++){
            if(niz[i].kat === req.body.filter1 && parseInt(niz[i].cijena) < parseInt(req.body.filter2)){
                niz2.push(niz[i])
            }
        }
    }
    res.redirect('/shop')
});

router.get('/narudjbe',obj.dajSveArtikleZaNarudjbu,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        let naslov;
        if (req.Artiklii.length === 0){
            naslov = "Nema narudjbi za vas."
        }else {
            naslov = ""
        }
        res.render('narudjbe',{Artiklii:req.Artiklii,naslov: naslov});
    }else{
        res.redirect('/home')
    }

})

/*router.post('/product/post/:id',function(req, res, next) {
    let urll = '/shop/product/' + req.params.id;
    res.redirect(urll);

})*/

router.get('/product/:id',obj.dajArtikalPoId,obj.dajKomentare,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }else{
        komNaslov = '';
        if(req.komentari.length != 0) komNaslov = "Komentari:";
        else  komNaslov = "Ovaj artikal jos nema komentara!";
        res.render('product', {artikal: req.artikal, komentari: req.komentari,komNaslov:komNaslov,tip:jwt.verify(req.cookies.tok, 'kljuc').tip});
    }



});
router.get('/productt/:id',obj.dajArtikalPoId,obj.dajKomentare,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }else{
        komNaslov = '';
        if(req.komentari.length != 0) komNaslov = "Komentari:";
        else  komNaslov = "Ovaj artikal jos nema komentara!";
        res.render('pogledaj',{artikal:req.artikal,komentari: req.komentari,komNaslov:komNaslov});
    }

});

router.post('/product/post',function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }else{
        let urll = '/shop/product/' + req.body.id;
        res.redirect(urll);
    }

})
router.post('/komentari',obj.dodajKomentar,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }else{
        let urll = '/shop/product/' + req.body.idid;
        res.redirect(urll);
    }

})
router.post('/productt/post',function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }else{
        let urll = '/shop/productt/' + req.body.id;
        res.redirect(urll);
    }

})
router.get('/dodajartikal',obj.funk,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.render('dodajartikal',{ispisi:req.ispisi});
    }else{
        res.redirect('/home')
    }

});


router.post('/dodajArtikal',upload.single('slikaartikla'),obj.dodajArtikal,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.redirect('/shop/sho');
    }else{
        res.redirect('/home');
    }

})

router.get('/obrisiartikal',obj.dajArtikalPoUsernameTrgovcaZaBrisanje,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.render('obrisiartikal', {artikliTrg: req.artikliTrg});
    }else{
        res.redirect('/home');
    }

});
router.post('/obrisiartikall',obj.obrisiArtikalPoZelji,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.redirect('/shop/obrisiartikal')
    }else{
        res.redirect('/home');
    }

});

router.post('/product/dodaj',obj.dodajUKorpu,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
        res.redirect('/shop/sho');
    }else{
        res.redirect('/home');
    }

})


router.post('/odobri',obj.odobriNarudjbu,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.redirect('/shop/narudjbe')
    }else{
        res.redirect('/home');
    }

})
router.post('/odbij',obj.odbijNarudjbu,obj.obrisiSveOdbijeneIzKorpe,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
        res.redirect('/shop/narudjbe')
    }else{
        res.redirect('/home');
    }

})
module.exports = router;
