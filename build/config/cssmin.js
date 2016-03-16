module.exports = function concat(grunt) {
    return {
        cssmin: {
            combine: {
                files: {
                    '<%= distdir %>/css/main.css': [
                        "<%= assetsdir %>/css/vendors/angular-material.min.css",
                        "<%= assetsdir %>/css/vendors/bootstrap.min.css",
                        "<%= assetsdir %>/css/vendors/font-awesome.min.css",
                        "<%= assetsdir %>/css/vendors/spinkit.css",
                        "<%= assetsdir %>/css/vendors/colorpicker.min.css",
                        //"<%= assetsdir %>/css/vendors/ui-grid.css",
                        "<%= assetsdir %>/css/main.css",
                        "<%= assetsdir %>/css/_*.css"
                    ]
                }
            }
        }
    };
};
