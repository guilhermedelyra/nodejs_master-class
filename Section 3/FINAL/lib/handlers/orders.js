/*
 * Order Handlers
 */
var Post = require('./orders_methods/post');
var Get = require('./orders_methods/get');
var Delete = require('./orders_methods/delete');
var Put = require('./orders_methods/put');

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

// Container for all the order methods
var _order  = {
  'post' : Post, 
  'get' : Get, 
  'delete' : Delete, 
  'put' : Put
};



// Export the order
module.exports = _order;