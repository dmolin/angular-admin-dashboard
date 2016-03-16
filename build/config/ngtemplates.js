module.exports = function ngtemplates(grunt) {
    return {
      ngtemplates: {
        app: {
            cwd: '<%= appdir %>',
            src: '**/*.html',
            dest: '<%= distdir %>/js/templates.js'
        }
      }
    };
};