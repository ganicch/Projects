var express = require('express');
var router = express.Router();
var obj = require('../poolStorage');
const bcrypt = require('bcrypt');

pomocne = {
    kriptuj:function (lozinka) {
        kriptovanaLozinka = bcrypt.hashSync(lozinka,10)
        return kriptovanaLozinka;
    }
}
/* GET home page. */
router.get('/', obj.funk,function(req, res, next) {
    res.render('register', { ispisi: req.ispisi });
});
router.post('/registruj',obj.registrujKorisnika,function(req, res, next) {
    res.redirect('/login')
});
module.exports = router;
