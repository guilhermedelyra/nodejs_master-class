var _data = require('./../../data');
var _tokens = require('./../tokens');

// Required data: email
// Cleanup old checks associated with the user
var Delete = function(data, callback){
  // Check that email is valid
  var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length == 10 ? data.queryStringObject.email.trim() : false;
  if(email){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

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
    // Delete each of the checks associated with the user
    var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
    var checksToDelete = userChecks.length;
    if(checksToDelete > 0){
      var checksDeleted = 0;
      var deletionErrors = false;
      // Loop through the checks
      userChecks.forEach(deleteForEachCheck);
    } else {
      callback(200);
    }
  } else {
    callback(500,{'Error' : 'Could not delete the specified user'});
  }
};

function deleteForEachCheck (checkId){
  // Delete the check
  _data.delete('checks', checkId, deleteChecksDelete);
};

function deleteChecksDelete (err){
  if(err){
    deletionErrors = true;
  }
  checksDeleted++;
  if(checksDeleted == checksToDelete){
    if(!deletionErrors){
      callback(200);
    } else {
      callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."})
    }
  }
};

module.exports = Delete;