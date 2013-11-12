var ProjectCreateView,
    projectCreateTemplate;

ProjectCreateView = Backbone.View.extend({
    initialize: function () {
        // Bind context to retain this.$el
        $(".new-project").click(this.render.bind(this));

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
            window.views.projectInfo.display(model);
        });
        window.views.dialogBox.display({body: "Creating..."});
    }
});

module.exports = ProjectCreateView;
