var ProjectInfoView,
    projectInfoTemplate;

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

function updatePref(config, name, value) {
    var newPref = true;

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
    var prefs = {};

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
            prefs.keyboardFormBar = pref.value;
        } else if (pref.name === "PopupBlocker") {
            prefs.popupBlocker = pref.value;
        } else if (pref.name === "WebSecurity") {
            prefs.webSecurity = pref.value;
        }
    });

    return prefs;
}

ProjectInfoView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/info.html", function (data) {
            projectInfoTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var view = this;

        // Put the new html inside of the assigned element
        this.model.getConfigXml(function (config) {
            // Add location, just for the view
            var template = _.template(projectInfoTemplate, {
                widget: config.widget,
                location: view.model.get("location"),
                prefs: preparePrefs(config)
            });
            view.$el.html(template);
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
            config.widget.content.href = element.value;
        } else if (type === "autohideSplash") {
            updatePref(config, "AutoHideSplashScreen", element.value);
        } else if (type === "childBrowser") {
            updatePref(config, "ChildBrowser", element.value);
        } else if (type === "keyboardFormBar") {
            updatePref(config, "HideKeyboardFormAccessoryBar", element.value);
        } else if (type === "orientation") {
            updatePref(config, "Orientation", element.value);
        } else if (type === "popupBlocker") {
            updatePref(config, "PopupBlocker", element.value);
        } else if (type === "webSecurity") {
            updatePref(config, "WebSecurity", element.value);
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
