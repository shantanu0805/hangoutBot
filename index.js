var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var path = require('path');

var handleIncoming = require(path.join(__dirname + '/handleIncoming.js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/answerme", function (req, res) {
    console.log('>> Post > request body : ' + JSON.stringify(req.body));
    res.setHeader('Content-Type', 'application/json');
    res.send(handleIncoming.getTime(req.body));
});

app.get("/", function (req, res) {
    console.log('>> Get > request body : ' + JSON.stringify(req.body));
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});