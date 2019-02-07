var handleIncoming = {};
var moment = require('moment-timezone');

handleIncoming.timeZones = {
    'India' : 'Asia/Colombo',
    'US' : 'America/New_York'
}

handleIncoming.getTime = function(requestBody){

    console.log('>> handleIncoming > request body : ' + JSON.stringify(requestBody));
    console.log('>> Timezone Guess: ' + moment.tz.guess());
    var optionsIndia = {
        timeZone: handleIncoming.timeZones.India,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    },
    formatter = new Intl.DateTimeFormat([], optionsIndia)
    var currentTimeIndia = formatter.format(new Date());
    console.log('>> Current Time India : ' + currentTimeIndia);

    var optionsUS = {
        timeZone: handleIncoming.timeZones.US,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    },
    formatter = new Intl.DateTimeFormat([], optionsUS)
    var currentTimeNY = formatter.format(new Date());
    console.log('>> currentTime NY : ' + currentTimeNY);

    console.log('>> text : ' + requestBody.message.text);
    var returnObj = {};
    var string = requestBody.message.text.toLowerCase();
    expr = /ind/;  
    if(expr.test(string)){
        returnObj.text = 'Current Time in *India* is  : *' + currentTimeIndia + '*';
    }
    else{
        returnObj.text = 'Current Time in *US* is  : *' + currentTimeNY + '*';
    }
    console.log('>> return response : ' + returnObj);
    return returnObj;
}    

module.exports = handleIncoming;