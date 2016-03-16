module.exports = function(grunt) {
    return {
        watch: {
            serverWatch: {
                files: [
                    "<%= serverdir %>/**/*.js"
                ],
                tasks: ["buildserver"]
            },
            jsWatch: {
                files: [
                    "<%= appdir %>/**/*.js"
                ],
                tasks: ["buildclient"],
            },
            htmlWatch: {
                files: [
                    "<%= appdir %>/**/*.html"
                ],
                tasks: ["ngtemplates", "karma"],
            },
            cssWatch: {
                files: [
                    "<%= assetsdir %>/css/**/*.css",
                    //"!<%= assetsdir %>/css/generated/*.css"
                ],
                tasks: ["cssmin"],
            },
            assetsWatch: {
                files: ["<%= assetsdir %>/images/**"],
                tasks: ["copy:assetsToDist"]
            },
            onTestFilesChange: {
                files: [
                    "<%= testdir %>/**/*.js"
                ],
                tasks: ["karma"]
            }

        }
    };
};
