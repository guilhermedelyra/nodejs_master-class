var _tokens = require('./../tokens');
var _data = require('./../../data');

// Order - put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds (one must be sent)
function Put (data, callback) {
  // Order for required field
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  // Order for optional fields
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  // Error if id is invalid
  if(id){
    // Error if nothing is sent to update
    if(protocol || url || method || successCodes || timeoutSeconds){
      // Lookup the order
      _data.read('order', id, putReadOrder);
    } else {
      callback(400, {'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400, {'Error' : 'Missing required field.'});
  }
};

function putReadOrder (err, orderData){
  if(!err && orderData){
    // Get the token that sent the request
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid and belongs to the user who created the order
    _tokens.verifyToken(token, orderData.userEmail, putVerifyToken);
  } else {
    callback(400, {'Error' : 'Order ID did not exist.'});
  }
};

function putVerifyToken (tokenIsValid){
  if(tokenIsValid){
    // Update order data where necessary
    if(protocol){
      orderData.protocol = protocol;
    }
    if(url){
      orderData.url = url;
    }
    if(method){
      orderData.method = method;
    }
    if(successCodes){
      orderData.successCodes = successCodes;
    }
    if(timeoutSeconds){
      orderData.timeoutSeconds = timeoutSeconds;
    }

    // Store the new updates
    _data.update('order', id, orderData, putUpdateOrder);
  } else {
    callback(403);
  }
};

function putUpdateOrder (err){
  if(!err){
    callback(200);
  } else {
    callback(500, {'Error' : 'Could not update the order.'});
  }
};

module.exports = Put;