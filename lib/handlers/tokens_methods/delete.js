var _data = require('./../../data');

var callback, id;
// Tokens - delete
// Required data: id
// Optional data: none
function Delete (data, xd){
  callback = xd;
  // Check that id is valid
  id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the token
    _data.read('tokens', id, deleteRead);
  } else {
    callback(400, {'Error' : 'Missing required field'})
  }
};

function deleteRead (err, tokenData){
  if(!err && tokenData){
    // Delete the token
    _data.delete('tokens', id, deleteDelete);
  } else {
    callback(400, {'Error' : 'Could not find the specified token.'});
  }
};

function deleteDelete (err){
  if(!err){
    callback(200);
  } else {
    callback(500, {'Error' : 'Could not delete the specified token'});
  }
};

module.exports = Delete;