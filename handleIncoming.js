var handleIncoming = {};

dbhelper.getTime = function(requestBody){
    
return  JSON.stringify('text', 'You said : ' + requestBody.message.text);
}    

module.exports = handleIncoming;