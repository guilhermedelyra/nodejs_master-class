var _data = require('./../../data');
var helpers = require('./../../helpers');

var email, password, tokenObject, callback;

// Tokens - post
// Required data: email, password
// Optional data: none
function Post (data, xd) {
  callback = xd;
  email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(email && password){
    // Lookup the user who matches that email
    _data.read('users', email, postRead);
  } else {
    callback(400, {'Error' : 'Missing required field(s).'})
  }
};

function postRead (err, userData){
  if(!err && userData){
    // Hash the sent password, and compare it to the password stored in the user object
    var hashedPassword = helpers.hash(password);
    if(hashedPassword == userData.hashedPassword){
      // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
      var tokenId = helpers.createRandomString(20);
      var expires = Date.now() + 1000 * 60 * 60;
      tokenObject = {
        'email' : email, 
        'id' : tokenId, 
        'expires' : expires
      };

      // Store the token
      _data.create('tokens', tokenId, tokenObject, postCreation);
    } else {
      callback(400, {'Error' : 'Password did not match the specified user\'s stored password'});
    }
  } else {
    callback(400, {'Error' : 'Could not find the specified user.'});
  }
};

function postCreation (err){
	if(!err){
	  callback(200, tokenObject);
	} else {
	  callback(500, {'Error' : 'Could not create the new token'});
	}
};

module.exports = Post;