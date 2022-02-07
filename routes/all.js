var express = require('express');
var router = express.Router();
var obj = require('../poolStorage.js');
/* GET home page. */

router.get('/',obj.dajZadnjih5artikala,function(req, res, next) {
    res.render('index',{pet:req.pet});
});

module.exports = router;
