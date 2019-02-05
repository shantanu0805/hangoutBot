var handleIncoming = {};

handleIncoming.getTime = function(requestBody){
    console.log('>> text : ' + requestBody.message.text);
    var returnObj = {};
    returnObj.text = 'You said : ' + requestBody.message.text;
    console.log('>> return response : ' + returnObj);
    return returnObj;
}    

module.exports = handleIncoming;