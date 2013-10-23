var ProjectList,
    Project = require("../models/project"),
    server = require("../server"),
    storage = require("../storage");

ProjectList = Backbone.Collection.extend({
    model: Project,
    initialize: function () {
        var projects = storage.readProjects(),
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
    createProjectOnDisk: function (values) {
        var collection = this;
        server.create({
            args: [
                values.location,
                values.name
            ].join(" ")
        }, function (response) {
            collection.create(values);
        });
    },
    deleteProjectFromDisk: function (modelCid) {
        var collection = this,
            model = this.get(modelCid);

        server.delete({
            projectPath: model.get("location")
        }, function (response) {
            collection.deleteProjectModel(modelCid);
        });
    }
});

module.exports = ProjectList;
