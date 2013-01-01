var util = require('util'),
http = require('http'),
httpProxy = require('http-proxy');

function matcher (authorization) {
  var r = new RegExp('Bearer (.+)');
  return r.exec(authorization);
}

function rewriteReq (req, credentials) {
  req.headers.authorization = 'Basic ' + credentials.email + ':' + credentials.access_token;
}

function send401(response) {
  response.writeHead(401, {
    'Content-Type': 'text/plain'
  });
  response.end('Unauthorized');
}

module.exports = function (url) {
  return function (req, res, next) {
    var m = matcher(req.headers.authorization);
    if (!m) {
      send401(res);
      return;
    }

    var accessToken = m[1];
    var buffer = httpProxy.buffer(req);
    http.get(url + '?access_token=' + accessToken, function (response) {
      util.puts('Got response: ' + response.statusCode);

      response.body = '';
      response.setEncoding('utf-8');
      response.on('data', function (chunk) {
        response.body += chunk ;
      });

      response.on('end', function() {
        var statusCode = response.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
          rewriteReq(req, JSON.parse(response.body));
          next();
          buffer.resume();
        } else {
          send401(res);
          buffer.destroy();
        }
      });
    }).on('error', function (e) {
      util.puts('Got error: ' + e.message);
      send401(res);
      buffer.destroy();
    });
  }
};

