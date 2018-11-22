/*
 * Users Post Anonymous Functions
 */

var _data = require('./../../data');
var helpers = require('./../../helpers');
var async = require('async');

// Users - post
// Required data: fullName, address, email, password
// Optional data: none
function Post (data, callback) {
  async.waterfall([
    function (callback) {
      var user = helpers.checkUser(data);
      if(user.fullName && user.address && user.email && user.hashedPassword){
        callback(false, user);
      } else {
        callback(400, {'Error' : 'Missing required fields'});
      }
    },

    function (data, callback) {
      _data.checkNonExistence('users', data.email, data, callback);
    },

    function (data, callback){
      var hashedPassword = helpers.hash(data.hashedPassword);
      if(hashedPassword){
        data.hashedPassword = hashedPassword;
        callback(false, data);
      } else {
        callback(500, {'Error' : 'Could not hash the user\'s password.'});
      }
    },

    function (data, callback) {
      _data.create('users', data.email, data, callback);
    }
  ], function (err, msg) {
    if (err) {
      if (err == 'Already exists') {
        callback(400, {'Error' : 'A user with that email already exists'});
      } else if (msg === undefined) {
        callback(500,{'Error' : 'Could not create the new user'});
      } else {
        callback(err, msg);
      }
    } else {
      callback(200);
    }
  })
}

module.exports = Post;