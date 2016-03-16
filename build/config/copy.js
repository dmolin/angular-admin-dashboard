/*
 * Copy static assets to {distdir}
 */
module.exports = function _copy(grunt) {
    return {
        copy: {
            codeToDist: {
                files: [
                    {dest: '<%= distdir %>/js', src:'**', expand:true, cwd: '<%= srcdir %>' }
                ]
            },

            assetsToDist: {
                files: [
                    {dest: '<%= distdir %>/images', src:'**', expand:true, cwd: '<%= clientdir %>/images' },
                    {dest: '<%= distdir %>/fonts', src:'**', expand:true, cwd: '<%= clientdir %>/css/fonts' }
                ]
            }
        }
    };
};
