var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var path = require('path');
var moment = require('moment');
var momentTz = require('moment-timezone');

var handleIncoming = require(path.join(__dirname + '/handleIncoming.js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/answerme", function (req, res) {
    console.log('>> Post > request body : ' + JSON.stringify(req.body));
    res.setHeader('Content-Type', 'application/json');
    res.send(handleIncoming.getTime(req.body));
});

app.get("/botLogo", function (req, res) {
    console.log('>> handleIncoming > response: ' + JSON.stringify(handleIncoming.getTime(req.body)));
    res.sendFile(__dirname + '/assets/worldClock.jpeg');
});

function getTimeString(numb){

    if(numb.length == 1)
        return '0' + numb[0].toString() + ':00:00Z';
    if(numb.length == 2)
        return numb[0].toString() + numb[1].toString() + ':00:00Z';
    if(numb.length == 3)
        return numb[0].toString() + numb[1].toString() + ':0' + numb[2].toString() + ':00Z';
    if(numb.length == 4)
        return numb[0].toString() + numb[1].toString() + ':' + numb[2].toString() + numb[3].toString() + ':00Z';
    
}

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
    res.setHeader('Content-Type', 'application/json');
    res.send(currentTime);
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});