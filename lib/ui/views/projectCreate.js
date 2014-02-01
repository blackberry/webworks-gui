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
var ProjectCreateView,
    projectCreateTemplate;

ProjectCreateView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        projectCreateTemplate = $("#project_create_template");

        this.listenTo(this.collection, "add", this.render.bind(this));
    },
    render: function () {
        var view = this;

        this.collection.getDefaultProjectPath(function (response) {
            // Use the template to create the html to display
            var template = _.template(projectCreateTemplate.html(), {
                defaultName: response.name,
                defaultPath: response.path
            });

            // Put the new html inside of the assigned element
            view.$el.html(template);
        });
    },
    events: {
        // When "click" event happens on #btnCreateProject, run createProject function
        "click #btnCreateProject" : "createProject"
    },
    // Custom function: Creates a new project and adds to the project list
    createProject: function () {
        this.collection.createProjectOnDisk({
            name: $("#txtProjectName").val(),
            location: $("#txtProjectPath").val()
        }, function (response, model) {
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stdout || response.stderr);
            } else {
                window.views.projectInfo.display(model);
            }
        });
        window.views.dialogBox.display({body: "Creating..."});
    }
});

module.exports = ProjectCreateView;
