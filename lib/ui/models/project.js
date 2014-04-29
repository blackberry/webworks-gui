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
var Project,
    server = require("../server"),
    storage = require("../storage");

Project = Backbone.Model.extend({
    initialize: function () {
        var that = this;
        this.on("change:buildSettings", this.saveChanges);
        server.project({
            cmd: "version",
            path: this.get("location"),
            args: []
        }, function (result) {
            if (result) {
                that.version = parseFloat(result.stdout);
            }
        });
    },
    saveChanges: function () {
        this.sync("update");
    },
    updateTimestamp: function () {
        this.sync("timestamp");
    },
    sync: function (method, model, options) {
        var projects = storage.readProjects(),
            id = this.get("location");

        switch (method) {
        case "update":
            projects[id] = this.toJSON();
            break;
        case "create":
            projects[id] = this.toJSON();
            break;
        case "delete":
            delete projects[id];
            break;
        case "timestamp":
            projects[id].timestamp = new Date();
            this.set("timestamp", projects[id].timestamp);
            break;
        }

        storage.saveProjects(projects);
    },
    getConfigXml: function (callback) {
        var model = this;
        server.getProjectConfig({
            path: this.get("location")
        }, function (response) {
            model.set("config", response.configFile);
            callback(response.configFile);
        }, callback);
    },
    setConfigXml: function (callback) {
        server.setProjectConfig({
            path: this.get("location"),
            data: this.get("config")
        }, callback, callback);
    },
    getPlugins: function (callback) {
        server.plugins({
            cmd: "list",
            path: this.get("location")
        }, function (response) {
            callback(response.stdout);
        }, function (response) {
            alert("Error code: " + response.code);
        });
    },
    addPlugin: function (options, callback) {
        server.plugins({
            cmd: "add",
            path: this.get("location"),
            args: options.name
        }, callback, callback);
    },
    removePlugin: function (options, callback) {
        server.plugins({
            cmd: "remove",
            path: this.get("location"),
            args: options.name
        }, callback, callback);
    },
    install: function (options, callback) {
        if (!options.device) {
            options.debug = true;
            options.keystorepass = false;
        }

        server.project({
            cmd: "run",
            path: this.get("location"),
            args: [
                this.version && this.version >= 3.5 ? "--no-query" : "",
                options.device ? "" : "--emulator",
                options.debug ? "" : "--release",
                options.targetName === "autodetect" ? "" : "--target " + options.targetName,
                options.devicePassword ? "--devicepass" : "",
                options.devicePassword,
                options.keystorePassword ? "--keystorepass" : "",
                options.keystorePassword
            ].join(" ")
        }, callback, callback);
    },
    installSkipBuild: function (options, callback) {
        if (!options.device) {
            options.debug = true;
            options.keystorepass = false;
        }

        server.project({
            cmd: "run",
            path: this.get("location"),
            args: [
                this.version && this.version >= 3.5 ? "--no-query" : "",
                options.device ? "" : "--emulator",
                options.debug ? "" : "--release",
                options.targetName === "autodetect" ? "" : "--target " + options.targetName,
                options.devicePassword ? "--devicepass" : "",
                options.devicePassword,
                options.keystorePassword ? "--keystorepass" : "",
                options.keystorePassword,
                "--no-build"
            ].join(" ")
        }, callback, callback);
    },
    build: function (options, callback) {
        server.project({
            cmd: "build",
            path: this.get("location"),
            args: [
                this.version && this.version >= 3.5 ? "--no-query" : "",
                options.debug ? "--debug" : "--release",
                options.keystorePassword ? "--keystorepass" : "",
                options.keystorePassword
            ].join(" ")
        }, callback, callback);
    },
    checkExistence: function (callback) {
        var handler = function (response) {
            callback(response.error ? false : true);
        };
        this.getConfigXml(handler);
    },
    getPasswords: function () {
        return storage.readPasswords()[this.get("location")] || {
            devicePassword: "",
            keystorePassword: ""
        };
    },
    setPasswords: function (projectPasswords) {
        var passwords = storage.readPasswords();
        passwords[this.get("location")] = projectPasswords;
        storage.savePasswords(passwords);
    },
    hostIconImages: function () {
        var model = this,
            iconList = this.get("config").widget.icon || [];

        iconList.forEach(function (icon) {
            server.previewImage({
                path: model.get("location"),
                filePath: icon.src
            });
        });
    },
    getBB10Config: function (callback) {
        var model = this;

        server.getBB10Config({}, function (response) {
            model.set("bb10config", response.config);
            callback(response);
        }, callback);
    },
    targetFilter: function (device, callback) {
        var newTargetList = {},
            filter = function (response) {
                for (var target in response.config.targets) {
                    if (!device) {
                        if (response.config.targets[target].type === "simulator" || response.config.targets[target].type === "emulator") {
                            newTargetList[target] = response.config.targets[target];
                        }
                    } else {
                        if (response.config.targets[target].type === "device") {
                            newTargetList[target] = response.config.targets[target];
                        }
                    }
                }
                callback(newTargetList);
            };

        this.getBB10Config(filter);
    }
});

module.exports = Project;
// Sample usage:
// var p = new Project({
//        name: "Project Name",
//        location: "/path/to/place"
//      });
