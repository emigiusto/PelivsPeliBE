var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10000,
  host : "us-cdbr-iron-east-05.cleardb.net",
  user     : "bd0ed6abfd393c",
  password : "ed07abe1",
  database : "heroku_fddda7790abafa0"
});

module.exports = pool;