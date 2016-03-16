var URL = require('url'),
  _ = require('lodash');

module.exports = function(app) {
  app.post('/api/utils/urlcheck', function (req, res) {
    var url = req.body.url;
    var acceptedTypes = req.body.acceptedTypes;

    //try to fetch the URL and check the headers
    var getter = (url.indexOf('http:') >= 0 ? require('http') : require('https'));
    var urlObj = URL.parse(url);

    if (!urlObj.protocol || urlObj.protocol.indexOf('http') !== 0 || !urlObj.host) {
      //not a valid http(s) url
      res.status(400).json({status: 'failure', reason: 'The url provided is not a valid URL'});
      return;
    }
    var check = getter.request({
      method: 'HEAD',
      host: urlObj.host,
      port: urlObj.port,
      path: urlObj.path
    }, function (response) {
      var contentType = response.headers['content-type'];
      if (_.find(acceptedTypes, function(type) {
          return contentType.indexOf(type) === 0;
        })) {
        res.json({status: 'success'});
      } else {
        res.status(400).json({status: 'failure', reason: 'The URL provided does not identify a valid resource'});
      }
    });
    check.end();
  });

};
