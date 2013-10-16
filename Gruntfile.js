/*
 * Copyright 2013 BlackBerry Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                "Gruntfile.js",
                "bin/lib/*.js",
                "test/unit/*.js",
                "lib/ui"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        jasmine_node: {
            specNameMatcher: "spec", // load only specs containing specNameMatcher
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                useDotNotation: true,
                consolidate: true
            }
        },
        requirejs: {
            compile: {
                // Available options can be found here
                // https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: "./",
                    paths: {},
                    optimize: "none",
                    generateSourceMaps: false,
                    logLevel: 3,
                    preserveLicenseComments: false,
                    onBuildRead: function (moduleName, path, contents) {
                        var wrappedContents = "define(function (require, exports, module) {\n" + contents + "});\n";
                        return moduleName === "node_modules/almond/almond" ? contents : wrappedContents;
                    },
                    name: "node_modules/almond/almond",
                    include: ["./lib/ui/main"],
                    insertRequire: ["./lib/ui/main"],
                    out: "public/js/webworks-ui.js",
                    wrap: true
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jasmine-node");
    grunt.loadNpmTasks("grunt-contrib-requirejs");

    grunt.registerTask("lint", ["jshint"]);
    grunt.registerTask("test", ["lint", "jasmine_node"]);
    grunt.registerTask("build", ["test", "requirejs"]);

    grunt.registerTask("default", ["build"]);
};
