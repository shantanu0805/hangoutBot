var request = require('request');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();

//app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function (req, res) {
    console.log('>> Post > request body : ' + JSON.stringify(req.body));
});

app.get("/", function (req, res) {
    console.log('>> Get > request body : ' + JSON.stringify(req.body));
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});