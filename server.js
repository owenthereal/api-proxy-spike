var config = require('./lib/config')
, util     = require('util')
, url      = require('url')
, http     = require('http')
, port     = config.get('PORT')
, authUrl  = config.get('proxy:auth-url')
, routes   = config.get('proxy:routes');

// proxy server
var proxyServer = require('./lib/proxy_server');
proxyServer.listen(port, authUrl, routes);

// auth server
http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var accessToken = query["access_token"];
  util.puts('Authenticating with access_token ' + accessToken);
  if (accessToken == 1234) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ email: 'foo@bar.com', access_token: accessToken }));
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Incorrect access token' }));
  }
}).listen(9001);

// resource server
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
}).listen(9002);

util.puts('http proxy server started on port ' + port + ', auth server started on 9001, resource server started on 9002');
