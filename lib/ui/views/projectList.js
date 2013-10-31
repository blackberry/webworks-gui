var ProjectListView,
    text = require("../text");

ProjectListView = Backbone.View.extend({
    initialize: function () {
        this.collection.fetch();
        this.render();

        // Update whenever the model adds, removes, changes
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);
        this.listenTo(this.collection, "change", this.render);
    },
    render: function () {
        // Use the models in the collection to populate the $el element
        var template = _.template($('#project_list_template').html(), {
            projects: this.collection.models
        });

        this.$el.html(template);
    },
    events: {
        "click .delete-btn" : "removeFromList",
        "click .project-list" : "setActiveProject",
        "click .project-button[data-page=info]" : "showProjectInfo",
        "click .project-button[data-page=build]" : "showBuildPage"
    },
    removeFromList: function (event) {
        // Use data-cid attribute to delete the project from the list

        if (confirm(text.PROJECT_DELETE_CONFIRM)) {
            this.collection.deleteProjectFromDisk(event.target.getAttribute("data-cid"));
        }
    },
    showProjectInfo: function (event) {
        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        window.views.projectInfo.display(model);
    },
    showBuildPage: function (event) {
        var cid = event.target.getAttribute("data-cid"),
            model = this.collection.get(cid);

        window.views.projectBuild.display(model);
    },
    setActiveProject: function (event) {
        this.showProjectInfo(event);
        //this.activeProject = event.target.getAttribute("data-cid");
    }
});

module.exports = ProjectListView;
