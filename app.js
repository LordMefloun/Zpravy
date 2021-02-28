var express = require('express');
var url = require('url');
const bodyParser = require('body-parser');
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

app.listen(3000);