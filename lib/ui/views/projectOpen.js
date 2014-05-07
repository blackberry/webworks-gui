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
var ProjectOpenView,
    viewTemplate,
    server = require("../server"),
    Project = require("../models/project");

ProjectOpenView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/project_open.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        this.$el.html(viewTemplate);
    },
    events: {
        "click #btnOpenProject" : "openProject",
        "submit form" : "handleSubmit"
    },
    openProject: function () {
        var projectPath = $("#txtProjectPath").val(),
            view = this,
            existingModel;

        if (projectPath.length !== 0) {
            // check if path points to a project already in project list
            existingModel = this.collection.findWhere({
                location: projectPath
            });

            // if found, go directly to project info view
            if (existingModel) {
                window.views.projectInfo.display(existingModel);
            } else {
                server.validateProject({
                    path: projectPath
                }, function (response) {
                    if (response.isValid) {
                        server.getProjectConfig({
                            path: projectPath
                        }, function (res) {
                            var projectId,
                                newModel,
                                modelValues;
                            try {
                                projectId = res.configFile.widget.id;
                                modelValues = {
                                    projectId: projectId,
                                    location: projectPath
                                };
                                newModel = view.collection.createProject(modelValues);

                                // Handle icon hosting, if needed
                                newModel.set("config", res.configFile);
                                newModel.hostIconImages();

                                window.views.projectInfo.display(newModel);
                            } catch (e) {
                                alert(e);
                            }
                        }, function (error) {
                            alert(error.error);
                        });
                    } else {
                        alert("Invalid project");
                    }
                });
            }
        }
    },
    handleSubmit: function () {
        return false;
    }
});

module.exports = ProjectOpenView;
