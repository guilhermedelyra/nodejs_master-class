var _data = require('./../../data');

var id, callback;
// Tokens - get
// Required data: id
// Optional data: none
function Get (data, xd){
  callback = xd;
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the token
    _data.read('tokens', id, getRead);
  } else {
    callback(400, {'Error' : 'Missing required field, or field invalid'})
  }
};

function getRead (err, tokenData){
  if(!err && tokenData){
    callback(200, tokenData);
  } else {
    callback(404);
  }
};

module.exports = Get;