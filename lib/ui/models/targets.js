/*
 * Copyright 2014 BlackBerry Ltd.
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
var Targets,
    server = require("../server");

Targets = Backbone.Model.extend({
    sync: function (method, model, options) {
    },
    getTargetList: function (callback) {
        server.targets({
            cmd: ""
        }, function (response) {
            callback(response.stdout);
        }, callback);
    },
    addTarget: function (options, callback) {
        server.targets({
            cmd: "add",
            args: options.args
        }, callback, callback);
    },
    removeTarget: function (options, callback) {
        server.targets({
            cmd: "remove",
            args: options.args
        }, callback, callback);
    }
});

module.exports = Targets;
