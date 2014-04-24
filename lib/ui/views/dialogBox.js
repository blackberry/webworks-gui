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
var DialogBoxView,
    dialogBoxTemplate;

DialogBoxView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/dialogBox.html", function (data) {
            dialogBoxTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(dialogBoxTemplate, {
            title: this.model.get("title") || "&nbsp;",
            body: this.model.get("body"),
            buttons: this.model.get("buttons")
        });
        this.$el.html(template);
    },
    display: function (model) {
        if (model instanceof Backbone.Model) {
            this.model = model;
        } else {
            this.model.set("title", model.title);
            this.model.set("body", model.body);
            this.model.set("buttons", model.buttons);
        }
        this.$el.show();
        this.render();
    },
    hide: function () {
        this.$el.hide();
    },
    events: {
    }
});

module.exports = DialogBoxView;
