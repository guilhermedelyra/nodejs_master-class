var post = require('./../post');
var Delete = require('./../delete');
const assert = require('assert');
var helpers = require('./../../../helpers');
var _data = require('./../../../data');

var wronglyFilled = {
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
	"fullName" : "Joao Garcia",
	"address" : "Minas Gerais",
	"email" : "joao@email.com",
	"password" : "portaazul",
	"orders":["dzz4nfyluk5eam7bqg5k","uhwhtakv8qgkkadlev47","cg2pwijpo5lqyu1w29lu"]
};

_data.create('users', user.email, user, ()=>{});

Delete(wronglyFilled, (statusCode, payload) => {
	assert.strictEqual(403, statusCode);
});

Delete(correctlyFilled, (statusCode, payload) => {
	assert.strictEqual(200, statusCode);
});

// _data.delete('users', correctlyFilled.payload.email, ()=>{console.log('adieu')});
