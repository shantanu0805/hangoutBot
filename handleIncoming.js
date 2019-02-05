var handleIncoming = {};

handleIncoming.getTime = function(requestBody){
    console.log('>> text : ' + requestBody.message.text);
    console.log('>> return response : ' + JSON.stringify('text', 'You said : ' + requestBody.message.text));
    return  JSON.stringify('text', 'You said : ' + requestBody.message.text);
}    

module.exports = handleIncoming;