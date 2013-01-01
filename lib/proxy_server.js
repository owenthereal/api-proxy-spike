var util = require('util'),
httpProxy = require('http-proxy');

exports.listen = function(port, authUrl, routes) {
  var proxyServer = httpProxy.createServer(
    require('./authenticator')(authUrl),
    require('proxy-by-url')(routes)
  ).listen(8001);

  proxyServer.proxy.on('proxyError', function (err, req, res) {
    util.puts(err);
    send500(res);
  });
};

function send500(response) {
  response.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  response.end('Something went wrong');
}
