var ProjectCreateView,
    projectCreateTemplate;

ProjectCreateView = Backbone.View.extend({
    initialize: function () {
        // Bind context to retain this.$el
        $(".new-project").click(this.render.bind(this));

        // Find the template and save it
        projectCreateTemplate = $("#project_create_template");
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(projectCreateTemplate.html());

        // Put the new html inside of the assigned element
        this.$el.html(template);
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
        });
    }
});

module.exports = ProjectCreateView;
