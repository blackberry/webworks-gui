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
var SigningConfig,
    server = require("../server");

SigningConfig  = Backbone.Model.extend({
    sync: function (method, model, options) {
    },
    getState: function (options, callback) {
        server.certificate({
            cmd: "state"
        }, callback, callback);
    },
    addSigningKey: function (options, callback) {
        server.certificate({
            cmd: "add",
            path: options.bbidTokenPath
        }, callback, callback);
    },
    linkSigningKeys: function (options, callback) {
        server.certificate({
            cmd: "linkSigningKeys",
            path: options.bbidTokenPath,
            barSignerPass: options.barSignerPass,
            bbidTokenPass: options.bbidTokenPass
        }, callback, callback);
    },
    createDevCert: function (options, callback) {
        server.certificate({
            cmd: "createDevCert",
            keystorePass: options.keystorePass,
            companyName: options.companyName
        }, callback, callback);
    }
});

module.exports = SigningConfig;
