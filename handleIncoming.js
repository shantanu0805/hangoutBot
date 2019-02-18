var handleIncoming = {};
var moment = require('moment');

handleIncoming.timeZones = {
    'IST' : 'Asia/Colombo',
    'EST' : 'America/New_York',
    'CST' : 'America/Regina',//Chicago
    'MST' : 'America/Denver',//Denver
    'PST' : 'America/Vancouver'//Los Angeles
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
    return returnObj;
}

handleIncoming.defaultReply = function(){
    /* 
        'IST' : 'Asia/Colombo',
        'EST' : 'America/New_York',
        'CST' : 'America/Regina',//Chicago
        'MST' : 'America/Denver',//Denver
        'PST' : 'America/Vancouver'//Los Angeles
    */
    var returnObj = { text : ''};
    returnObj.text = 'Current Time in *Boston (EST)* is : *' + moment().tz(handleIncoming.timeZones.EST).format('LLLL') + '*';
    returnObj.text += '\nCurrent Time in *Chicago (CST)* is : *' + moment().tz(handleIncoming.timeZones.CST).format('LLLL') + '*';
    returnObj.text += '\nCurrent Time in *Denver (MST)* is : *' + moment().tz(handleIncoming.timeZones.MST).format('LLLL') + '*';
    returnObj.text += '\nCurrent Time in *Los Angeles (PST)* is : *' + moment().tz(handleIncoming.timeZones.PST).format('LLLL') + '*';
    returnObj.text += '\nCurrent Time in *India (IST)* is : *' + moment().tz(handleIncoming.timeZones.IST).format('LLLL') + '*';
    return returnObj;
}

handleIncoming.getTime = function(requestBody){

    try{
        //requestBody.type = 'MESSAGE';
        if(requestBody.type === 'ADDED_TO_SPACE'){
            return handleIncoming.newAdditon(requestBody);
        }
        if(requestBody.type === 'MESSAGE'){
            handleIncoming.reset(); 
            var returnObj = { text : ''};
            //requestBody.message = {text : 'what is 9:30 PM EST in IST?'};
            var questionString = requestBody.message.text.toLowerCase();

            if(questionString.indexOf('current time') >= 0 || questionString.length <5){
                return handleIncoming.defaultReply();
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
                    console.log('>> time : ' + time);
                    time += ' ' + handleIncoming.getTimeString(output);
                    console.log('>> time : ' + time);
                    
                    var queriedTimeStamp = moment(time);
                    console.log('>> queriedTimeStamp : ' + queriedTimeStamp);
                    handleIncoming.getAskTimeZones(questionString);
                    console.log('>> handleIncoming.zone : ' + JSON.stringify(handleIncoming.zone));
                    console.log('>> handleIncoming.timeZones [] : ' + handleIncoming.timeZones[handleIncoming.zone.from]);
                    var userAskTime = moment.tz(time, handleIncoming.timeZones[handleIncoming.zone.from]);
                    var userAnswerTime = userAskTime.clone().tz(handleIncoming.timeZones[handleIncoming.zone.to]);

                    var returnText = '';
                    returnText += time + ' ' + handleIncoming.zone.from + ' is : *' + userAnswerTime.format('LLLL') + ' ' + handleIncoming.zone.to + '*';
                    returnObj.text = returnText;
                }
                else{
                    return handleIncoming.defaultReply();
                }
            }
            return returnObj;
        }
    }
    catch(err) {
        return handleIncoming.defaultReply();
    }
}    

handleIncoming.getAskTimeZones = function(questionString){

    var subparts, askTimeZone;
    if(questionString.indexOf('in') >= 0 ){
        subparts = questionString.split('in');
    }
    if(subparts.length > 1){
        if(subparts[0].indexOf('est') >= 0 || subparts[0].indexOf('et') >= 0){
            handleIncoming.zone.from = 'EST';
        }
        if(subparts[0].indexOf('cst') >= 0 || subparts[0].indexOf('ct') >= 0){
            handleIncoming.zone.from = 'CST';
        }
        if(subparts[0].indexOf('mst') >= 0 || subparts[0].indexOf('mt') >= 0){
            handleIncoming.zone.from = 'MST';
        }
        if(subparts[0].indexOf('pst') >= 0 || subparts[0].indexOf('pt') >= 0){
            handleIncoming.zone.from = 'PST';
        }
        if(subparts[0].indexOf('ist') >= 0 ){
            handleIncoming.zone.from = 'IST';
        }

        if(subparts[1].indexOf('est') >= 0 || subparts[1].indexOf('et') >= 0){
            handleIncoming.zone.to = 'EST';
        }
        if(subparts[1].indexOf('cst') >= 0 || subparts[1].indexOf('ct') >= 0){
            handleIncoming.zone.to = 'CST';
        }
        if(subparts[1].indexOf('mst') >= 0 || subparts[1].indexOf('mt') >= 0){
            handleIncoming.zone.to = 'MST';
        }
        if(subparts[1].indexOf('pst') >= 0 || subparts[1].indexOf('pt') >= 0){
            handleIncoming.zone.to = 'PST';
        }
        if(subparts[1].indexOf('ist') >= 0 ){
            handleIncoming.zone.to = 'IST';
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