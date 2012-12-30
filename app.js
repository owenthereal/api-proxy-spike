var util = require('util'),
url = require('url'),
http = require('http'),
httpProxy = require('http-proxy'),
authenticator = function (req, res, next) {
  var r = new RegExp("Bearer (.+)");
  var m = r.exec(req.headers.authorization);
  if (!m) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Unauthroized');
    return;
  }

  var accessToken = m[1];
  var buffer = httpProxy.buffer(req);
  http.get("http://localhost:9000?access_token=" + accessToken, function(res) {
    util.puts("Got response: " + res.statusCode);

    next();
    buffer.resume();
  }).on('error', function(e) {
    util.puts("Got error: " + e.message);

    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.write('Incorrect access_token');
    res.end();

    buffer.destroy();
  });
},
proxyByUrl = require('proxy-by-url') ({
  '/acl': { port: 80, host: 'www.acl.dev' },
  '.*': { port: 9001, host: 'localhost' }
}),
proxyServer = httpProxy.createServer(
  authenticator,
  proxyByUrl
).listen(8001);

// Listen for the `proxyError` event on `server.proxy`. _It will not
// be raised on the server itself._
proxyServer.proxy.on('proxyError', function (err, req, res) {
  util.puts(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

// auth server
http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var accessToken = query["access_token"];
  util.puts('Authenticating with access_token ' + accessToken);
  if (accessToken) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Correct access_token');
    res.end();
  } else {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.write('Incorrect access_token');
    res.end();
  }
}).listen(9000);

// resource server
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9001);

util.puts('http proxy server started on port 8001, auth server started on 9000, resource server started on 9001');
