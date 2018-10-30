var _data = require('./../../data');

// Tokens - put
// Required data: id, extend
// Optional data: none
function Put (data, callback){
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if(id && extend){
    // Lookup the existing token
    _data.read('tokens', id, putRead);
  } else {
    callback(400, {"Error": "Missing required field(s) or field(s) are invalid."});
  }
};

function putRead (err, tokenData){
  if(!err && tokenData){
    // Check to make sure the token isn't already expired
    if(tokenData.expires > Date.now()){
      // Set the expiration an hour from now
      tokenData.expires = Date.now() + 1000 * 60 * 60;
      // Store the new updates
      _data.update('tokens', id, tokenData, putUpdate);
    } else {
      callback(400, {"Error" : "The token has already expired, and cannot be extended."});
    }
  } else {
    callback(400, {'Error' : 'Specified user does not exist.'});
  }
};

function putUpdate (err){
  if(!err){
    callback(200);
  } else {
    callback(500, {'Error' : 'Could not update the token\'s expiration.'});
  }
};

module.exports = Put;