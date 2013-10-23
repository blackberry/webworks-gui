var Project,
    storage = require("../storage");

Project = Backbone.Model.extend({
    sync: function (method, model, options) {
        var projects = storage.readProjects(),
            id = this.get("location");

        switch (method) {
        case "update":
            projects[id] = this.toJSON();
            break;
        case "create":
            projects[id] = this.toJSON();
            break;
        case "delete":
            delete projects[id];
            break;
        }

        storage.saveProjects(projects);
    },
});

module.exports = Project;
// Sample usage:
// var p = new Project({
//        name: "Project Name",
//        location: "/path/to/place"
//      });
