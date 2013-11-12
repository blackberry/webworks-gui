var AccessListView,
    viewTemplate;

function deleteAccess(config, origin) {
    var indexToDelete = -1;
    config.widget.access.forEach(function (access) {
        if (access.origin === origin) {
            indexToDelete = config.widget.access.indexOf(access);
        }
    });

    if (indexToDelete !== -1) {
        config.widget.access.splice(indexToDelete, 1);
    }
}

function updateAccess(config, origin, subdomains) {
    config.widget.access = config.widget.access || [];
    var newAccess = true;

    config.widget.access.forEach(function (access) {
        if (access.origin === origin) {
            access.subdomains = subdomains;
            newAccess = false;
        }
    });

    if (newAccess) {
        config.widget.access.push({
            origin: origin,
            subdomains: subdomains
        });
    }
}

AccessListView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/accessList.html", function (data) {
            viewTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var template = _.template(viewTemplate, {
            widget: this.model.get("config").widget
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    },
    events: {
        "click #addAccessBtn" : "addAccessToConfig",
        "click .access-delete-btn" : "removeAccessFromConfig"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    addAccessToConfig: function (event) {
        var origin = $("#newOriginInput").val(),
            subdomains = $("#newOriginSubdomains")[0].checked.toString(),
            config = this.model.get("config");

        updateAccess(config, origin, subdomains);
        this.model.set("config", config);
        this.render();
    },
    removeAccessFromConfig: function (event) {
        var origin = event.currentTarget.dataset.origin,
            config = this.model.get("config");

        deleteAccess(config, origin);
        this.model.set("config", config);
        this.render();
    }
});

module.exports = AccessListView;
