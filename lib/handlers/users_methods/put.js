var _data = require('./../../data');
var helpers = require('./../../helpers');
var _tokens = require('./../tokens');

var email;
var fullName;
var address;
var password;
var token;
var callback;
// Required data: email
// Optional data: fullName, address, password (at least one must be specified)
function Put (data, xd){
  callback = xd;
  email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  fullName = typeof(data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
  address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
  password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if(email){
    if(fullName || address || password){
      token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
      // Verify that the given token is valid for the email
      _tokens.verifyToken(token, email, putVerify);
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }
};

function putVerify(tokenIsValid){
  if(tokenIsValid){
    // Lookup the user
    _data.read('users', email, putRead);
  } else {
    callback(403,{"Error" : "Missing required token in header, or token is invalid."});
  }
};

function putRead (err, userData){
  if(!err && userData){
    // Update the fields if necessary
    if(fullName){
      userData.fullName = fullName;
    }
    if(address){
      userData.address = address;
    }
    if(password){
      userData.hashedPassword = helpers.hash(password);
    }
    // Store the new updates
    _data.update('users', email, userData, function(err){
      if(!err){
        callback(200);
      } else {
        callback(500,{'Error' : 'Could not update the user.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Specified user does not exist.'});
  }
};

module.exports = Put;