var util = require('util'),
http = require('http'),
httpProxy = require('http-proxy');

module.exports = function (url) {
  return function (req, res, next) {
    var r = new RegExp('Bearer (.+)');
    var m = r.exec(req.headers.authorization);
    if (!m) {
      send401(res);
      return;
    }

    var accessToken = m[1];
    var buffer = httpProxy.buffer(req);
    http.get(url + '?access_token=' + accessToken, function (res) {
      util.puts('Got response: ' + res.statusCode);
      next();
      buffer.resume();
    }).on('error', function (e) {
      util.puts('Got error: ' + e.message);
      send401(res);
      buffer.destroy();
    });
  }
};

function send401(response) {
  response.writeHead(401, {
    'Content-Type': 'text/plain'
  });
  response.end('Unauthorized');
}
