var _data = require('./../../data');
var _tokens = require('./../tokens');

var email, token, userOrders, ordersToDelete, ordersDeleted, deletionErrors, callback;
// Required data: email
// Cleanup old orders associated with the user
function Delete (data, xd){
  callback = xd;
  // Check that email is valid
  email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
  if(email){

    // Get token from headers
    token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the email
    _tokens.verifyToken(token, email, deleteVerify);
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

function deleteVerify (tokenIsValid){
  if(tokenIsValid){
    // Lookup the user
    _data.read('users', email, deleteRead);
  } else {
    callback(403,{"Error" : "Missing required token in header, or token is invalid."});
  }
};

function deleteRead (err, userData){
  if(!err && userData){
    // Delete the user's data
    _data.delete('users', email, deleteUsersDelete);
  } else {
    callback(400,{'Error' : 'Could not find the specified user.'});
  }
};

function deleteUsersDelete (err){
  if(!err){
    // Delete each of the orders associated with the user
    userOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];
    ordersToDelete = userOrders.length;
    if(ordersToDelete > 0){
      ordersDeleted = 0;
      deletionErrors = false;
      // Loop through the orders
      userOrders.forEach(deleteForEachCheck);
    } else {
      callback(200);
    }
  } else {
    callback(500,{'Error' : 'Could not delete the specified user'});
  }
};

function deleteForEachCheck (checkId){
  // Delete the check
  _data.delete('orders', checkId, deleteOrdersDelete);
};

function deleteOrdersDelete (err){
  if(err){
    deletionErrors = true;
  }
  ordersDeleted++;
  if(ordersDeleted == ordersToDelete){
    if(!deletionErrors){
      callback(200);
    } else {
      callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's orders. All orders may not have been deleted from the system successfully."})
    }
  }
};

module.exports = Delete;