var IconDisplayView,
    viewTemplate;

IconDisplayView = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.on("add", this.render);
        this.on("remove", this.render);

        this.render();
    },
    render: function () {
        if (!viewTemplate) {
            var that = this;

            // Find the template and save it
            $.get("pages/icon_display.html", function (data) {
                viewTemplate = data;
                that.updateDisplay();
            });
        } else {
            this.updateDisplay();
        }
    },
    updateDisplay: function () {
        // Use the template to create the html to display
        var options = this.options,
            template = _.template(viewTemplate, {
                widget: options.widget,
                location: options.location
            });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    }
});

module.exports = IconDisplayView;