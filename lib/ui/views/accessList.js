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
var AccessListView,
    viewTemplate;

function deleteAccess(config, origin) {
    var indexToDelete = -1;
    config.widget.access.forEach(function (access) {
        if (access.origin === origin) {
            indexToDelete = config.widget.access.indexOf(access);
        }
    });

    if (indexToDelete !== -1) {
        config.widget.access.splice(indexToDelete, 1);
    }
}

function updateAccess(config, origin, subdomains) {
    config.widget.access = config.widget.access || [];
    var newAccess = true;

    config.widget.access.forEach(function (access) {
        if (access.origin === origin) {
            access.subdomains = subdomains;
            newAccess = false;
        }
    });

    if (newAccess) {
        config.widget.access.push({
            origin: origin,
            subdomains: subdomains
        });
    }
}

AccessListView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/accessList.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(viewTemplate, {
            widget: this.model.get("config").widget
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    },
    events: {
        "click #addAccessBtn" : "addAccessToConfig",
        "click .access-delete-btn" : "removeAccessFromConfig"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    addAccessToConfig: function (event) {
        if (!this.validate()) {
            return false;
        }

        var origin = $("#newOriginInput").val(),
            subdomains = $("#newOriginSubdomains")[0].checked.toString(),
            config = this.model.get("config");

        updateAccess(config, origin, subdomains);
        this.model.set("config", config);
        window.views.projectInfo.dirty = true;
        this.render();
    },
    removeAccessFromConfig: function (event) {
        var origin = event.currentTarget.getAttribute("data-origin"),
            config = this.model.get("config");

        deleteAccess(config, origin);
        this.model.set("config", config);
        window.views.projectInfo.dirty = true;
        this.render();
    },
    validate: function () {
        var validator = $("#f-new-origin-entry").parsley();
        validator.validate();
        return validator.isValid();
    }
});

module.exports = AccessListView;
