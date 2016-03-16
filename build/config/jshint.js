module.exports = function _jshint(grunt) {
    return {
		jshint: {
			client: [
				"<%= srcdir %>/**/*.js",
				"!<%= srcdir %>/vendors/**/*.js",
				"!<%= testdir %>/lib/**",
				//"<%= testdir %>/**/*.js"
			],
			server: [
				"<%= serverdir %>/**/*.js",
				"<%= serverdir %>/test/**/*.js"
			],
			options: {
				jshintrc: true
			}
		}
  	};
};