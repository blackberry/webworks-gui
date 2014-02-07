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
    // this.activeProjectCid : String - cid of active project
    // this.activeProjectPanel : String - panel currently active (Config, build, etc)
    initialize: function () {
        this.collection.fetch();
        this.render();

        // Update whenever the model adds, removes, changes
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);
    },
    render: function () {
        // Use the models in the collection to populate the $el element
        this.collection = this.collection.sort();

        // Set active project, default to first project
        var activeProjectCid = this.activeProjectCid || this.collection.length > 0 && this.collection.models[0].cid,
            activeProjectPanel = this.activeProjectPanel || "config",
            template = _.template($('#project_list_template').html(), {
            projects: this.collection.models,
            activeProjectCid: activeProjectCid,
            activeProjectPanel: activeProjectPanel
        });

        this.$el.html(template);
    },
    events: {
        "click .delete-btn" : "removeFromList",
        "click .project-list" : "setActiveProjectOnClick",
        "click .project-button[data-page=info]" : "showProjectInfo",
        "click .project-button[data-page=plugins]" : "showProjectPlugins",
        "click .project-button[data-page=build]" : "showBuildPage",
        "click #certificates" : "showCertificatesPage",
        "click #projectOpen" : "showProjectOpen",
        "click #newProjectBtn" : "showProjectCreate"
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
    showProjectCreate: function (event) {
        window.views.projectCreate.render();
    },
    showProjectInfo: function (event) {
        this.checkUnsavedChanges();
        this.activeProjectPanel = "config";
        var className = $(event.target).attr('class'),
            cid,
            model;

        if (className == "project-button") {
            this.restoreBackgroundColor();
            this.changeProjectButtonItem(event.target);
        }

        cid = event.target.getAttribute("data-cid");
        model = this.collection.get(cid);

        model.updateTimestamp();
        this.render();
        window.views.projectInfo.display(model);
    },
    showProjectPlugins: function (event) {
        this.checkUnsavedChanges();
        this.restoreBackgroundColor();
        this.changeProjectButtonItem(event.target);
        this.activeProjectPanel = "plugins";

        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        model.updateTimestamp();
        this.render();
        window.views.projectPlugins.display(model);
    },
    showBuildPage: function (event) {
        this.checkUnsavedChanges();
        this.restoreBackgroundColor();
        this.changeProjectButtonItem(event.target);
        this.activeProjectPanel = "build";

        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        model.updateTimestamp();
        this.render();
        window.views.projectBuild.display(model);
    },
    showCertificatesPage: function (event) {
        this.checkUnsavedChanges();
        window.views.certificates.render();
    },
    showProjectOpen: function (event) {
        window.views.projectOpen.render();
    },
    checkUnsavedChanges: function () {
        if (window.views.projectInfo.dirty) {
            if (window.confirm("There are unsaved changes on this page. Do you want to save?")) {
                window.views.projectInfo.saveConfigToServer();
            }
        }
    },

    setActiveProjectOnClick: function (event) {
        this.activeProjectCid = event.target.getAttribute("data-cid");
        this.showProjectInfo(event);
    },

    setActiveProject: function (model) {
        this.activeProjectCid = model.cid;
        this.activeProjectPanel = "config";
        this.render();
    },

    restoreBackgroundColor: function () {
        this.toggleArrow();
        $('.project-button').css("background", "#e0dddd");
    },
    toggleArrow: function(){
        $('.arrow-right-list-project').css("display", "block");
        $('.arrow-down-list-project').css("display", "none");
    }
    ,

    changeProjectButtonItem: function (item) {
        $(item).css("background", "#12b2bc");
    },

    //force a click on all projects items to avoid close list
    clickAllProjectListItems: function () {
        $('.project-list').trigger("click");

    }
});

module.exports = ProjectListView;
