/*jslint node: true */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jslint: {
            dist: {
                src: "src/**/*.js"
            }
        },

        uglify: {
            dist: {
                options: {
                    preserveComments: "some"
                },
                files: {
                    "dist/jquery.boxgrid.min.js": "src/jquery.boxgrid.js"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-jslint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["jslint", "uglify"]);
};
