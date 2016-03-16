module.exports = function(grunt) {
    return {
        karma: {
            dev: {
                options: {
                    files:[
                        '<%= distdir %>/js/vendors/jquery-1.11.3.min.js',
                        '<%= distdir %>/js/vendors/angular.js',
                        '<%= distdir %>/js/vendors/*.js',
                        '<%= distdir %>/js/app/*/**/module.js',
                        '<%= distdir %>/js/app/*/**/*.js',
                        '<%= distdir %>/js/app/bootstrap.js',
                        '<%= distdir %>/js/templates.js',
                        '<%= clientdir %>/test/lib/*.js',
                        '<%= testdir %>/bootstrap.js',
                        '<%= testdir %>/*/**/*Spec.js'
                    ],
                    port:8080,
                    basePath: '',
                    frameworks: ['jasmine'],
                    browsers: ['PhantomJS'],
                    background: false,
                    singleRun: true,
                    logLevel: 'ERROR',
                    plugins : [
                          'karma-jasmine',
                          'karma-phantomjs-launcher'
                        ],

                    reporters: ['dots']
                }
            }
        }
    };
};