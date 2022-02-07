var express = require('express');
var router = express.Router();
var obj = require('../poolStorage.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* GET home page. */
pomocne = {
    kriptuj:function (lozinka) {
        kriptovanaLozinka = bcrypt.hashSync(lozinka,10)
        return kriptovanaLozinka;
    }
}

//------------------------------------------------------Ovo je proba ------------------------------------------
router.get('/',obj.funk,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
        res.render('admin');
    }else{
        res.redirect('/home')
    }
});
//--------------------------------------------------------------------------------------------------------------
router.get('/pageOptions',obj.dajArtikle,obj.dajTrgovce,obj.funk,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
        res.render('pageoptions', {artikli:req.artikli , trgovac:req.trgovac,ispisi:req.ispisi});
    }else{
        res.redirect('/home')
    }
});
router.get('/userOptions',obj.dajNeBlokiraneKorisnike,obj.dajBlokiraneKorisnike,function(req, res, next) {
    if(!req.cookies.tok){
        res.redirect('/')
    }
    else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
        res.render('useroptions',{neBlokirani:req.neBlokirani,blokirani:req.blokirani});
    }else{
        res.redirect('/home')
    }
});

router.get('/statistic',obj.dajBrojKorisnika,obj.dajBrojArtikala
    ,obj.dajBrojKategorija,obj.dajBrojAktivnihKorisnika,obj.dajBrojNeaktivnihKorisnika,
    obj.dajBrojBlokiranihKorisnika,obj.dajBrojTrgovaca,obj.dajBrojKupaca,function(req, res, next) {
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
            res.render('statistic',{kor:req.kor[0].broj,art:req.art[0].broj,kat:req.kat[0].broj,ak:req.ak[0].broj,
                nk:req.nk[0].broj,bk:req.bk[0].broj,brTrg:req.brTrg[0].broj,brKup:req.brKup[0].broj});
        }else{
            res.redirect('/home')
        }

});


router.post('/obrisi/:id',obj.obrisiArtikal,function(req, res, next) {
    res.redirect('/admin/pageOptions')
});
router.post('/obrisiOdTrgovca/:id',obj.obrisiOdTrgovcaArtikal,function(req, res, next) {
    res.redirect('/admin/pageOptions')
});
router.post('/dodajTrgovca',obj.dodajTrgovca,function(req, res, next) {
res.redirect('/admin/pageOptions')
});
router.post('/blokiraj/:id',obj.blokirajKorisnika,function(req, res, next) {
    res.redirect('/admin/userOptions')
});
router.post('/odblokiraj/:id',obj.odblokirajKorisnika,function(req, res, next) {
    res.redirect('/admin/userOptions')
});

module.exports = router;
