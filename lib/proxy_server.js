var util    = require('util')
, utils     = require('./utils')
, httpProxy = require('http-proxy');

exports.listen = function(port, authUrl, routes) {
  var proxyServer = httpProxy.createServer(
    require('./authenticator')(authUrl),
    require('proxy-by-url')(routes)
  ).listen(port);

  proxyServer.proxy.on('proxyError', function (err, req, res) {
    util.log(err);
    utils.sendError(res, 500);
  });
};
