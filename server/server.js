var config             = require('config'),
    _                  = require('lodash'),
    moment             = require('moment'),
    url                = require('url'),
    express            = require('express'),
    app                = express(),
    bodyParser         = require('body-parser'),
    path               = require('path'),
    dot                = require('express-dot-engine'),
    mongoose           = require('mongoose'),
    logger             = require('morgan'),
    cookieParser       = require('cookie-parser'),
    authMiddleware     = require('./middleware/fakeAuthMiddleware'),
    PORT               = config.server.port;

if(config.mongo && config.mongo.connectUrl) {
  mongoose.connect(config.mongo.connectUrl);
}

app.engine('dot', dot.__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dot');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json());

// Emulate SSO (not implemented for this demo project)
app.use(authMiddleware.init());

// APPLICATION ROUTING
require('./routes/home')(app);

// API ROUTES
var apiIndex = require('./routes/api');
_.each(_.values(apiIndex), function(mod) {
  mod(app, app.locals.appConfig);
});

if (process.argv.indexOf('--listen-only') == -1) {
  app.listen(PORT, _.partial(console.log, 'Server running on http://localhost:%s', PORT ));
}
