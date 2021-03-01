var express = require('express');
var url = require('url');
const bodyParser = require('body-parser');
const querystring = require('querystring');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("root"));
app.use(bodyParser.urlencoded({ extended: true }));

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "zpravicky"
});

con.connect(function(err) {
  if (err) throw err;
});



app.get('/', function(req, res) {
    con.query("SELECT * FROM clanek", function (err, result, fields) {
        if (err) throw err;
        res.render('pages/index', {clanky: result});
      });
});
app.get('/clanky', function(req, res) {
  con.query("SELECT * FROM clanek", function (err, result, fields) {
      if (err) throw err;
      var q = url.parse(req.url, true);
      var q = q.search

      res.render('pages/clanky', {clanky: result, search: q });
    });
});

app.get('/administration', function(req, res) {

  con.query("SELECT * FROM clanek", function (err, result, fields) {
    var q = url.parse(req.url, true);
    var q = q.search
    var q = q.slice(1);

    res.render('pages/auth.ejs', {logged: false, get: querystring.parse(q), clanky: result} )
  });

});


app.post('/r3m0vepr1sp3v3k', function(req, res) {

  id = req.body.id;

  con.query("UPDATE clanek SET obrazek = 'nolonger.jpg' WHERE id = " + id + ";");
  con.query("UPDATE clanek SET obsah = 'Tento článek jsme již v naši databazi nenašli' WHERE id = " + id + ";");
  res.redirect('/administration?user=admin&password=admin&page=odstranit&clanek=null');
});

app.post('/addprispevek', function(req, res) {

  titulek = req.body.titulek;
  obsah = req.body.obsah;
  obrazek = req.body.obrazek;

  con.query('INSERT INTO clanek (titulek, obrazek, obsah) VALUES ("'+ titulek +'", "'+ obrazek +'", "' + obsah + '");');
  res.redirect('/administration?user=admin&password=admin&page=novyclanek');
});

app.listen(3000);