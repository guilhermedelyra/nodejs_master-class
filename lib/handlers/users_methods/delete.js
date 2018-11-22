var _data = require('./../../data');
var _tokens = require('./../tokens');
var async = require('async');
var helpers = require('./../../helpers');

// Required data: email
// Cleanup old orders associated with the user
function Delete (data, callback){
  var email = helpers.validateEmail(data.payload.email);
  var userData;
  async.waterfall([
    function (callback){
      if(email) {
        var token = helpers.validateString(data.headers.token);
        callback(false, token);
      } else {
        callback(400,{'Error' : 'Missing required field'})
      }
    },

    function (token, callback) {
      _tokens.verifyToken(token, email, callback);
    },

    function (callback){
      _data.read('users', email, callback);
    },

    function (data, callback){
      if (data) {
        userData = data;
        callback(false);
      } else {
        callback(400, {'Error' : 'Could not find the specified user.'});
      }
    },

    function (callback){
      _data.delete('users', email, callback);
    },

    function (callback){
      var userOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];
      var ordersToDelete = userOrders.length;
      if(ordersToDelete > 0) {
        var ordersDeleted = 0;
        userOrders.forEach(function (orderID){
          _data.delete('orders', orderID, callback);
          ordersDeleted++;
        });
        if (ordersDeleted != ordersToDelete) {
          callback(true, 'Error deleting orders');
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    },

  ], function (err, msg) {
      if (err) {
        if (msg == 'Error deleting users') {
          callback(500,{'Error' : 'Could not delete the specified user'});
        } else if (msg == 'Error deleting orders') {
          callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's orders. All orders may not have been deleted from the system successfully."})
        } else if (err == 'Invalid Token') {
          callback(403, {"Error" : "Missing required token in header, or token is invalid."});
        } else {
          callback(err, msg);
        }
      } else {
        callback(200);
      }
  });
}

module.exports = Delete;