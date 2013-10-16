var ProjectListView = Backbone.View.extend({
    initialize: function () {
        this.model.fetch();
        this.render();

        // Update whenever the model adds, removes, changes
        this.listenTo(this.model, "add", this.render);
        this.listenTo(this.model, "remove", this.render);
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        // Use the models in the collection to populate the $el element
        var template = _.template($('#project_list_template').html(), {
            projects: this.model.models
        });

        this.$el.html(template);
    },
    events: {
        "click .delete-btn" : "removeFromList"
    },
    removeFromList: function (event) {
        // Use data-cid attribute to delete the project from the list
        this.model.remove(event.target.getAttribute("data-cid"));
    }
});

module.exports = ProjectListView;
