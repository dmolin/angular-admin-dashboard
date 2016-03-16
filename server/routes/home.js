var _ = require('lodash'),
    path = require('path'),
    glob = require('glob-all');

module.exports = function(app) {
    app.get('/', home);
};

function home(req, res) {
    console.log("HOME");
    return res.render('index', {
        env: {
            user: {
                name: req.user.name, email: req.user.email
            }
        },
        scripts: _generateScriptTags()
    });
}

/**
 * Generate the script tags for all the client code.
 */
function _generateScriptTags() {
    var root = path.join(__dirname, '../../dist/');
    var files = glob.sync([
        //vendors libraries
        root + "js/vendors/jquery*.js",
        root + "js/vendors/angular.js*",
        root + "js/vendors/angular*.js",
        root + "js/vendors/*",
        //application files
        root + "js/app/**/module.js",
        root + "js/app/**/*.js",
        root + "js/app/bootstrap.js",
        root + "js/templates.js"
    ]);

    return _.reduce(files, function(acc, it) {
        it = it.replace(root, "");
        acc.push('<script src="' + it + '"></script>');
        return acc;
    }, []).join("\n");
}
