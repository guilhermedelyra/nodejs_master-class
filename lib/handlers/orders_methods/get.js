var _tokens = require('./../tokens');
var _data = require('./../../data');

// Order - get
// Required data: id
// Optional data: none
var id, callback, token, data, orderData;
function Get (dt, xd){
  data = dt;
  callback = xd;
  // Check that id is valid
  id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the order
    _data.read('order', id, getReadOrder);
  } else {
    callback(400, {'Error' : 'Missing required field, or field invalid'})
  }
};

function getReadOrder (err, orderData){
  if(!err && orderData){
    // Get the token that sent the request
    token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid and belongs to the user who created the order
    _tokens.verifyToken(token, orderData.userEmail, getVerifyToken);
  } else {
    callback(404);
  }
};

function getVerifyToken (tokenIsValid){
  if(tokenIsValid){
    // Return order data
    callback(200, orderData);
  } else {
    callback(403);
  }
};

module.exports = Get;