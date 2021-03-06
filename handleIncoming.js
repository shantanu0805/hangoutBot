var handleIncoming = {};
var moment = require('moment');
var path = require('path');
var dbhelper = require(path.join(__dirname + '/dbhelper.js'));

handleIncoming.timeZones = {
    'IST' : 'Asia/Calcutta',
    'EST' : 'America/New_York',
    'CST' : 'America/Chicago',//Chicago
    'MST' : 'America/Denver',//Denver
    'PST' : 'America/Los_Angeles',//Los Angeles
    'GMT' : 'Europe/London'//London
}

handleIncoming.userQueryJSON = {
    'Timestamp' : '',
    'QueryText' : '',
    'BotAnswer' : '',
    'RequestType' : '',
    'UserName' : '',
    'Success' : '',
    'RoomName' : '',
    'RoomOrDM' : ''
}

handleIncoming.ask = {
    'us_zone' : false,
    'india_zone' : false
}

handleIncoming.zone = {
    'from' : '',
    'to' : ''
}

handleIncoming.regExes = {
    'am' : /am|morning/,
    'pm' : /pm|evening|night|eve/,
    'digit' : /\d/,
    'us_eastern_city' : /us|usa|boston|hoboken|new jersey|new york/,
    'india_city' : /india|ind|delhi|newdelhi|bangalore/
}

handleIncoming.validations = {
    has_AM : false,
    has_PM : false,
    has_Digit : false,
    has_US_City : false,
    has_India_City : false,
};

handleIncoming.reset = function(){
    
    handleIncoming.validations.has_AM = false;
    handleIncoming.validations.has_PM = false;
    handleIncoming.validations.has_Digit = false;
    handleIncoming.validations.has_US_City = false;
    handleIncoming.validations.has_India_City = false;
    
    handleIncoming.ask.us_zone = false;
    handleIncoming.ask.india_zone = false;
    
    handleIncoming.zone.from = '';
    handleIncoming.zone.to = '';

    handleIncoming.userQueryJSON.Timestamp = '';
    handleIncoming.userQueryJSON.QueryText = '';
    handleIncoming.userQueryJSON.BotAnswer = '';
    handleIncoming.userQueryJSON.RequestType = '';
    handleIncoming.userQueryJSON.UserName = '';
    handleIncoming.userQueryJSON.Success = '';
    handleIncoming.userQueryJSON.RoomName = '';
    handleIncoming.userQueryJSON.RoomOrDM = '';
}

handleIncoming.newAdditon = function(requestBody){
    
    var returnObj = { text : ''};
    userId = requestBody.user.name;
    returnObj.text = 'Hey <' + userId + '>! Thank you for adding *_Time Bot!_*';
    returnObj.text += '\nDon\'t worry about converting meeting times into different timezones. Time Bot will do it for you :)';
    returnObj.text += '\nYou can ask questions like - '
    returnObj.text += '\n*1) What is 9 AM EST in IST?*';
    returnObj.text += '\n*2) What is 7 PM IST in EST?*';
    returnObj.text += '\n*3) Current Time*';

    handleIncoming.userQueryJSON.Timestamp = new Date().toISOString();
    handleIncoming.userQueryJSON.QueryText = 'N/A';
    handleIncoming.userQueryJSON.BotAnswer = returnObj.text;
    handleIncoming.userQueryJSON.RequestType = requestBody.type;
    handleIncoming.userQueryJSON.UserName = requestBody.user.displayName;
    handleIncoming.userQueryJSON.Success = true;
    handleIncoming.userQueryJSON.RoomName = requestBody.space.name;
    handleIncoming.userQueryJSON.RoomOrDM = requestBody.space.type;
    dbhelper.insertUserQueryRequest(handleIncoming.userQueryJSON);

    return returnObj;
}

