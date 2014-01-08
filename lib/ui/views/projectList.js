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
var ProjectListView,
    text = require("../text");

ProjectListView = Backbone.View.extend({
    initialize: function () {
        this.collection.fetch();
        this.render();

        // Update whenever the model adds, removes, changes
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);
        this.listenTo(this.collection, "change", this.render);
    },
    render: function () {
        // Use the models in the collection to populate the $el element
        var template = _.template($('#project_list_template').html(), {
            projects: this.collection.models
        });

        this.$el.html(template);
    },
    events: {
        "click .delete-btn" : "removeFromList",
        "click .project-list" : "setActiveProject",
        "click .project-button[data-page=info]" : "showProjectInfo",
        "click .project-button[data-page=plugins]" : "showProjectPlugins",
        "click .project-button[data-page=build]" : "showBuildPage",
        "click #certificates" : "showCertificatesPage"
    },
    removeFromList: function (event) {
        // Use data-cid attribute to delete the project from the list

        if (confirm(text.PROJECT_DELETE_CONFIRM)) {
            window.views.dialogBox.display({body: "Deleting..."});
            this.collection.deleteProjectFromDisk(event.target.getAttribute("data-cid"), function () {
                window.views.dialogBox.hide();
                window.views.projectCreate.render();
            });
        }
    },
    showProjectInfo: function (event) {
        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        window.views.projectInfo.display(model);
    },
    showProjectPlugins: function (event) {
        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        window.views.projectPlugins.display(model);
    },
    showBuildPage: function (event) {
        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        window.views.projectBuild.display(model);
    },
    showCertificatesPage: function (event) {
        window.views.certificates.render();
    },
    setActiveProject: function (event) {
        this.showProjectInfo(event);
        //this.activeProject = event.target.getAttribute("data-cid");
    }
});

module.exports = ProjectListView;
