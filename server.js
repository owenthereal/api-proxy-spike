var util = require('util'),
url = require('url'),
http = require('http');

// proxy server
var proxyServer = require('./lib/proxy_server');
proxyServer.listen(8001);

// auth server
http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var accessToken = query["access_token"];
  util.puts('Authenticating with access_token ' + accessToken);
  if (accessToken) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Correct access_token');
  } else {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Incorrect access_token');
  }
}).listen(9000);

// resource server
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
}).listen(9001);

util.puts('http proxy server started on port 8001, auth server started on 9000, resource server started on 9001');