handleIncoming.defaultReply = function(requestBody){
    /* 
        'IST' : 'Asia/Calcutta',
        'EST' : 'America/New_York',
        'CST' : 'America/Chicago',//Chicago
        'MST' : 'America/Denver',//Denver
        'PST' : 'America/Vancouver',//Los Angeles
        'GMT' : 'Europe/London'//London
    */
    var returnObj = { text : '*Current Times:*'};
    returnObj.text += '\n' + moment().tz(handleIncoming.timeZones.IST).format('hh:mma z') + ' - (India)';
    returnObj.text += '\n' + moment().tz(handleIncoming.timeZones.GMT).format('hh:mma z') + ' - (London)';
    returnObj.text += '\n' + moment().tz(handleIncoming.timeZones.EST).format('hh:mma z') + ' - (Boston)';
    returnObj.text += '\n' + moment().tz(handleIncoming.timeZones.CST).format('hh:mma z') + ' - (Chicago)';
    returnObj.text += '\n' + moment().tz(handleIncoming.timeZones.MST).format('hh:mma z') + ' - (Denver)';
    returnObj.text += '\n' + moment().tz(handleIncoming.timeZones.PST).format('hh:mma z') + ' - (Los Angeles)';
    //console.log('>> returnObj.text : ' + returnObj.text); //Uncomment this for local test

    handleIncoming.userQueryJSON.Timestamp = new Date().toISOString();
    handleIncoming.userQueryJSON.QueryText = requestBody.message.text;
    handleIncoming.userQueryJSON.BotAnswer = returnObj.text;
    handleIncoming.userQueryJSON.RequestType = requestBody.type;
    handleIncoming.userQueryJSON.UserName = requestBody.user.displayName;
    handleIncoming.userQueryJSON.Success = false;
    handleIncoming.userQueryJSON.RoomName = requestBody.space.name;
    handleIncoming.userQueryJSON.RoomOrDM = requestBody.space.type;
    dbhelper.insertUserQueryRequest(handleIncoming.userQueryJSON);

    return returnObj;
}

handleIncoming.getTime = function(requestBody){

    var questionString = '';
    handleIncoming.reset(); 
    try{
        //requestBody.type = 'MESSAGE'; //Uncomment this for local test
        if(requestBody.type === 'ADDED_TO_SPACE'){
            return handleIncoming.newAdditon(requestBody);
        }
        if(requestBody.type === 'MESSAGE'){
            var date;
            var returnObj = { text : ''};
            //requestBody.message = {text : 'what is 9:30 PM ET in IST?'}; //Uncomment this for local test
            questionString = requestBody.message.text.toLowerCase();
            console.log('>> questionString : ' + requestBody.message.text);
            if(questionString.indexOf('current time') >= 0 || questionString.length <5){
                return handleIncoming.defaultReply(requestBody);
            }
            else{
                var numberValue, output =[];
                handleIncoming.validateInputString(questionString);
                console.log('>> handleIncoming validations : ' + JSON.stringify(handleIncoming.validations));
                numberValue = questionString.toLowerCase().match(/\d/g);
                if(numberValue){
                    numberValue = numberValue.join("");
                    console.log('>> numberValue : ' + numberValue);
                    var sNumber = numberValue.toString();
                    for (var i = 0, len = sNumber.length; i < len; i += 1) {
                        output.push(+sNumber.charAt(i));
                    }
                    var time = null;
                    time = moment().format().split('T')[0];
                    date = time;
                    console.log('>> time : ' + time);
                    time += ' ' + handleIncoming.getTimeString(output);
                    console.log('>> time : ' + time);
                    
                    var queriedTimeStamp = moment(time);
                    console.log('>> queriedTimeStamp : ' + queriedTimeStamp);
                    handleIncoming.getAskTimeZones(questionString);
                    console.log('>> handleIncoming.zone : ' + JSON.stringify(handleIncoming.zone));
                    console.log('>> handleIncoming.timeZones [] : ' + handleIncoming.timeZones[handleIncoming.zone.from]);
                    var userAskTime = moment.tz(time, handleIncoming.timeZones[handleIncoming.zone.from]);
                    console.log('>> userAskTime : ' + userAskTime.format('hh:mm A z'));
                    var userAnswerTime = userAskTime.clone().tz(handleIncoming.timeZones[handleIncoming.zone.to]);
                    returnObj.text = handleIncoming.getFinalReturnString(userAskTime, userAnswerTime);
                    console.log('>> returnObj.text : ' + returnObj.text);

                    handleIncoming.userQueryJSON.Timestamp = new Date().toISOString();
                    handleIncoming.userQueryJSON.QueryText = requestBody.message.text;
                    handleIncoming.userQueryJSON.BotAnswer = returnObj.text;
                    handleIncoming.userQueryJSON.RequestType = requestBody.type;
                    handleIncoming.userQueryJSON.UserName = requestBody.user.displayName;
                    handleIncoming.userQueryJSON.Success = true;
                    handleIncoming.userQueryJSON.RoomName = requestBody.space.name;
                    handleIncoming.userQueryJSON.RoomOrDM = requestBody.space.type;
                    dbhelper.insertUserQueryRequest(handleIncoming.userQueryJSON);
                }
                else{
                    return handleIncoming.defaultReply(requestBody);
                }
            }
            return returnObj;
        }
    }
    catch(err) {
        return handleIncoming.defaultReply(requestBody);
    }
    //return handleIncoming.defaultReply(requestBody); //Uncomment this for local test
}    

