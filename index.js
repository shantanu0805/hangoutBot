var request = require('request');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var http = require('http');
var http = require('http').Server(app);

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function (req, res) {
    console.log('>> request body : ' + JSON.stringify(req.body));
});

http.listen(process.env.PORT || 8080, function () {
    console.log("Listening on port : " + process.env.PORT);
});