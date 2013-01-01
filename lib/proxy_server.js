var util = require('util'),
httpProxy = require('http-proxy'),
authenticator = require('./authenticator')('http://localhost:9000'),
proxyByUrl = require('proxy-by-url')({
  '/acl': { port: 80, host: 'www.acl.dev' },
  '.*': { port: 9001, host: 'localhost' }
});

exports.listen = function(port) {
  var proxyServer = httpProxy.createServer(
    authenticator,
    proxyByUrl
  ).listen(8001);

  proxyServer.proxy.on('proxyError', function (err, req, res) {
    util.puts(err);
    send500(res);
  });
};

function send500(response) {
  resposne.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  response.end('Something went wrong');
}
