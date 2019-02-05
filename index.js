var request = require('request');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function (req, res) {
    console.log('>> request body : ' + req.body);
});
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});