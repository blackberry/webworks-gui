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
var UpdatesListView,
    viewTemplate = {},
    server = require("../server");

UpdatesListView = Backbone.View.extend({
    initialize: function (options) {
        var page = "pages/updates.html";

        this.options = options;

        // Find the template and save it
        $.get(page, function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(viewTemplate, {
            updates: this.model.get("updates")
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    },
    events: {
        "click .update-btn" : "updatePlatform"
    },
    display: function (model) {
        this.model = model;
        var self = this;
        function callback(data) {
            var updates = data.stdout.split("\n").map(function (message) {
                var p = message.split(" @");
                if (p.length !== 2)
                    return;
                return p[0];
            }).filter(function (p) { return p; });
            model.set("updates", updates);
            self.render();
        }
        server.platform({cmd: 'check', path: this.model.get("location")}, callback, callback);
    },
    updatePlatform: function (event) {
        var model = this.model,
            updates = model.get("updates"),
            self = this,
            platform = event.target.getAttribute("data-src");
        function callback(e) {
            window.views.dialogBox.hide();
            self.display(model);
            if (!e.success) {
                alert(e.stderr);
            }
        }

        window.views.dialogBox.display({body: "Updating..."});
        server.platform({cmd: 'update', path: this.model.get("location"), args: [platform]}, callback, callback);
        updates = updates.filter(function (p) {
            return p !== platform;
        });
        this.model.set("updates", updates);
        this.render();
    }
});

module.exports = UpdatesListView;
