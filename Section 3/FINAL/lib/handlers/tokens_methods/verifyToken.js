var _data = require('./../../data');

// Verify if a given token id is currently valid for a given user
function verifyToken (id, email, callback){
  // Lookup the token
  _data.read('tokens', id, verifyTokenRead);
};

function verifyTokenRead (err, tokenData){
  if(!err && tokenData){
    // Check that the token is for the given user and has not expired
    if(tokenData.email == email && tokenData.expires > Date.now()){
      callback(true);
    } else {
      callback(false);
    }
  } else {
    callback(false);
  }
};

module.exports = verifyToken;