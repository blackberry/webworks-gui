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
var ProjectList,
    Project = require("../models/project"),
    server = require("../server"),
    storage = require("../storage");

ProjectList = Backbone.Collection.extend({
    model: Project,
    initialize: function () {
        var collection = this,
            projects = storage.readProjects(),
            projectId;

        for (projectId in projects) {
            if (projects.hasOwnProperty(projectId)) {
                this.create(projects[projectId]);
            }
        }

    },
    sync: function (method, model, options) {
    },
    deleteProjectModel: function (modelCid) {
        // Remove from collection and destroy model
        var modelToDelete = this.get(modelCid);
        this.remove(modelToDelete);
        modelToDelete.sync("delete", modelToDelete);
    },
    createProjectOnDisk: function (values, callback) {
        var collection = this;
        server.create({
            args: [
                "\"" + values.location + "\"",
                values.name
            ].join(" ")
        }, function (response) {
            var model = collection.create(values);
            callback(response, model);
        }, callback);
    },
    deleteProjectFromDisk: function (modelCid, callback) {
        var collection = this,
            model = this.get(modelCid),
            deleteCallback = function (response) {
                if (response.status === 410) {
                    alert(collection.get(modelCid).attributes.name + " no longer exists on the file system. It will be removed from the project list.");
                } else if (response.status === 500) {
                    alert("Error during delete operation: " + response.error);
                }

                collection.deleteProjectModel(modelCid);
                callback(response);
            };

        server.delete({
            projectPath: model.get("location")
        }, deleteCallback, deleteCallback);
    },
    getDefaultProjectPath: function (callback) {
        server.defaultProjectPath({}, function (response) {
            callback(response);
        }, callback);
    }
});

module.exports = ProjectList;
