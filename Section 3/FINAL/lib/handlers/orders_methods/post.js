var _data = require('./../../data');
var helpers = require('./../../helpers');
var config = require('./../../config');

// Order - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
function Post (data, callback){
  // Validate inputs
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
  if(protocol && url && method && successCodes && timeoutSeconds){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Lookup the user email by reading the token
    _data.read('tokens', token, postTokensRead);
  } else {
    callback(400, {'Error' : 'Missing required inputs, or inputs are invalid'});
  }
};

function postTokensRead (err, tokenData){
  if(!err && tokenData){
    var userEmail = tokenData.email;

    // Lookup the user data
    _data.read('users', userEmail, postUsersRead);
  } else {
    callback(403);
  }
};

function postUsersRead (err, userData){
  if(!err && userData){
    var userOrder = typeof(userData.order) == 'object' && userData.order instanceof Array ? userData.order : [];
    // Verify that user has less than the number of max-order per user
    if(userOrder.length < config.maxOrder){
      // Create random id for order
      var orderId = helpers.createRandomString(20);

      // Create order object including userEmail
      var orderObject = {
        'id' : orderId,
        'userEmail' : userEmail,
        'protocol' : protocol,
        'url' : url,
        'method' : method,
        'successCodes' : successCodes,
        'timeoutSeconds' : timeoutSeconds
      };

      // Save the object
      _data.create('order', orderId, orderObject, postCreateOrder);

    } else {
      callback(400, {'Error' : 'The user already has the maximum number of order ('+config.maxOrder+').'})
    }
  } else {
    callback(403);
  }
};

function postCreateOrder (err){
  if(!err){
    // Add order id to the user's object
    userData.order = userOrder;
    userData.order.push(orderId);

    // Save the new user data
    _data.update('users', userEmail, userData, postUpdateUsers);
  } else {
    callback(500, {'Error' : 'Could not create the new order'});
  }
};

function postUpdateUsers (err){
  if(!err){
    // Return the data about the new order
    callback(200, orderObject);
  } else {
    callback(500, {'Error' : 'Could not update the user with the new order.'});
  }
};

module.exports = Post;