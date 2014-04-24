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
var View,
    viewTemplate,
    proxiedApps = [
        "blackberry-signer",
        "blackberry-debugtokenrequest"
    ];

View = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/globalSettings.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        var view = this;
        // Use the template to create the html to display
        this.model.getBB10Config(function (response) {

            if (!response.error) {
                var template,
                    settings = {
                        "host": {},
                        "port": {},
                        "username": {},
                        "password": {}
                    },
                    signerOptions,
                    devCertPath,
                    bbidTokenPath;

                proxiedApps.forEach(function (app) {
                    var appsettings = response.config[app];
                    if (!appsettings) {
                        return;
                    }
                    Object.keys(settings).forEach(function (p) {
                        var dashp = '-proxy' + p,
                            k,
                            v;
                        if (!appsettings.hasOwnProperty(dashp)) {
                            return;
                        }
                        k = appsettings[dashp];
                        v = settings[p][k] || 0;
                        settings[p][k] = v + 1;
                    });
                });
                Object.keys(settings).forEach(function (p) {
                    var value = settings[p],
                        valuemap = [['', 0]];
                    Object.keys(value).forEach(function (cand) {
                        valuemap.push([cand, value[cand]]);
                    });
                    settings[p] = valuemap.sort(function (a, b) { return b[1] - a[1]; })[0][0];
                });

                // Handle dev cert location
                signerOptions = response.config["blackberry-signer"] || {};
                devCertPath = signerOptions["-keystore"] || "";
                bbidTokenPath = signerOptions["-bbidtoken"] || "";

                template = _.template(viewTemplate, {
                    proxy: settings,
                    devCertPath: devCertPath,
                    bbidTokenPath: bbidTokenPath
                });

                // Put the new html inside of the assigned element
                view.$el.html(template);
            } else {
                alert("put error here");
            }
        });
    },
    events: {
        "click #saveGlobalSettings" : "saveGlobalSettings"
    },
    saveGlobalSettings: function (event) {
        var view = this,
            settings = {
                host: $("#proxyhost").val(),
                port: $("#proxyport").val(),
                username: $("#proxyuser").val(),
                password: $("#proxypass").val()
            },
            devCertPath = $("#devCertOverridePath").val(),
            bbidTokenPath = $("#bbidTokenOverridePath").val(),
            config = this.model.get("bb10config");

        proxiedApps.forEach(function (app) {
            var appsettings = config[app] || {};
            Object.keys(settings).forEach(function (p) {
                var dashp = '-proxy' + p;
                if (settings[p] === '') {
                    delete appsettings[dashp];
                } else {
                    appsettings[dashp] = settings[p];
                }
            });
            if (Object.keys(appsettings)) {
                config[app] = appsettings;
            } else {
                delete config[app];
            }
        });

        // Set dev cert path if required
        config["blackberry-signer"] = config["blackberry-signer"] || {};
        config["blackberry-signer"]["-keystore"] = devCertPath || "";
        if (config["blackberry-signer"]["-keystore"] === "") {
            delete config["blackberry-signer"]["-keystore"];
        }

        // Set bbid token path if required
        config["blackberry-signer"] = config["blackberry-signer"] || {};
        config["blackberry-signer"]["-bbidtoken"] = bbidTokenPath || "";
        if (config["blackberry-signer"]["-bbidtoken"] === "") {
            delete config["blackberry-signer"]["-bbidtoken"];
        }

        this.model.setBB10Config(function (output) {
            window.views.dialogBox.hide();
            if (!output.success) {
                alert(output.stderr || output.stdout);
            } else {
                alert("Successfully saved");
            }
            view.render();
        });

        // Display dialog
        window.views.dialogBox.display({body: "Updating global settings..."});
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
});

module.exports = View;
