const { Pool } = require('pg')
const Console = require("console");
const {v2: cloudinary} = require("cloudinary");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const pool = new Pool({
    user: 'ctnjktwg',
    host: 'kashin.db.elephantsql.com',
    database: 'ctnjktwg',
    password: 'O9E_C1zPygn_SYz7-fn_CPz48qBSBlFh',
    port: 5432,
})

var obj = {
    funk:function (req,res,next){
        pool.query(`select * from kategorija`,(err, res) => {
            req.ispisi = res.rows;
            next();
        })
    },
    dajArtikle:function (req,res,next){
            pool.query(`select *,artikal.id as ide,artikal.naziv as naziv,k2.naziv as kat from artikal
                    inner join korisnik k on artikal.korisnik = k.id
                    inner join kategorija k2 on k2.id = artikal.kategorija order by artikal.datum_objave desc`,(err, res) => {
                req.artikli = res.rows;

                next();
            })
    },
    dajTrgovce:function (req,res,next){
        pool.query(`select * from korisnik where korisnik.tip = 1;`,(err, res) => {
            req.trgovac = res.rows;
            next();
        })
    },
    obrisiArtikal:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
            pool.query(`delete from artikal where id = $1`,[parseInt(req.params.id)],(err, res) => {
                pool.query(`delete from komentari where id_trgovca = $1`,[parseInt(req.params.id)],(err, res) => {
                    next();
                })
            })
        }else{
            res.redirect('/home')
        }
    },
    obrisiOdTrgovcaArtikal:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
            pool.query(`delete from komentari where id_trgovca = $1`,[parseInt(req.params.id)],(err, res) => {
                pool.query(`delete from artikal where korisnik = $1`,[parseInt(req.params.id)],(err, res) => {
                    next();
                })
            })

        }else{
            res.redirect('/home')
        }

    },
    dodajTrgovca: function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
            pool.query(`insert into korisnik (ime, prezime,tip,interes, status, username, sifra, email)
            values ($1,$2,1,$3,1,$4,$5,$6)`,[req.body.ime,req.body.prezime,parseInt(req.body.kategorija),req.body.username,pomocne.kriptuj(req.body.password),req.body.email],(err, res) => {
                next();
            })
        }else{
            res.redirect('/home')
        }

    },
    dajNeBlokiraneKorisnike: function (req,res,next){
        pool.query(`select *,korisnik.id as id,t.naziv as tipnaziv,s.naziv as statusnaziv from korisnik 
                    inner join tip t on t.id = korisnik.tip
                    inner join status s on s.id = korisnik.status
                    where status != 3`,(err, res) => {

            req.neBlokirani = res.rows;
            next();
        })
    },
    dajBlokiraneKorisnike: function (req,res,next){
        pool.query(`select *,korisnik.id as id,t.naziv as tipnaziv,s.naziv as statusnaziv from korisnik 
                    inner join tip t on t.id = korisnik.tip
                    inner join status s on s.id = korisnik.status
                    where status = 3`,(err, res) => {

            req.blokirani = res.rows;
            next();
        })
    },
    blokirajKorisnika: function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
            pool.query(`update korisnik set status = 3 where id = $1`,[parseInt(req.params.id)],(err, res) => {
                next();
            })
        }else{
            res.redirect('/home')
        }

    },
    odblokirajKorisnika: function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 3) {
            pool.query(`update korisnik set status = 1 where id = $1`,[parseInt(req.params.id)],(err, res) => {
                next();
            })
        }else{
            res.redirect('/home')
        }

    },
    dajArtikalPoId:function (req,res,next){
        pool.query(`select *,artikal.slika as sa,artikal.id as ide,artikal.naziv as naziv,k2.naziv as kat,k.username as trgovac,k.email as email from artikal
                    inner join korisnik k on artikal.korisnik = k.id
                    inner join kategorija k2 on k2.id = artikal.kategorija where artikal.id = $1`,[parseInt(req.params.id)],(err, res) => {
            req.artikal = res.rows;
            next();
        })
    },
    dajKomentare:function (req,res,next){
        pool.query(`select * from komentari
        inner join artikal a on a.id = komentari.id_artikla
        inner join korisnik k on k.id = komentari.id_korisnika where id_artikla = $1`,[parseInt(req.params.id)],(err, res) => {
            req.komentari = res.rows;
            next();
        })
    },
    dodajKomentar:function (req,res,next){
        pool.query(`insert into komentari (id_artikla, id_korisnika, komentar, id_trgovca) values ($1,(select id from korisnik where username = $3),$2,$4)`,[parseInt(req.body.idid),req.body.kom,jwt.verify(req.cookies.tok, 'kljuc').username,parseInt(req.body.kor)],(err, res) => {

            next();
        })
    },
    dajArtikalPoUsernameTrgovca:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`select *,artikal.id as ide,artikal.naziv as naziv,k2.naziv as kat,k.username as trgovac from artikal
                    inner join korisnik k on artikal.korisnik = k.id
                    inner join kategorija k2 on k2.id = artikal.kategorija where k.username = $1`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err, res) => {
                req.artikliTrg = res.rows;
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    //Ovdje treba zamjeniti index korisnika (1) u index ovog gdje je username
    dodajUKorpu: function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
            pool.query(`insert into korpa (id_artikla, id_kupca, status)
            values ($1,(select id from korisnik where username = $2),'uKorpi')`,[parseInt(req.body.ida),jwt.verify(req.cookies.tok, 'kljuc').username],(err, res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    dajSveArtikleZaKorpu: function (req,res,next){
        pool.query(`select *,k.naziv as kat,a.naziv as ime,korpa.id as kid,a.id as ida from korpa 
                    inner join artikal a on a.id = korpa.id_artikla
                    inner join kategorija k on k.id = a.kategorija
                    where id_kupca = (select id from korisnik where username = $1) and status = 'uKorpi'`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err,res) => {
            req.korpaArtikli = res.rows;
            next();
        })
    },
    obrisiIzKorpe:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
            pool.query(`delete from korpa where id = $1;`,[parseInt(req.body.obrisi)],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    search:function (req,res,next){
        pool.query(`select * from artikal where naziv like $1 order by artikal.datum_objave desc`,['%' + req.body.unos + '%'],(err,res) => {
            req.search = res.rows;
            next();
        })
    },
    potvrdiKorpu:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
            pool.query(`update korpa set status = 'naCekanju' where id_kupca = (select id from korisnik where username = $1)`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    odbijKorpu:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 2) {
            pool.query(`delete from korpa where id_kupca = (select id from korisnik where username = $1) and status = 'uKorpi'`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    //Promjeniti vezano za sliku dodati $6 i link slike i update tamo da sliku povlaci iz baze // izmjeniti korisnika
    dodajArtikal:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`insert into artikal (naziv, velicina, kategorija, korisnik, cijena, opis, slika)
            values ($1,$2,$3,(select id from korisnik where username = $7),$4,$5,$6)`,[req.body.naslov,req.body.velicina,parseInt(req.body.kategorija),parseInt(req.body.cijena),req.body.opis,req.file.filename,jwt.verify(req.cookies.tok, 'kljuc').username],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    //Ovdje promjeniti 'fare' u user name trgovca
    dajArtikalPoUsernameTrgovcaZaBrisanje:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`select *,artikal.id as ide,artikal.naziv as naziv,k2.naziv as kat,k.username as trgovac from artikal
                    inner join korisnik k on artikal.korisnik = k.id
                    inner join kategorija k2 on k2.id = artikal.kategorija where k.username = $1`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err, res) => {
                req.artikliTrg = res.rows;
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    obrisiArtikalPoZelji:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`delete from komentari where id_artikla = $1`,[parseInt(req.body.id)],(err, res) => {
                pool.query(`delete from artikal where id = $1`,[parseInt(req.body.id)],(err, res) => {
                    next();
                })
            })

        }else{
            res.redirect('/home');
        }

    },

    dajSveArtikleZaNarudjbu: function (req,res,next){
    pool.query(`select distinct *,ko.ime as im,ko.prezime as pr,k.naziv as kat,a.naziv as ime,korpa.id as kid from korpa
                    inner join artikal a on a.id = korpa.id_artikla
                    inner join kategorija k on k.id = a.kategorija
                    inner join korisnik ko on ko.id = korpa.id_kupca
                    where  a.korisnik = (select id from korisnik where username = $1) and korpa.status = 'naCekanju'`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err,res) => {
        req.Artiklii = res.rows;
        next();
    })
    },
    odbijNarudjbu:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`update korpa set status = 'odbijeno' where id = $1`,[parseInt(req.body.ne)],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    odobriNarudjbu:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`update korpa set status = 'odobreno' where id = $1`,[parseInt(req.body.da)],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    obrisiSveOdbijeneIzKorpe:function (req,res,next){
        if(!req.cookies.tok){
            res.redirect('/')
        }
        else if (jwt.verify(req.cookies.tok, 'kljuc').tip === 1) {
            pool.query(`delete from korpa where id = $1`,[parseInt(req.body.ne)],(err,res) => {
                next();
            })
        }else{
            res.redirect('/home');
        }

    },
    dajBrojKorisnika:function (req,res,next){
        pool.query(`select count(*) as broj from korisnik`,(err,res) => {
            req.kor = res.rows
            next();
        })
    },
    dajBrojArtikala:function (req,res,next){
        pool.query(`select count(*) as broj from artikal`,(err,res) => {
            req.art = res.rows
            next();
        })
    },
    dajBrojKategorija:function (req,res,next){
        pool.query(`select count(*) as broj from kategorija`,(err,res) => {
            req.kat = res.rows
            next();
        })
    },
    dajBrojAktivnihKorisnika:function (req,res,next){
        pool.query(`select count(*) as broj from korisnik where status = 1`,(err,res) => {
            req.ak = res.rows
            next();
        })
    },
    dajBrojNeaktivnihKorisnika:function (req,res,next){
        pool.query(`select count(*) as broj from korisnik where status = 2`,(err,res) => {
            req.nk = res.rows
            next();
        })
    },
    dajBrojBlokiranihKorisnika:function (req,res,next){
        pool.query(`select count(*) as broj from korisnik where status = 3`,(err,res) => {
            req.bk = res.rows
            next();
        })
    },
    dajBrojTrgovaca:function (req,res,next){
        pool.query(`select count(*) as broj from korisnik where tip = 1`,(err,res) => {
            req.brTrg = res.rows
            next();
        })
    },
    dajBrojKupaca:function (req,res,next){
        pool.query(`select count(*) as broj from korisnik where tip = 2`,(err,res) => {
            req.brKup = res.rows
            next();
        })
    },
    dajZadnjih5artikala:function (req,res,next){
        pool.query(`select * from artikal order by datum_objave desc limit 5;`,(err,res) => {
            req.pet = res.rows
            next();
        })
    },
    dajSvEoKorisnikuPoUsername:function (req,res,next){
        pool.query(`select *,korisnik.id as id,t.naziv as tip,s.naziv as status,k.naziv as interes from korisnik
                inner join tip t on t.id = korisnik.tip
                inner join status s on s.id = korisnik.status
                inner join kategorija k on k.id = korisnik.interes
                where username = $1;`,[jwt.verify(req.cookies.tok, 'kljuc').username],(err,res) => {
            req.daj = res.rows
            next();
        })
    },
    promjeniNaslovnu:function (req,res,next){
        pool.query(`update korisnik set naslovna = $1 where username = $2`,[req.file.filename,req.body.nas],(err,res) => {
            next();
        })
    },
    promjeniProfilnu:function (req,res,next){
        pool.query(`update korisnik set profilna = $1 where username = $2`,[req.file.filename,req.body.prof],(err,res) => {
            next();
        })
    },
    registrujKorisnika:function (req,res,next){
        pool.query(`insert into korisnik (ime, prezime, tip, interes, status, username, sifra, email)
        values ($1,$2,$3,$4,1,$5,$6,$7)`,[req.body.ime,req.body.prezime,parseInt(req.body.tip),parseInt(req.body.interes),req.body.username,pomocne.kriptuj(req.body.password),req.body.email],(err,res) => {
            next();
        })
    },
    provjeriLogin:function (req,res,next) {
        pool.query(`select * from korisnik where username = $1 and (status = 2 or status = 1);`, [req.body.username], (err, result) => {
            if(err){
                res.sendStatus(500)
            }else {
                if (result.rows.length === 0) {
                    return res.sendStatus(500)
                }else{
                    kriptovanaSifra = result.rows[0].sifra;

                    if(bcrypt.compareSync(req.body.password,kriptovanaSifra)){

                        req.korisnik = {
                            username: result.rows[0].username,
                            ime: result.rows[0].ime,
                            prezime: result.rows[0].prezime,
                            tip: result.rows[0].tip
                        }

                    }else{
                        console.info('Pogresan login')
                        res.redirect('/login')

                    }
                }
            }
            next()
        })

    }

}
module.exports = obj;