handleIncoming.getFinalReturnString = function(userAskTimeStamp, userAnswerTimeStamp){

    console.log('>> userAskTimeStamp day : ' + userAskTimeStamp.format('llll'));
    console.log('>> userAnswerTimeStamp day : ' + userAnswerTimeStamp.format('llll'));
    let returnString = userAskTimeStamp.format('hh:mm A z') + ' is : *' + userAnswerTimeStamp.format('hh:mm A z') + '*';
    let askDay = userAskTimeStamp.format('llll').split(',')[0];
    let answerDay = userAnswerTimeStamp.format('llll').split(',')[0];
    if(askDay !== answerDay){
        returnString = askDay + ' ' + userAskTimeStamp.format('hh:mm A z') + ' is : *' + answerDay + ' ' +  userAnswerTimeStamp.format('hh:mm A z') + '*';
    }
    return returnString;
}


handleIncoming.getAskTimeZones = function(questionString){

    var subparts, askTimeZone;
    if(questionString.indexOf('in') >= 0 ){
        subparts = questionString.split(/in(.+)/);
    }
    if(subparts.length > 1){
        /* 
        'IST' : 'Asia/Calcutta',
        'EST' : 'America/New_York',
        'CST' : 'America/Chicago',//Chicago
        'MST' : 'America/Denver',//Denver
        'PST' : 'America/Vancouver',//Los Angeles
        'GMT' : 'Europe/London'//London
        */
        if(subparts[0].indexOf('est') >= 0 || subparts[0].indexOf('et') >= 0 || subparts[0].indexOf('edt') >= 0){
            handleIncoming.zone.from = 'EST';
        }
        if(subparts[0].indexOf('cst') >= 0 || subparts[0].indexOf('ct') >= 0 || subparts[0].indexOf('cdt') >= 0){
            handleIncoming.zone.from = 'CST';
        }
        if(subparts[0].indexOf('mst') >= 0 || subparts[0].indexOf('mt') >= 0 || subparts[0].indexOf('mdt') >= 0){
            handleIncoming.zone.from = 'MST';
        }
        if(subparts[0].indexOf('pst') >= 0 || subparts[0].indexOf('pt') >= 0 || subparts[0].indexOf('pdt') >= 0){
            handleIncoming.zone.from = 'PST';
        }
        if(subparts[0].indexOf('ist') >= 0 ){
            handleIncoming.zone.from = 'IST';
        }
        if(subparts[0].indexOf('gmt') >= 0 || subparts[0].indexOf('bst') >= 0 ){
            handleIncoming.zone.from = 'GMT';
        }

        if(subparts[1].indexOf('est') >= 0 || subparts[1].indexOf('et') >= 0 || subparts[1].indexOf('edt') >= 0 || subparts[1].indexOf('ny') >= 0 || subparts[1].indexOf('newyork') >= 0 || subparts[1].indexOf('new york') >= 0 || subparts[1].indexOf('boston') >= 0 || subparts[1].indexOf('hoboken') >= 0){
            handleIncoming.zone.to = 'EST';
        }
        if(subparts[1].indexOf('cst') >= 0 || subparts[1].indexOf('ct') >= 0 || subparts[1].indexOf('cdt') >= 0 || subparts[1].indexOf('chicago') >= 0){
            handleIncoming.zone.to = 'CST';
        }
        if(subparts[1].indexOf('mst') >= 0 || subparts[1].indexOf('mt') >= 0 || subparts[1].indexOf('mdt') >= 0 || subparts[1].indexOf('denver') >= 0){
            handleIncoming.zone.to = 'MST';
        }
        if(subparts[1].indexOf('pst') >= 0 || subparts[1].indexOf('pdt') >= 0 || subparts[1].indexOf('pt') >= 0 || subparts[1].indexOf('los angeles') >= 0 || subparts[1].indexOf('losangeles') >= 0){
            handleIncoming.zone.to = 'PST';
        }
        if(subparts[1].indexOf('ist') >= 0 || subparts[1].indexOf('india') >= 0 || subparts[1].indexOf('delhi') >= 0){
            handleIncoming.zone.to = 'IST';
        }
        if(subparts[1].indexOf('gmt') >= 0 || subparts[1].indexOf('bst') >= 0 || subparts[1].indexOf('london') >= 0 || subparts[1].indexOf('uk') >= 0){
            handleIncoming.zone.to = 'GMT';
        }
    }
}

