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
            buildSettings: this.model.get("buildSettings") || {device: true, debug: true}
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    },
    events: {
        "click #buildAndInstall" : "installProject",
        "click #build" : "buildProject",
        "change #buildMode" : "saveBuildSettings",
        "change #targetType" : "saveBuildSettings"
    },
    installProject: function (event) {
        var options = {
            devicePassword: $("#devicePassword").val(),
            keystorePassword: $("#keystorePassword").val(),
            debug: $("#buildMode input:radio:checked").val() === "debug",
            device: $("#targetType input:radio:checked").val() === "device"
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
    },
    saveBuildSettings: function () {
        var settings = {
            device: $("#targetType input:radio:checked").val() === "device",
            debug: $("#buildMode input:radio:checked").val() === "debug"
        };

        this.model.set("buildSettings", settings);
    }
});

module.exports = ProjectBuildView;
