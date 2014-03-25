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

configOrFieldSetter = function (action) {
    // sets the target config or input field 
    var targetProperties = ["Ip", "Password", "Pin", "Type"];

//see if action can be determined from event.SOMETHING
// if it can then you can remove the removeTargetFromConfig function and check for the event.SOMETHING in this function
    if (action === "remove") {
        delete targetConfig.targets[name];
    } else {
        targetProperties.forEach(function (element) {
            if (action === "config") {
                var selectorValue = $("#newTarget" + element).val();

                if (selectorValue) {
                    targetConfig.targets[name][element.toLowerCase()] = selectorValue;
                } else {
                    // error handling amy need to be added here for missing target props
                }
            } else if (action === "field") {
               var configValue = targetConfig.targets[name][element.toLowerCase()]; 
            
                if (configValue) {
                    $("#newTarget" + element).DUNNO = configValue; 
          // check this
                } else {
                    // error handling if needed when configValue DNE
                }
            }
        });
    }
} //do i need a semi colon here?

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

            if (!response.error) {
                var targetNamesList = Object.keys(response.config.targets),
                    template = _.template(viewTemplate, {
                        targetNamesList = targetNamesList,
                        widget: view.model.get("config").widget
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
        "click .access-edit-btn" : "fillInputTargetFields",
        "click .access-delete-btn" : "removeTargetFromConfig"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    editTargetConfig: function (event) {
        var view = this,
            name = $("#newTargetName").val(),
            targetConfig = this.model.get("targetConfig");

        /*
        if (!this.validate()) {
            return false;
        }*/

        configOrFieldSetter("config");

        this.model.set("targetConfig", targetConfig);

        window.views.dialogBox.display({body: "Adding target..."});
        this.model.setTargetConfig(function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },
    fillInputTargetFields: function (event) {
        var view = this,
            targetConfig = this.model.get("targetConfig"),
            name = event.currentTarget.getAttribute("data-name");

        // find a way to set current fields
        configOrFieldSetter("field");     
    
        // render field to bring page down to the edit fields?
    },
    removeTargetFromConfig: function (event) {
        var view = this,
            name = event.currentTarget.getAttribute("data-name"),
            targetConfig = this.model.get("targetConfig");

        configOrFieldSetter("remove");
//make sure this isnt asynchronous
        this.model.set("targetConfig", targetConfig);

        window.views.dialogBox.display({body: "Removing target..."});
        this.model.setTargetConfig(function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },/*
    validate: function () {
        var validator = $("#f-new-plugin-entry").parsley();
        validator.validate();
        return validator.isValid();
    }*/
});

module.exports = TargetListView;
