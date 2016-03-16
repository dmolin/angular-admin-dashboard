module.exports = function clean(grunt) {
    return {
      clean: {
        all: ['<%= distdir %>/*']
      }
    };
};
