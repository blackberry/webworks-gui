var Project = Backbone.Model.extend({
    sync: function () {
        // Override the default and do nothing
    }
});

module.exports = Project;
// Sample usage:
// var p = new Project({
//        name: "Project Name",
//        location: "/path/to/place"
//      });
