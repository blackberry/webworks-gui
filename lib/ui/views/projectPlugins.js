var PluginListView,
    viewTemplate;

PluginListView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/pluginList.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        var view = this;
        // Use the template to create the html to display

        this.model.getPlugins(function (pluginsList) {
            var template = _.template(viewTemplate, {
                pluginsList: pluginsList
            });

            // Put the new html inside of the assigned element
            view.$el.html(template);
        });
    },
    events: {
        "click #addPluginBtn" : "addFeatureToConfig",
        "click .access-delete-btn" : "removeFeatureFromConfig",
        "submit" : "handleSubmit"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    addFeatureToConfig: function (event) {
        var view = this,
            name = $("#newFeatureInput").val();

        window.views.dialogBox.display({body: "Adding plugin..."});
        this.model.addPlugin({name: name}, function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },
    removeFeatureFromConfig: function (event) {
        var view = this,
            name = event.currentTarget.dataset.name;

        window.views.dialogBox.display({body: "Removing plugin..."});
        this.model.removePlugin({name: name}, function (response) {
            view.render();
            window.views.dialogBox.hide();
            if (!response.success) {
                alert(response.stderr);
            }
        });
    },
    handleSubmit: function (event) {
        event.preventDefault();
        this.addFeatureToConfig(event);
    }
});

module.exports = PluginListView;
