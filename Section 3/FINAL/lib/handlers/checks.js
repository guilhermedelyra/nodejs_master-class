/*
 * Order Handlers
 */
var _data = require('./../data');
var helpers = require('./../helpers');
var config = require('./../config');
var _tokens = require('./tokens')

// Container for all the order methods
var _order  = {};

/*
	user can make an order (post)
	user can see past order's (get)
	user can modify order (put)
	user can cancel order (delete)

	order's attributes:
	1. id
	2. list of products
	3. user's email
	4. data
 */

// Order - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
_order.post = function(data, callback){
  // Validate inputs
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
  if(protocol && url && method && successCodes && timeoutSeconds){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Lookup the user email by reading the token
    _data.read('tokens', token, function(err, tokenData){
      if(!err && tokenData){
        var userEmail = tokenData.email;

        // Lookup the user data
        _data.read('users', userEmail, function(err, userData){
          if(!err && userData){
            var userOrder = typeof(userData.order) == 'object' && userData.order instanceof Array ? userData.order : [];
            // Verify that user has less than the number of max-order per user
            if(userOrder.length < config.maxOrder){
              // Create random id for check
              var checkId = helpers.createRandomString(20);

              // Create check object including userEmail
              var checkObject = {
                'id' : checkId,
                'userEmail' : userEmail,
                'protocol' : protocol,
                'url' : url,
                'method' : method,
                'successCodes' : successCodes,
                'timeoutSeconds' : timeoutSeconds
              };

              // Save the object
              _data.create('order', checkId, checkObject, function(err){
                if(!err){
                  // Add check id to the user's object
                  userData.order = userOrder;
                  userData.order.push(checkId);

                  // Save the new user data
                  _data.update('users', userEmail, userData, function(err){
                    if(!err){
                      // Return the data about the new check
                      callback(200, checkObject);
                    } else {
                      callback(500, {'Error' : 'Could not update the user with the new check.'});
                    }
                  });
                } else {
                  callback(500, {'Error' : 'Could not create the new check'});
                }
              });



            } else {
              callback(400, {'Error' : 'The user already has the maximum number of order ('+config.maxOrder+').'})
            }


          } else {
            callback(403);
          }
        });


      } else {
        callback(403);
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required inputs, or inputs are invalid'});
  }
};

// Order - get
// Required data: id
// Optional data: none
_order.get = function(data, callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the check
    _data.read('order', id, function(err, checkData){
      if(!err && checkData){
        // Get the token that sent the request
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        _tokens.verifyToken(token, checkData.userEmail, function(tokenIsValid){
          if(tokenIsValid){
            // Return check data
            callback(200, checkData);
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required field, or field invalid'})
  }
};

// Order - put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds (one must be sent)
_order.put = function(data, callback){
  // Check for required field
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  // Check for optional fields
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  // Error if id is invalid
  if(id){
    // Error if nothing is sent to update
    if(protocol || url || method || successCodes || timeoutSeconds){
      // Lookup the check
      _data.read('order', id, function(err, checkData){
        if(!err && checkData){
          // Get the token that sent the request
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user who created the check
          _tokens.verifyToken(token, checkData.userEmail, function(tokenIsValid){
            if(tokenIsValid){
              // Update check data where necessary
              if(protocol){
                checkData.protocol = protocol;
              }
              if(url){
                checkData.url = url;
              }
              if(method){
                checkData.method = method;
              }
              if(successCodes){
                checkData.successCodes = successCodes;
              }
              if(timeoutSeconds){
                checkData.timeoutSeconds = timeoutSeconds;
              }

              // Store the new updates
              _data.update('order', id, checkData, function(err){
                if(!err){
                  callback(200);
                } else {
                  callback(500, {'Error' : 'Could not update the check.'});
                }
              });
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, {'Error' : 'Check ID did not exist.'});
        }
      });
    } else {
      callback(400, {'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400, {'Error' : 'Missing required field.'});
  }
};


// Order - delete
// Required data: id
// Optional data: none
_order.delete = function(data, callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the check
    _data.read('order', id, function(err, checkData){
      if(!err && checkData){
        // Get the token that sent the request
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        _tokens.verifyToken(token, checkData.userEmail, function(tokenIsValid){
          if(tokenIsValid){

            // Delete the check data
            _data.delete('order', id, function(err){
              if(!err){
                // Lookup the user's object to get all their order
                _data.read('users', checkData.userEmail, function(err, userData){
                  if(!err){
                    var userOrder = typeof(userData.order) == 'object' && userData.order instanceof Array ? userData.order : [];

                    // Remove the deleted check from their list of order
                    var checkPosition = userOrder.indexOf(id);
                    if(checkPosition > -1){
                      userOrder.splice(checkPosition, 1);
                      // Re-save the user's data
                      userData.order = userOrder;
                      _data.update('users', checkData.userEmail, userData, function(err){
                        if(!err){
                          callback(200);
                        } else {
                          callback(500, {'Error' : 'Could not update the user.'});
                        }
                      });
                    } else {
                      callback(500, {"Error" : "Could not find the check on the user's object, so could not remove it."});
                    }
                  } else {
                    callback(500, {"Error" : "Could not find the user who created the check, so could not remove the check from the list of order on their user object."});
                  }
                });
              } else {
                callback(500, {"Error" : "Could not delete the check data."})
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, {"Error" : "The check ID specified could not be found"});
      }
    });
  } else {
    callback(400, {"Error" : "Missing valid id"});
  }
};

// Export the order
module.exports = _order;