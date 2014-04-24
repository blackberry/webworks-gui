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
var ProxyNotificationView,
    viewTemplate = {};

ProxyNotificationView = Backbone.View.extend({
    initialize: function () {
        var page = "pages/proxyNotification.html";

        // Find the template and save it
        $.get(page, function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        var view = this;

        this.model.getProxyInfo(function (info) {
            // Use the template to create the html to display
            var template = _.template(viewTemplate, {
                proxyInfo: info
            });

            // Put the new html inside of the assigned element
            view.$el.html(template);
        });
    },
    events: {
        "click .update-btn" : "updatePlatform"
    },
    display: function (model) {
        this.model = model;
        this.render();
    }
});

module.exports = ProxyNotificationView;
