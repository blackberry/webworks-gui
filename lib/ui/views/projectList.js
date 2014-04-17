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
    text = require("../text"),
    menuButtonElem,
    contentShadingElem,
    leftContentElem;

ProjectListView = Backbone.View.extend({
    // this.activeProjectCid : String - cid of active project
    // this.activeProjectPanel : String - panel currently active (Config, build, etc)
    initialize: function () {
        this.collection.fetch();
        this.render();

        // Update whenever the model adds, removes, changes
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);

        // Track some elements outside of the template
        menuButtonElem = $("#menu-button");
        contentShadingElem = $("#content-shading");
        leftContentElem = $("#left-content");

        // Setup click handlers
        menuButtonElem.on("click", function () {
            leftContentElem.toggleClass("left-content-show");
            menuButtonElem.toggleClass("menu-button-highlight");
            contentShadingElem.toggle();
        });

        contentShadingElem.on("click", function () {
            leftContentElem.removeClass("left-content-show");
            menuButtonElem.removeClass("menu-button-highlight");
            contentShadingElem.hide();
        });

    },
    render: function () {
        // Use the models in the collection to populate the $el element
        this.collection = this.collection.sort();

        // Set active project, default to first project
        var activeProjectCid = this.activeProjectCid,
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
        "click .project-button[data-page=info]" : "handleProjectInfoClick",
        "click .project-button[data-page=plugins]" : "showProjectPlugins",
        "click .project-button[data-page=build]" : "showBuildPage",
        "click #certificates" : "showCertificatesPage",
        "click #targets" : "showTargetsPage",
        "click #globalSettings" : "showGlobalSettingsPage",
        "click #projectOpen" : "showProjectOpen",
        "click #newProjectBtn" : "showProjectCreate"
    },
    hideVisibleMenu: function () {
        $("#left-content").removeClass("left-content-show");
        $("#menu-button").removeClass("menu-button-highlight");
        $("#content-shading").hide();
    },
    removeFromList: function (event) {
        var view = this;
        // Prevent other handlers
        event.stopImmediatePropagation();

        // Use data-cid attribute to delete the project from the list
        // Filesystem delete confirm
        if (confirm(text.PROJECT_FS_DELETE_CONFIRM)) {
            window.views.dialogBox.display({body: "Deleting..."});
            this.collection.deleteProjectFromDisk(event.target.getAttribute("data-cid"), function () {
                window.views.dialogBox.hide();
                window.views.projectCreate.render();
                view.hideVisibleMenu();
            });
        } else {
            this.collection.deleteProjectModel(event.target.getAttribute("data-cid"));
            window.views.projectCreate.render();
            view.hideVisibleMenu();
        }
    },
    showProjectCreate: function (event) {
        this.checkUnsavedChanges();
        this.hideVisibleMenu();
        window.views.projectCreate.display();
    },
    showProjectInfo: function (event) {
        this.checkUnsavedChanges();
        var view = this,
            className = $(event.target).attr('class'),
            cid,
            model;

        if (className === "project-button") {
            this.restoreBackgroundColor();
            this.changeProjectButtonItem(event.target);
        }

        cid = event.target.getAttribute("data-cid");
        model = this.collection.get(cid);

        this.verifyModel(model, function () {
            model.updateTimestamp();
            view.activeProjectPanel = "config";
            view.render();
            window.views.projectInfo.display(model);
        });
    },
    handleProjectInfoClick: function (event) {
        this.hideVisibleMenu(); // Hide only when directly clicked
        this.showProjectInfo(event);
    },
    showProjectPlugins: function (event) {
        this.checkUnsavedChanges();
        this.restoreBackgroundColor();
        this.changeProjectButtonItem(event.target);
        this.hideVisibleMenu();

        var view = this,
            cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        this.verifyModel(model, function () {
            model.updateTimestamp();
            view.activeProjectPanel = "plugins";
            view.render();
            window.views.projectPlugins.display(model);
        });
    },
    showBuildPage: function (event) {
        this.checkUnsavedChanges();
        this.restoreBackgroundColor();
        this.changeProjectButtonItem(event.target);
        this.hideVisibleMenu();

        var view = this,
            cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        this.verifyModel(model, function () {
            model.updateTimestamp();
            view.activeProjectPanel = "build";
            view.render();
            window.views.projectBuild.display(model);
        });
    },
    showCertificatesPage: function (event) {
        this.checkUnsavedChanges();
        this.setActiveProject(undefined);
        this.hideVisibleMenu();
        window.views.certificates.render();
    },
    showTargetsPage: function (event) {
        this.checkUnsavedChanges();
        this.setActiveProject(undefined);
        this.hideVisibleMenu();
        window.views.targets.render();
    },
    showGlobalSettingsPage: function (event) {
        this.checkUnsavedChanges();
        this.setActiveProject(undefined);
        this.hideVisibleMenu();
        window.views.globalSettings.render();
    },
    showProjectOpen: function (event) {
        this.checkUnsavedChanges();
        this.setActiveProject(undefined);
        this.hideVisibleMenu();
        window.views.projectOpen.render();
    },
    checkUnsavedChanges: function () {
        if (window.views.projectInfo.dirty) {
            if (window.confirm("There are unsaved changes on this page. Do you want to save?")) {
                window.views.projectInfo.saveConfigToServer();
            } else {
                // Restore model based on filesystem
                this.collection.get(this.activeProjectCid).getConfigXml(function () {
                    window.views.projectInfo.dirty = false;
                });
            }
        }
    },

    setActiveProjectOnClick: function (event) {
        var view = this,
            cid = event.target.getAttribute("data-cid");

        this.verifyModel(view.collection.get(cid), function () {
            view.activeProjectCid = cid;
            view.showProjectInfo(event);
        });
    },

    setActiveProject: function (model) {
        this.activeProjectCid = model ? model.cid : undefined;
        this.activeProjectPanel = model ? "config" : undefined;
        this.render();
    },

    verifyModel: function (model, successCallback) {
        var view = this,
            collection = this.collection;

        model.checkExistence(function (exists) {
            if (!exists) {
                alert(model.get("projectId") + " cannot be found on the file system and will be removed from the project list");
                collection.deleteProjectModel(model.cid);
                view.showProjectCreate();
            } else if (successCallback) {
                successCallback();
            }
        });
    },

    restoreBackgroundColor: function () {
        this.toggleArrow();
        $('.project-button').css("background", "#e0dddd");
    },
    toggleArrow: function () {
        $('.arrow-right-list-project').css("display", "block");
        $('.arrow-down-list-project').css("display", "none");
    },

    changeProjectButtonItem: function (item) {
        $(item).css("background", "white");
    },

    //force a click on all projects items to avoid close list
    clickAllProjectListItems: function () {
        $('.project-list').trigger("click");

    }
});

module.exports = ProjectListView;
