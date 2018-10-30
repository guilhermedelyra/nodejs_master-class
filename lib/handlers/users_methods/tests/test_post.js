var post = require('./../post');
const assert = require('assert');
var helpers = require('./../../../helpers');
var _data = require('./../../../data');

var wronglyFilled = {
	'payload' : {
		'fullName' : '',
		'address' : '',
		'email' : '',
		'password' : ''
	}
};

var correctlyFilled = {
	'payload' : {
		"fullName" : "Joao Garcia",
		"address" : "Minas Gerais",
		"email" : "joao@email.com",
		"password" : "portaazul"
	}
};

post(wronglyFilled, (statusCode, payload) => {
	assert.strictEqual(400, statusCode);
});

post(correctlyFilled, (statusCode, payload) => {
	assert.strictEqual(200, statusCode);
	_data.delete('users', correctlyFilled.payload.email, (err)=>{assert.strictEqual(err, null)});
});



