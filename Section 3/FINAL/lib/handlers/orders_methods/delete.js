var _tokens = require('./../tokens');
var _data = require('./../../data');

// Order - delete
// Required data: id
// Optional data: none
function Delete (data, callback){
  // order that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the order
    _data.read('order', id, deleteReadOrder);
  } else {
    callback(400, {"Error" : "Missing valid id"});
  }
};

function deleteReadOrder (err, orderData){
  if(!err && orderData){
    // Get the token that sent the request
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid and belongs to the user who created the order
    _tokens.verifyToken(token, orderData.userEmail, deleteVerifyToken);
  } else {
    callback(400, {"Error" : "The order ID specified could not be found"});
  }
};

function deleteVerifyToken (tokenIsValid){
  if(tokenIsValid){
    // Delete the order data
    _data.delete('order', id, deleteDeleteOrder);
  } else {
    callback(403);
  }
};

function deleteDeleteOrder (err){
  if(!err){
    // Lookup the user's object to get all their order
    _data.read('users', orderData.userEmail, deleteReadUsers);
  } else {
    callback(500, {"Error" : "Could not delete the order data."})
  }
};

function deleteReadUsers (err, userData){
  if(!err){
    var userOrder = typeof(userData.order) == 'object' && userData.order instanceof Array ? userData.order : [];

    // Remove the deleted order from their list of order
    var orderPosition = userOrder.indexOf(id);
    if(orderPosition > -1){
      userOrder.splice(orderPosition, 1);
      // Re-save the user's data
      userData.order = userOrder;
      _data.update('users', orderData.userEmail, userData, deleteUpdateUsers);
    } else {
      callback(500, {"Error" : "Could not find the order on the user's object, so could not remove it."});
    }
  } else {
    callback(500, {"Error" : "Could not find the user who created the order, so could not remove the order from the list of order on their user object."});
  }
};

function deleteUpdateUsers (err){
  if(!err){
    callback(200);
  } else {
    callback(500, {'Error' : 'Could not update the user.'});
  }
};

module.exports = Delete;