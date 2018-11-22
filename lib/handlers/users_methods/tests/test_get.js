var post = require('./../post');
var get = require('./../get');
const assert = require('assert');
var helpers = require('./../../../helpers');
var _data = require('./../../../data');

var wronglyFilled1 = {
	'payload' : {},
	'headers' : {
		"token" : "jjn1qwgxgca3mwr839nx",
		"Content-type": "application/json"
	}
};

var wronglyFilled2 = {
	'payload' : {
		"email" : "lalala@email.com",
	},
	'headers' : {
		"token" : "jjn1qwgxgca3mwr839nx",
		"Content-type": "application/json"
	}
};

var correctlyFilled = {
	'payload' : {
		"email" : "joao@email.com",
	},
	'headers' : {
		"token" : "jjn1qwgxgca3mwr839nx",
		"Content-type": "application/json"
	}
};

var user = {
	'payload' : {
		"fullName" : "Joao Garcia",
		"address" : "Minas Gerais",
		"email" : "joao@email.com",
		"password" : "portaazul"
	}
};

post(user, (statusCode, payload) => {
	assert.strictEqual(200, statusCode);
});

get(wronglyFilled1, (statusCode, payload) => {
	assert.strictEqual(400, statusCode);
});

get(wronglyFilled2, (statusCode, payload) => {
	assert.strictEqual(403, statusCode);
});

get(correctlyFilled, (statusCode, payload) => {
	_data.delete('users', correctlyFilled.payload.email, (err)=>{assert.strictEqual(err, null)});
	assert.strictEqual(200, statusCode);
});
