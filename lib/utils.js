var http = require('http');

exports.sendError = function(response, code) {
  response.writeHead(code, {
    'Content-Type': 'text/plain'
  });
  response.end(http.STATUS_CODES[code]);
}
