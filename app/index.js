var https = require('https');
var url = require('url');
var fs = require('fs');
var string_decoder = require('string_decoder').StringDecoder;

var options = {
    key : fs.readFileSync('https/key.pem'),
    cert : fs.readFileSync('https/cert.pem'),
    requestCert : false,
    rejectUnauthorized : false
}

https.createServer(options, (req, res) => {
    var parsed_url = url.parse(req.url, true);
    var path = parsed_url.pathname;
    var trimmed_path = path.replace(/^\/+|\/+$/g, '');
    var query_string_object = parsed_url.query;
    var method = req.method.toLowerCase();
    var headers = req.headers;
    var decoder = new string_decoder('utf-8');
    var buffer = '';
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (data) => {
        buffer += decoder.write(data);
    }).on('end', () => {
        buffer += decoder.end();
        var chosen_handler = typeof(router[trimmed_path]) !== 'undefined' ? router[trimmed_path] : handlers.not_found;

        var data = {
            'trimmed_path' : trimmed_path,
            'query_string_object' : query_string_object,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        chosen_handler(data, (status_code, payload) => {
            status_code = typeof(status_code) == 'number' ? status_code : 200;
            payload = typeof(payload) == 'object'? payload : {};
            var payload_string = JSON.stringify(payload)+'\n';
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(status_code);
            res.end(payload_string);
            console.log("Returning this response: ", status_code, payload_string);
        });
    });
}).listen (3000, () => { console.log('Listening at 3000'); });

var handlers = {
    'hello' : (data, callback) => { callback(200, { 'message' : 'Hello!'}) },
    'not_found' : (data, callback) => { callback(404) }
};

var router = { 'hello' : handlers.hello };
