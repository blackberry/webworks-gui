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
        this.collection = this.collection.sort();
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

    setActiveProject: function (event) {
        this.restoreBackgroundColor();
        var className = $(event.target).attr('class');
        var target;
        //get className of element clicked to avoid change color of projectName text
        if (className == "project-name-info") {
            target = $(event.target).parent();
        } else {
            target = $(event.target);
        }

        $(target).siblings('ul').hide();
        $(target).next('ul').show();
        $(target).find('.arrow-right-list-project').css("display", "none");
        $(target).find('.arrow-down-list-project').css("display", "block");

        // set all project items to default background
        $(target).parent().find('.project-list').css("background", "#efefef");

        this.changeProjectButtonItem($("#info" + event.target.getAttribute("data-cid")));

        this.showProjectInfo(event);

         currentProjectId = event.target.getAttribute("data-cid");

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
