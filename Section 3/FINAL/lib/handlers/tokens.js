/*
 * Tokens Handlers
 */
var Post = require('./tokens_methods/post');
var Get = require('./tokens_methods/get');
var Delete = require('./tokens_methods/delete');
var Put = require('./tokens_methods/put');
var VerifyToken = require('./tokens_methods/verifyToken');

// Container for all the tokens methods
var _tokens  = {
  'post' : Post,
  'get' : Get,
  'delete' : Delete,
  'put' : Put,
  'verifyToken' : VerifyToken
};


// Export the tokens
module.exports = _tokens;