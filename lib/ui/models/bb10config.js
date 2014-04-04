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
var BB10Config,
    server = require("../server");

BB10Config = Backbone.Model.extend({
    getBB10Config: function (callback) {
        var model = this;

        server.getBB10Config({}, function (response) {
            model.set("bb10config", response.config);
            callback(response);
        }, callback);
    },
    setBB10Config: function (callback) {
        server.setBB10Config(
            this.get("bb10config"),
            callback,
            callback
        );
    }
});

module.exports = BB10Config;
