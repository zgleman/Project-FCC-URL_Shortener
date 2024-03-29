'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
process.env.MONGO_URI = 'mongodb+srv://zgleman:grey1127@cluster0-2my3z.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(process.env.MONGO_URI);
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

var Schema = mongoose.Schema;
var UrlSchema = new Schema({
  original_url : String,
  short_url : Number
  
});
var UrlReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
var Url = mongoose.model("Url", UrlSchema)  
// your first API endpoint... 
app.post("/api/shorturl/new", function(req, res){
  var urlToShorten = req.body.url;
  UrlReg.test(urlToShorten) == false ? res.json({"error":"invalid URL"}): null;
  var shortUrl = Math.floor(Math.random()*100);  
  var inputUrl = new Url({
  original_url: urlToShorten,
  short_url: shortUrl
  });
  inputUrl.save(function(err){
  if (err) return "Error Saving Data";
  });
  return res.json({inputUrl})
});

app.get("/api/shorturl/:number", function(req, res){
  var short = Number(req.params.number);
  Url.findOne({short_url: short}, function(err, data){
    if (err) return res.send("Error reading database");
    res.redirect(data.original_url);
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
