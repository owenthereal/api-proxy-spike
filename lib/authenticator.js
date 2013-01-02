var util    = require('util')
, utils     = require('./utils')
, http      = require('http')
, httpProxy = require('http-proxy');

function matcher(authorization) {
  var r = new RegExp('Bearer (.+)');
  return r.exec(authorization);
}

function rewriteReq(req, credentials) {
  req.headers.authorization = 'Basic ' + credentials.email + ':' + credentials.access_token;
}

function authUrl(host, accessToken) {
  return host + '?access_token=' + accessToken;
}

module.exports = function(authHost) {
  return function (req, res, next) {
    var m = matcher(req.headers.authorization);
    if (!m) {
      utils.sendError(res, 401);
      return;
    }

    var accessToken = m[1];
    var buffer = httpProxy.buffer(req);

    var url = authUrl(authHost, accessToken);
    var callback = function(response) {
      util.log('Got response: ' + response.statusCode);

      var content = '';
      response.setEncoding('utf-8');
      response.on('data', function (chunk) {
        content += chunk ;
      });

      response.on('end', function() {
        var statusCode = response.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
          rewriteReq(req, JSON.parse(content));
          next();
          buffer.resume();
        } else {
          utils.sendError(res, 401);
          buffer.destroy();
        }
      });
    };

    var request = http.request(url, callback);
    request.on('error', function(e) {
      util.log('Got error: ' + e.message);
      utils.sendError(res, 500);
      buffer.destroy();
    });
    request.end();
  }
};
