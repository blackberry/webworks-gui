var ProjectBuildView,
    projectBuildTemplate;

ProjectBuildView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/builder.html", function (data) {
            projectBuildTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(projectBuildTemplate, {
            project: this.model
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    },
    events: {
        "click #buildAndInstall" : "installProject",
        "click #build" : "buildProject"
    },
    installProject: function (event) {
        var options = {
            devicePassword: $("#devicePassword").val(),
            keystorePassword: $("#keystorePassword").val(),
            device: $("#targetType input:radio:checked").val() === "device",
            debug: $("#buildMode input:radio:checked").val() === "debug"
        };

        this.model.install(options, function (output) {
            $("#build-log").text(output.stdout);
        });
    },
    buildProject: function (event) {
        var options = {
            keystorePassword: $("#keystorePassword").val(),
            debug: $("#buildMode input:radio:checked").val() === "debug"
        };

        this.model.build(options, function (output) {
            $("#build-log").text(output.stdout);
        });
    },
    display: function (model) {
        this.model = model;
        this.render();
    }
});

module.exports = ProjectBuildView;
