var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var path = require('path');
//var botLogo = require(path.join(__dirname + '/assets/worldClock.jpeg'));

var handleIncoming = require(path.join(__dirname + '/handleIncoming.js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/answerme", function (req, res) {
    console.log('>> Post > request body : ' + JSON.stringify(req.body));
    res.setHeader('Content-Type', 'application/json');
    res.send(handleIncoming.getTime(req.body));
});

app.get("/botLogo", function (req, res) {

    //res.sendFile(botLogo);
    res.sendFile(__dirname + '/assets/worldClock.jpeg');
});
app.get("/", function (req, res) {

    console.log('>> Get > request body : ' + JSON.stringify(req.body));
    var options = {
        timeZone: 'Asia/Colombo',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    },
    formatter = new Intl.DateTimeFormat([], options)
    var currentTime = formatter.format(new Date());
    console.log('>> currentTime Delhi : ' + currentTime);

    var options2 = {
        timeZone: 'America/New_York',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    },
    formatter = new Intl.DateTimeFormat([], options2)
    var currentTimeNY = formatter.format(new Date());
    console.log('>> currentTime NY : ' + currentTimeNY);
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});