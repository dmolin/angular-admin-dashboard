/*global _: true */
var _ = require("lodash"),
    path = require("path"),
    glob = require("glob");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-testem');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    var config = {
        clientdir: "client",
        srcdir: "client/js",
        appdir: "client/js/app",
        testdir: "client/test",
        assetsdir: "client",
        serverdir: "server",
        distdir: "dist",
        pkg: grunt.file.readJSON("package.json")
    };

    _.extend(config, _composeGruntConfig(grunt));
    grunt.initConfig(config);

    //No concatenation/minification stuff atm. It's an internal app, so let's aim for simplicity here
    grunt.registerTask("buildserver", ["jshint:server"]);
    grunt.registerTask("buildclient", [ "jshint:client", "cssmin", "ngtemplates", "copy", "karma"]);
    grunt.registerTask("build",["buildserver", "buildclient"]);
    grunt.registerTask("dev",   ["clean", "build", "watch"]);
    grunt.registerTask("test", ["build"]);

    grunt.registerTask("default", ["build"]);
};


/**
 * Create a single Grunt config object, assembling the content of the files found in the build/config folder
 */
function _composeGruntConfig(grunt) {
    var config = {};
    var configTasks = glob.sync("build/config/*.js");
    _.each(configTasks, function(cfg) {
        var name = cfg.substr(0, cfg.indexOf(path.extname(cfg)));
        var fn = require("./" + name);
        if(_.isFunction(fn)) { _.extend(config, fn(grunt)); }
    });
    return config;
}


