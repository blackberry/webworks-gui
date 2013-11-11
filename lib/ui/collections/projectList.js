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
                values.location,
                values.name
            ].join(" ")
        }, function (response) {
            var model = collection.create(values);
            callback(response, model);
        });
    },
    deleteProjectFromDisk: function (modelCid, callback) {
        var collection = this,
            model = this.get(modelCid);

        server.delete({
            projectPath: model.get("location")
        }, function (response) {
            collection.deleteProjectModel(modelCid);
            callback(response);
        });
    },
    getDefaultProjectPath: function (callback) {
        server.defaultProjectPath({}, function (response) {
            callback(response);
        });
    }
});

module.exports = ProjectList;
