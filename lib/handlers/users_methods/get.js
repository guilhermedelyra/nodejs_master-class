var _data = require('./../../data');
var _tokens = require('./../tokens');
var helpers = require('./../../helpers')
var async = require('async')
// Required data: email
// Optional data: none
function Get (data, callback) {
  var email = helpers.validateEmail(data.payload.email);
  async.waterfall([
    function (callback) {
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
    function (callback) {
       _data.read('users', email, callback);
    }
  ], function (err, msg) {
    if(!err) {
      if (msg) {
        delete msg.hashedPassword;
        callback(200, msg);
      } else {
        callback(404);
      }
    } else if (err == 'Error reading') {
      callback(400, {'Error' : 'Specified user does not exist.'});
    } else if (err == 'Invalid Token') {
      callback(403, {"Error" : "Missing required token in header, or token is invalid."});
    } else {
      callback(err, msg);
    }
  });
}

module.exports = Get;