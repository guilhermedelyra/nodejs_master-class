var _data = require('./../../data');
var helpers = require('./../../helpers');
var _tokens = require('./../tokens');
var async = require('async');

// Required data: email
// Optional data: fullName, address, password (at least one must be specified)
function Put (data, callback) {
  var user;
  async.waterfall([
    function (callback){
      user = helpers.checkUser(data);
      if(user.email){
        callback(false, user);
      } else {
        callback(400,{'Error' : 'Missing required field.'});
      }
    },

    function (user, callback) {
      if(user.fullName || user.address || user.password){
        var token = helpers.validateString(data.headers.token);
        callback(false, token);
      } else {
        callback(400,{'Error' : 'Missing fields to update.'});
      }
    },

    function (token, callback) {
      _tokens.verifyToken(token, user.email, callback);
    },
    
    function (callback) {
      _data.read('users', user.email, callback);
    },
    
    function (data, callback){
      if(user.fullName){
        data.fullName = user.fullName;
      }
      if(user.address){
        data.address = user.address;
      }
      if(user.password){
        data.hashedPassword = helpers.hash(user.password);
      }
      // Store the new updates
      _data.update('users', user.email, data, callback);
    },
  ], function (err, msg) {
    if (err) {
      if (err == 'Error reading') {
        callback(400, {'Error' : 'Specified user does not exist.'});
      } else if (err == 'Invalid Token') {
        callback(403, {"Error" : "Missing required token in header, or token is invalid."});
      } else if (msg === undefined) {
        callback(500, {'Error' : 'Could not update the user.'});
      } else {
        callback(err, msg);
      }
    } else {
      callback(200);
    }
  })  
}

module.exports = Put;