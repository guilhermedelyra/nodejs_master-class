var _data = require('./../../data');
var _tokens = require('./../tokens');

var email;
var token;
var callback;
// Required data: email
// Optional data: none
function Get (data, xd){
  callback = xd;
  email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length == 10 ? data.queryStringObject.email.trim() : false;
  if(email){
    token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid for the email
    _tokens.verifyToken(token, email, getVerify);
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

function getVerify (tokenIsValid){
  if(tokenIsValid){
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