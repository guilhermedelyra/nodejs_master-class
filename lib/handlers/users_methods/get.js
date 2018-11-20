var _data = require('./../../data');
var _tokens = require('./../tokens');
var _helpers = require('./../../helpers')
// Required data: email
// Optional data: none
function Get (data, callback){
  var email = _helpers.validateEmail(data.queryStringObject.email);
  if(email){
    var token = _helpers.validateToken(data.headers.token);
    _tokens.verifyToken(token, email, getVerify);
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

function getVerify (tokenIsValid, email){
  if(!tokenIsValid){
    _data.read('users', email, getRead);
  } else {
    callback(403,{"Error" : "Missing required token in header, or token is invalid."})
  }
};

function getRead (err, data){
  if(!err && data){
    // Remove the hashed password from the user user object before returning it to the requester
    delete data.hashedPassword;
    callback(200, data);
  } else {
    callback(404);
  }
};

module.exports = Get;