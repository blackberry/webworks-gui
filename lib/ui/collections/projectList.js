var ProjectList,
    Project = require("../models/project");

/*function transformLocalStorage() {
    var projects = JSON.parse(window.localStorage.projects);
    return Object.keys(projects).map(function (id) {
        return new Project(projects[id]);
    });
}*/

ProjectList = Backbone.Collection.extend({
    model: Project,
    sync: function (method, model, options) {
        /*var projects;

        // Setup
        if (!window.localStorage.projects) {
            window.localStorage.projects = JSON.stringify({});
        }

        switch (method) {
            case "read":
                options.success(transformLocalStorage());
                break;
            case "update":
                projects = JSON.parse(window.localStorage.projects);
                projects[model.id] = model;
                window.localStorage.projects = JSON.stringify(projects);
                break;
        }*/
    }
});

module.exports = ProjectList;
