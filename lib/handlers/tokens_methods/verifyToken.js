var _data = require('./../../data');

// Verify if a given token id is currently valid for a given user
function verifyToken (id, email, callback){
  // Lookup the token
  _data.read('tokens', id, function (err, tokenData){
    if(!err && tokenData){
      // Check that the token is for the given user and has not expired
      if(tokenData.email == email && tokenData.expires > Date.now()){
        callback(false, email);
      } else {
        callback(true);
      }
    } else {
      callback(true);
    }
  });
};

module.exports = verifyToken;