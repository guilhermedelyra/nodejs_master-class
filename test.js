var fs = require('fs');  
var async = require('async');

var myFile = 'kek.txt';

function ue (texto, callback) {
	async.waterfall([  
	    function(callback) {
	        var coco = "hey yeah";
	        fs.readFile(texto, 'utf8', callback);
	    },
	    function(txt, callback) {
	        txt = txt + '\nAppended something!';
	        fs.writeFile(texto, txt, callback);
	    },
	    function(ha) {
	    	ha(true, 'erro erro', 'erros demais')
	    }
	], function (err, result) {
	    if(err) {
	    	callback(err, result);
	    } else if (result === 'erro erro') {
	    	callback('oiiiEH');
	    }
	    else callback('Appended text!', 'ooh', result);
	});
}

ue (myFile, (err, data) => console.log('oi', err, data));