handleIncoming.getTimeString = function(numberArray){

    var isConverted = false;
    console.log('>> numberArray : ' + numberArray);
    if(handleIncoming.validations.has_PM){
        numberArray = handleIncoming.convertTime12to24(numberArray);
        isConverted = true;
        console.log('>> numberArray : ' + numberArray);
    }

    if(numberArray.length == 1)
        return '0' + numberArray[0].toString() + ':00';
    if(numberArray.length == 2)
        return numberArray[0].toString() + numberArray[1].toString() + ':00';
    if(numberArray.length == 3 && !isConverted)
        return '0' + numberArray[0].toString() + ':' + numberArray[1].toString()  + numberArray[2].toString() + '';
    if(numberArray.length == 3 && isConverted)
        return '0' + numberArray[0].toString() + numberArray[1].toString() + ':0' + numberArray[2].toString() + '';
    if(numberArray.length == 4)
        return numberArray[0].toString() + numberArray[1].toString() + ':' + numberArray[2].toString() + numberArray[3].toString() + '';
    
}

handleIncoming.validateInputString = function(inputString){

    if(handleIncoming.regExes.am.test(inputString.toLowerCase()))
        handleIncoming.validations.has_AM = true; //has am in string
    if(handleIncoming.regExes.pm.test(inputString.toLowerCase()))
        handleIncoming.validations.has_PM = true; //has pm in string
    if(handleIncoming.regExes.digit.test(inputString.toLowerCase()))
        handleIncoming.validations.has_Digit = true; //has time digits in string
    if(handleIncoming.regExes.india_city.test(inputString.toLowerCase()))
        handleIncoming.validations.has_India_City = true; //has Indian City in string
    if(handleIncoming.regExes.us_eastern_city.test(inputString.toLowerCase()))
        handleIncoming.validations.has_US_City = true; //has US City in string
}

handleIncoming.convertTime12to24 = function(numberArray){ //'01:02 PM' --> 13:02

    let hours;
    if(numberArray.length == 3)
        hours = '0' + numberArray[0].toString();
    else
        hours = numberArray.length == 1 ? ('0' + numberArray[0].toString()) : (numberArray[0].toString() + numberArray[1].toString());

    if (hours === '12')
        hours = '00';
        hours = parseInt(hours, 10) + 12;
    
    if(numberArray.length == 3){
        numberArray[3] = numberArray[2];
        numberArray[2] = numberArray[1];
    }
    var sNumber = hours.toString();
    for (var i = 0, len = sNumber.length; i < len; i += 1) {
        numberArray[i] = sNumber.charAt(i);
    }
    return numberArray;
}

module.exports = handleIncoming;