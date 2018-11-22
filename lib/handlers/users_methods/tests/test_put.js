var post = require('./../post');
var put = require('./../put')
const assert = require('assert');
var helpers = require('./../../../helpers');
var _data = require('./../../../data');

var correctlyFilled = {
	'payload' : {
		"fullName" : "Joao Garcia",
		"address" : "Minas Gerais",
		"email" : "joao@email.com",
		"password" : "portaazul"
	}
};

var wrongUpdate1 = {
	'payload' : {
		"email" : "joao@email.com",
	},
	'headers' : {
		"token" : "jjn1qwgxgca3mwr839nx",
		"Content-type": "application/json"
	}
};

var wrongUpdate2 = {
	'payload' : {
		"fullName" : "Joao Garcia",
		"email" : "lalalala@email.com",
	},
	'headers' : {
		"token" : "jjn1qwgxgca3mwr839nx",
		"Content-type": "application/json"
	}
};

var correctUpdate = {
	'payload' : {
		"fullName" : "Marcelo",
		"address" : "Minas Gerais",
		"email" : "joao@email.com",
		"password" : "portaazul"
	},
	'headers' : {
		"token" : "jjn1qwgxgca3mwr839nx",
		"Content-type": "application/json"
	}
};

post(correctlyFilled, () => {
	put(wrongUpdate1, (statusCode, payload) => {
		assert.strictEqual(400, statusCode);
	});
});
post(correctlyFilled, () => {
	put(wrongUpdate2, (statusCode, payload) => {
		assert.strictEqual(403, statusCode);
	});
});
post(correctlyFilled, () => {
	put(correctUpdate, (statusCode, payload) => {
		assert.strictEqual(200, statusCode);
		_data.delete('users', correctlyFilled.payload.email, (err)=>{assert.strictEqual(err, null)});
	});
});
