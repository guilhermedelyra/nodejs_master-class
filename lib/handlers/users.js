/*
 * Users Handlers
 */

var Post = require('./users_methods/post');
var Get = require('./users_methods/get');
var Delete = require('./users_methods/delete');
var Put = require('./users_methods/put');

// Container for all the users methods
var _users = {
	'post' : Post, 
	'get' : Get, 
	'delete' : Delete, 
	'put' : Put
};

// Export the users
module.exports = _users;
