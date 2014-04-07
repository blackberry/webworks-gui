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
var TargetListView,
    viewTemplate,
    configOrFieldSetter;

configOrFieldSetter = function (bb10config, targetName, action) {
    var targetProperties = ["Ip", "Password", "Pin", "Type"],
        selectorValue,
        configValue;

    targetProperties.forEach(function (element) {
        if (action === "config") {
            // save the contents in target fields to the config
            selectorValue = $("#newTarget" + element).val();

            bb10config.targets[targetName] = bb10config.targets[targetName] || {};

            if (selectorValue) {
                bb10config.targets[targetName][element.toLowerCase()] = selectorValue;
                // toLowerCase needed to match the lowercase properties in the targets object
            } else {
                // error handling may need to be added here for missing target props
            }
        } else if (action === "field") {
            // fill in the target fields with selected target
            configValue = bb10config.targets[targetName][element.toLowerCase()];

            if (configValue) {
                $("#newTarget" + element).val(configValue);
            } else {
                // error handling if needed when configValue DNE
            }

            if (element === "Type") {
                if (configValue === "simulator") {
                    configValue = "emulator";    
                }
                $("#newTargetType select").val(configValue);
            }
        }
    });

    return bb10config;
};

TargetListView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/targets.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        var view = this,
            targetNamesList,
            template;

        // Use the template to create the html to display
        this.model.getBB10Config(function (response) {

            if (!response.error) {
                targetNamesList = Object.keys(response.config.targets);

                template = _.template(viewTemplate, {
                        targetNamesList: targetNamesList
                    });

                // Put the new html inside of the assigned element
                view.$el.html(template);
            } else {
                alert("put error here");
            }
        });
    },
    events: {
        "click #editTargetConfigBtn" : "editTargetConfig",
        "click .target-edit-btn" : "fillInputTargetFields",
        "click .target-delete-btn" : "removeTargetFromConfig"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    editTargetConfig: function (event) {
        var view = this,
            bb10config = this.model.get("bb10config"),
            name = $("#newTargetName").val();

        this.model.set("bb10config", configOrFieldSetter(bb10config, name, "config"));

        if (!this.validate()) {
            return false;
        }

        window.views.dialogBox.display({body: "Adding target..."});
        this.model.setBB10Config(function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },
    fillInputTargetFields: function (event) {
        var view = this,
            bb10config = this.model.get("bb10config"),
            name = event.currentTarget.getAttribute("data-name");

        configOrFieldSetter(bb10config, name, "field");

        $("#newTargetName").val(name);
        // render field to bring page down to the edit fields?
    },
    removeTargetFromConfig: function (event) {
        var view = this,
            name = event.currentTarget.getAttribute("data-name"),
            bb10config = this.model.get("bb10config");

        delete bb10config.targets[name];

        this.model.set("bb10config", bb10config);

        window.views.dialogBox.display({body: "Removing target..."});
        this.model.setBB10Config(function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },
    validate: function () {
        var validator = $("#f-new-target-entry").parsley();
        validator.validate();
        return validator.isValid();
    }
});

module.exports = TargetListView;
