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
var IconDisplayView,
    viewTemplate;

IconDisplayView = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.on("add", this.render);
        this.on("remove", this.render);

        this.render();
    },
    render: function () {
        if (!viewTemplate) {
            var that = this;

            // Find the template and save it
            $.get("pages/icon_display.html", function (data) {
                viewTemplate = data;
                that.updateDisplay();
            });
        } else {
            this.updateDisplay();
        }
    },
    updateDisplay: function () {
        // Use the template to create the html to display
        var options = this.options,
            template = _.template(viewTemplate, {
                widget: options.widget,
                location: options.location
            });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    }
});

module.exports = IconDisplayView;
