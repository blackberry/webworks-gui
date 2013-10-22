var ProjectList,
    Project = require("../models/project"),
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
    deleteProject: function (modelCid) {
        // Remove from collection and destroy model
        var modelToDelete = this.get(modelCid);
        this.remove(modelToDelete);
        modelToDelete.sync("delete", modelToDelete);
    }
});

module.exports = ProjectList;
