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
var View,
    viewTemplate;

View = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/certificates.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        var view = this;
        this.model.getState({}, function (response) {
            // Use the template to create the html to display
            var template = _.template(viewTemplate, {
                barSigner: response.stdout.barSigner,
                bbidToken: response.stdout.bbidToken,
                devCert: response.stdout.devCert
            });

            // Put the new html inside of the assigned element
            view.$el.html(template);
        });
    },
    events: {
        "click #addSigningKey" : "addSigningKey",
        "click #linkSigningKeys" : "linkSigningKeys",
        "click #createDevCert" : "createDevCert",
        "click #downloadNextBtn" : "displayInstall",
        "click #clearSigningKey" : "clearSigningKeyField",
        "click #skipLinkingSigningKeys" : "skipLinkingSigningKeys"
    },
    displayInstall: function (event) {
        $("#certDownloadPanel").addClass("f-valid");
        $("#certInstallPanel").show();
        $("#downloadNextBtn").hide();
        $("#bbidTokenPath").focus();
    },
    clearSigningKeyField: function (event) {
        $("#bbidTokenPath").val("");
        $("#bbidTokenPath").focus();
        $("#clearSigningKey").hide();
        $("#addSigningKey").show();
    },
    skipLinkingSigningKeys: function (event) {
        $("#certLinkPanel").hide();
        $("#certDevCertPanel").show();
        $("#devCert-keystorePass").focus();
    },
    addSigningKey: function (event) {
        var view = this,
            options = {
                bbidTokenPath: $("#bbidTokenPath").val()
            };

        this.model.addSigningKey(options, function (output) {
            window.views.dialogBox.hide();
            if (!output.success) {
                alert(output.stderr || output.stdout);
            } else {
                // Helps the next render() appear less sudden
                $("#certInstallPanel").addClass("f-valid");
                $("#certDevCertPanel").show();
            }
            view.render();
        });

        // Display dialog
        window.views.dialogBox.display({body: "Adding signing key..."});
    },
    linkSigningKeys: function (event) {
        var view = this,
            options = {
                bbidTokenPath: $("#link-bbidTokenPath").val(),
                barSignerPass: $("#link-barSignerPass").val(),
                bbidTokenPass: $("#link-bbidTokenPass").val()
            };

        this.model.linkSigningKeys(options, function (output) {
            window.views.dialogBox.hide();
            if (!output.success) {
                alert(output.stderr || output.stdout);
            } else {
                alert("Signing keys linked");
            }
            view.render();
        });

        // Display dialog
        window.views.dialogBox.display({body: "Linking signing keys..."});
    },
    createDevCert: function (event) {
        var view = this,
            options = {
                keystorePass: $("#devCert-keystorePass").val(),
                companyName: $("#devCert-companyName").val()
            };

        this.model.createDevCert(options, function (output) {
            window.views.dialogBox.hide();
            if (!output.success) {
                alert(output.stderr || output.stdout);
            } else {
                alert("Developer certificate created");
            }
            view.render();
        });

        // Display dialog
        window.views.dialogBox.display({body: "Creating developer certificate..."});
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
});

module.exports = View;
