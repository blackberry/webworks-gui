var PermissionsListView,
    viewTemplate;

function deletePermit(config, permit) {
    var indexToDelete = -1,
        removed;

    if (config.widget["rim$permissions"] && config.widget["rim$permissions"]["rim$permit"]) {
        config.widget["rim$permissions"]["rim$permit"].forEach(function (p) {
            if (p.$t === permit) {
                indexToDelete = config.widget["rim$permissions"]["rim$permit"].indexOf(p);
            }
        });

        if (indexToDelete !== -1) {
            config.widget["rim$permissions"]["rim$permit"].splice(indexToDelete, 1);
        }
    }
}

function updatePermit(config, permit) {
    if (!config.widget["rim$permissions"]) {
        config.widget["rim$permissions"] = {};
    }

    if (!config.widget["rim$permissions"]["rim$permit"]) {
        config.widget["rim$permissions"]["rim$permit"] = [];
    }

    var newPermit = true,
        obj;

    config.widget["rim$permissions"]["rim$permit"].forEach(function (p) {
        if (p.$t === permit) {
            newPermit = false;
        }
    });

    if (newPermit) {
        obj = {
            $t: permit
        };

        if (permit === "_sys_use_consumer_push") {
            obj.system = true;
        }

        config.widget["rim$permissions"]["rim$permit"].push(obj);
    }
}

function trimPermissions(config) {
    if (config.widget["rim$permissions"] && config.widget["rim$permissions"]["rim$permit"].length === 0) {
        delete config.widget["rim$permissions"];
    }
}

PermissionsListView = Backbone.View.extend({
    render: function () {
        var that = this;

        if (!viewTemplate) {
            $.get("pages/permissions.html", function (data) {
                viewTemplate = data;
                that.updateDisplay();
            });
        } else {
            this.updateDisplay();
        }
    },
    events: {
        "click #addPermitBtn" : "addToConfig",
        "click .permit-delete-btn" : "removeFromConfig"
    },
    display: function (model) {
        this.model = model;
        this.render();
    },
    updateDisplay: function () {
        // Use the template to create the html to display
        var template = _.template(viewTemplate, {
            widget: this.model.get("config").widget
        });

        // Put the new html inside of the assigned element
        this.$el.html(template);
    },
    addToConfig: function (event) {
        var config = this.model.get("config"),
            permit = $("#newPermit").val(),
            that = this;

        if (permit === "none") {
            return;
        }

        updatePermit(config, permit);
        trimPermissions(config);

        this.model.set("config", config);
        this.render();
    },
    removeFromConfig: function (event) {
        var config = this.model.get("config");

        deletePermit(config, event.currentTarget.dataset.permit);
        trimPermissions(config);

        this.model.set("config", config);
        this.render();
    }
});

module.exports = PermissionsListView;