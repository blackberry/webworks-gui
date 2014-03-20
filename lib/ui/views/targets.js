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
var TargetListView,
    viewTemplate,
    targetNamesList;


TargetListView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/targetList.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        var view = this;

        // Use the template to create the html to display
        this.model.getTargetConfig(function (response) {
            var template;

            if (!response.error) {
                targetNamesList = Object.keys(response.config.targets);
                template = _.template(viewTemplate, {
                    targetNamesList = targetNamesList,
                    widget: view.model.get("config").widget
                });

                // Put the new html inside of the assigned element
                view.$el.html(template);
            } else {
                alert(
            }
        });

        this.model.getPlugins(function (pluginsList) {
            var template = _.template(viewTemplate, {
                pluginsList: pluginsList,
                widget: view.model.get("config").widget
            });

            // Put the new html inside of the assigned element
            view.$el.html(template);
        });
    },/*
    events: {
        "click #addPluginBtn" : "addFeatureToConfig",
        "click .access-delete-btn" : "removeFeatureFromConfig"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },*/
    addFeatureToConfig: function (event) {
        var view = this,
            name = $("#newFeatureInput").val();

        /*
        if (!this.validate()) {
            return false;
        }*/

        window.views.dialogBox.display({body: "Adding plugin..."});
        this.model.addPlugin({name: name}, function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },
    removeFeatureFromConfig: function (event) {
        var view = this,
            name = event.currentTarget.getAttribute("data-name");

        window.views.dialogBox.display({body: "Removing plugin..."});
        this.model.removePlugin({name: name}, function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    }/*
    validate: function () {
        var validator = $("#f-new-plugin-entry").parsley();
        validator.validate();
        return validator.isValid();
    }*/
});

module.exports = TargetListView;
