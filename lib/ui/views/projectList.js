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
        "click .project-list" : "showProjectInfo",
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

        window.views.projectInfo.model = model;
        window.views.projectInfo.render();
    }
});

module.exports = ProjectListView;
