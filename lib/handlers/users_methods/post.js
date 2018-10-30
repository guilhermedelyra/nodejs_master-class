/*
 * Users Post Anonymous Functions
 */

var _data = require('./../../data');
var helpers = require('./../../helpers');


function Post (data, callback) {

}

function checkData (data, callback) {
  var fullName = typeof(data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
  var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(fullName && address && email && password && helpers.validateEmail(email)){
    var user = {fullName, address, email, "hashedPassword" : password};
    callback(false, user);
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
}

function checkNonUserExistance (user, callback) {
  _data.read('users', user.email, callback);
}

function 
// Users - post
// Required data: fullName, address, email, password
// Optional data: none
function Post (data, callback){
  // Check that all required fields are filled out
  var fullName = typeof(data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
  var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if(fullName && address && email && password && helpers.validateEmail(email)){
    // Make sure the user doesnt already exist
    _data.read('users', email, postRead);
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

function postRead (err, data){
  if(err){
    // Hash the password
    var hashedPassword = helpers.hash(password);

    // Create the user object
    if(hashedPassword){
      userObject = {
        'fullName' : fullName,
        'address' : address,
        'email' : email,
        'hashedPassword' : hashedPassword
      };

      // Store the user
      _data.create('users', email, userObject, postCreation);
    } else {
      callback(500,{'Error' : 'Could not hash the user\'s password.'});
    }
  } else {
    // User alread exists
    callback(400,{'Error' : 'A user with that email already exists'});
  }
};

function postCreation (err){
  if(!err){
    callback(200);
  } else {
    callback(500,{'Error' : 'Could not create the new user'});
  }
};

module.exports = Post;