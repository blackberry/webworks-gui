var DialogBoxView,
    dialogBoxTemplate;

DialogBoxView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/dialogBox.html", function (data) {
            dialogBoxTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(dialogBoxTemplate, {
            title: this.model.get("title") || "&nbsp;",
            body: this.model.get("body"),
            buttons: this.model.get("buttons")
        });
        this.$el.html(template);
    },
    display: function (model) {
        if (model instanceof Backbone.Model) {
            this.model = model;
        } else {
            this.model.set("title", model.title);
            this.model.set("body", model.body);
            this.model.set("buttons", model.buttons);
        }
        this.$el.show();
        this.render();
    },
    hide: function () {
        this.$el.hide();
    },
    events: {
    },
});

module.exports = DialogBoxView;
