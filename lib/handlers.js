/*
 * Request Handlers
 */

 var _tokens = require('./handlers/tokens');
 var _orders = require('./handlers/orders');
 var _users = require('./handlers/users');

// Define all the handlers
var handlers = {_users, _orders, _tokens};

// Ping
handlers.ping = function(data,callback){
  setTimeout(function(){
    callback(200);
  }, 5000);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404);
};

// Users
handlers.users = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Tokens
handlers.tokens = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Checks
handlers.orders = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._orders[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Export the handlers
module.exports = handlers;
