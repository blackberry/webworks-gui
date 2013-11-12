var ProjectInfoView,
    projectInfoTemplate,
    AccessListView = require("./accessList");

function updatePref(config, name, value) {
    var newPref = true,
        valueMap = {
            "on": "true",
            "off": "false"
        };

    // Use value in the map if it exists
    value = valueMap[value] || value;

    config.widget.preference.forEach(function (pref) {
        if (pref.name === name) {
            pref.value = value;
            newPref = false;
        }
    });

    if (newPref) {
        config.widget.preference.push({
            name: name,
            value: value
        });
    }
}

function preparePrefs(config) {
    // Set default values
    var prefs = {
            appBackgroundColor: "#FFFFFF",
            autoHideSplashScreen: "true",
            orientation: "default",
            childBrowser: "true",
            hideKeyboardFormBar: "false",
            popupBlocker: "false",
            webSecurity: "true"
        };

    config.widget.preference.forEach(function (pref) {
        if (pref.name === "BackgroundColor") {
            prefs.appBackgroundColor = "#" + pref.value.substring(4);
        } else if (pref.name === "AutoHideSplashScreen") {
            prefs.autoHideSplashScreen = pref.value;
        } else if (pref.name === "Orientation") {
            prefs.orientation = pref.value;
        } else if (pref.name === "ChildBrowser") {
            prefs.childBrowser = pref.value;
        } else if (pref.name === "HideKeyboardFormAccesoryBar") {
            prefs.hideKeyboardFormBar = pref.value;
        } else if (pref.name === "PopupBlocker") {
            prefs.popupBlocker = pref.value;
        } else if (pref.name === "WebSecurity") {
            prefs.webSecurity = pref.value;
        }
    });

    return prefs;
}

function renderSubviews(model) {
    // Access list
    window.views.accessList.setElement($("#accessList"));
    window.views.accessList.display(model);
}

ProjectInfoView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/info.html", function (data) {
            projectInfoTemplate = data;
        });

        window.views.accessList = new AccessListView();
    },
    render: function () {
        // Use the template to create the html to display
        var view = this;

        // Put the new html inside of the assigned element
        this.model.getConfigXml(function (config) {
            // Set the models
            view.model.set("config", config);

            // Add location, just for the view
            var template = _.template(projectInfoTemplate, {
                widget: config.widget,
                location: view.model.get("location"),
                prefs: preparePrefs(config)
            });
            view.$el.html(template);

            // Handle access list
            renderSubviews(view.model);
        });
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    events: {
        "change input" : "updateConfig",
        "change select" : "updateConfig",
        "click #saveConfig" : "saveConfigToServer"
    },
    updateConfig: function (event) {
        var element = $(event.currentTarget)[0],
            type = element.getAttribute("name"),
            config = this.model.get("config");

        if (type === "appName") {
            config.widget.name.$t = element.value;
        } else if (type === "appDescription") {
            config.widget.description.$t = element.value;
        } else if (type === "author") {
            config.widget.author.$t = element.value;
        } else if (type === "authorEmail") {
            config.widget.author.email = element.value;
        } else if (type === "authorUrl") {
            config.widget.author.href = element.value;
        } else if (type === "appBackgroundColor") {
            updatePref(config, "BackgroundColor", "0xff" + element.value.substring(1));
        } else if (type === "license") {
            if (!config.widget.license) {
                config.widget.license = {};
            }
            config.widget.license.href = element.value;
        } else if (type === "mainUrl") {
            if (!config.widget.content) {
                config.widget.content = {};
            }
            config.widget.content.src = element.value;
        } else if (type === "autohideSplash") {
            updatePref(config, "AutoHideSplashScreen", element.checked.toString());
        } else if (type === "childBrowser") {
            updatePref(config, "ChildBrowser", element.checked.toString());
        } else if (type === "hideKeyboardFormBar") {
            updatePref(config, "HideKeyboardFormAccessoryBar", element.checked.toString());
        } else if (type === "orientation") {
            updatePref(config, "Orientation", element.value);
        } else if (type === "popupBlocker") {
            updatePref(config, "PopupBlocker", element.checked.toString());
        } else if (type === "webSecurity") {
            updatePref(config, "WebSecurity", element.checked.toString());
        }

        // Save to model
        this.model.set("config", config);
    },
    saveConfigToServer: function () {
        this.model.setConfigXml(function (result) {
            alert(result.success ? "Successfully saved" : result.error);
        });
    }
});

module.exports = ProjectInfoView;
