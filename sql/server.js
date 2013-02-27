//See README.md

var express = require('express');
var anyDB = require('any-db');
//Make sure zipcodes.db exists before you do this!
var conn = anyDB.createConnection('sqlite3://zipcodes.db');

var app = express();

//Your server implementation goes here!

//Visit localhost:8080
app.listen(8080);