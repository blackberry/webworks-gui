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
var IconSplashListView,
    viewTemplate = {},
    server = require("../server"),
    IconDisplayView = require("./iconDisplay");

function deleteIconOrSplash(config, source, type, display) {
    var indexToDelete = -1,
        removed;

    config.widget[type].forEach(function (obj) {
        if (obj.src === source) {
            indexToDelete = config.widget[type].indexOf(obj);
        }
    });

    if (indexToDelete !== -1) {
        removed = config.widget[type].splice(indexToDelete, 1);

        if (type === "icon") {
            display.trigger("remove", config.widget.icon);
        }
    }
}

function updateIconOrSplash(config, source, type, display) {
    config.widget[type] = config.widget[type] || [];
    var newObj = true;

    config.widget[type].forEach(function (obj) {
        if (obj.src === source) {
            newObj = false;
        }
    });

    if (newObj) {
        config.widget[type].push({
            src: source
        });

        if (type === "icon") {
            display.trigger("add", config.widget.icon);
        }
    }
}

IconSplashListView = Backbone.View.extend({
    initialize: function (options) {
        var page = "pages/";

        this.options = options;

        if (this.options.type === "icon") {
            page += "icon.html";
        } else {
            page += "splash.html";
        }

        // Find the template and save it
        $.get(page, function (data) {
            viewTemplate[options.type] = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(viewTemplate[this.options.type], {
            widget: this.model.get("config").widget,
            location: this.model.get("location")
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);

        if (this.options.type === "icon") {
            this.iconDisplay.render();
        }
    },
    events: {
        "click #addIconBtn" : "addToConfig",
        "click .icon-delete-btn" : "removeFromConfig",
        "click #addSplashBtn" : "addToConfig",
        "click .splash-delete-btn" : "removeFromConfig"
    },
    display: function (model) {
        this.model = model;

        if (this.options.type === "icon") {
            this.iconDisplay = new IconDisplayView({
                widget: this.model.get("config").widget,
                location: this.model.get("location")
            });
            this.iconDisplay.setElement($("#iconDisplay"));
        }

        this.render();
    },
    addToConfig: function (event) {
        var config = this.model.get("config"),
            isIcon = this.options.type === "icon",
            filePath = isIcon ? $("#newSource").val() : $("#newSplashSource").val(),
            that = this;

        if (filePath.length === 0) {
            return;
        }

        server.resourceExists({
            path: this.model.get("location"),
            filePath: filePath
        }, function (response) {
            if (response.exists) {
                updateIconOrSplash(config, response.normalizedPath, that.options.type, that.iconDisplay);

                if (isIcon) {
                    server.previewImage({
                        path: that.model.get("location"),
                        filePath: filePath
                    }, function (response) {
                        that.model.set("config", config);
                        that.render();
                    });
                } else {
                    that.model.set("config", config);
                    that.render();
                }

                window.views.projectInfo.dirty = true;
            } else {
                alert("Invalid path");
            }
        });
    },
    removeFromConfig: function (event) {
        var config = this.model.get("config");

        deleteIconOrSplash(config, event.currentTarget.dataset.src, this.options.type, this.iconDisplay);
        this.model.set("config", config);
        window.views.projectInfo.dirty = true;
        this.render();
    }
});

module.exports = IconSplashListView;
