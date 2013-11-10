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
        express: {
            options: {
            },
            integration: {
                options: {
                    script: grunt.option("ww") + "/webworks-ui-test/lib/start-api.js"
                }
            }
        },
        jshint: {
            all: [
                "Gruntfile.js",
                "bin/lib/*.js",
                "test/unit/*.js",
                "test/integration/*.js",
                "lib/ui"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        jasmine_node: {
            specNameMatcher: grunt.option("test") === "integration" ? "int" : "spec",
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                useDotNotation: true,
                consolidate: true
            },
            verbose: true
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
        },
        copy: {
            webworksui: {
                expand: true,
                src: ["bin/*", "lib/*", "routes/*", "config.json", "package.json"],
                dest: grunt.option("ww") + "/webworks-ui-test",
                options: {
                    mode: true
                }
            },
            restapi: {
                files: [
                    {
                        src: ["test/integration/start-api.js"],
                        dest: grunt.option("ww") + "/webworks-ui-test/lib/start-api.js"
                    },
                    {
                        src: ["test/integration/init-cordova-bb"],
                        dest: grunt.option("ww") + "/webworks-ui-test/bin/init-cordova-bb"
                    },
                    {
                        src: ["test/integration/init-cordova-bb.bat"],
                        dest: grunt.option("ww") + "/webworks-ui-test/bin/init-cordova-bb.bat"
                    }
                ]
            }
        },
        rm: {
            webworksui: {
                dir: grunt.option("ww") + "/webworks-ui-test"
            }
        },
        shell: {
            chmod_startapi: {
                command: "chmod 755 " + grunt.option("ww") + "/webworks-ui-test/bin/start-api"
            },
            npm_install: {
                command: "npm install",
                options: {
                    execOptions: {
                        cwd: grunt.option("ww") + "/webworks-ui-test"
                    }
                }
            },
            initcordovabb: {
                command: "test/integration/webworks-ui/bin/init-cordova-bb"
            }
        },
        json_massager: {
            addww: {
                files: {
                    "config.json": ["config.json"]
                },
                modifier: function (obj) {
                    obj.ww = grunt.option("ww");
                    return obj;
                }
            },
            removeww: {
                files: {
                    "config.json": ["config.json"]
                },
                modifier: function (obj) {
                    delete obj.ww;
                    return obj;
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jasmine-node");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-rm");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-express-server");
    grunt.loadNpmTasks("grunt-json-massager");

    grunt.registerTask("lint", ["jshint"]);
    grunt.registerTask("test", ["lint", "jasmine_node"]);
    grunt.registerTask("build", ["test", "requirejs"]);

    grunt.registerTask("default", ["build"]);

    grunt.registerTask("integration-test", ["lint", "copy", "shell:chmod_startapi", "shell:npm_install", "shell:initcordovabb", "json_massager:addww", "express:integration", "jasmine_node", "json_massager:removeww", "rm"]);
};
