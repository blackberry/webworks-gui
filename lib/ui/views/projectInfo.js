var ProjectInfoView,
    projectInfoTemplate;

function processLoadingScreenImages(xmldoc) {
    var splashElements = xmldoc.find("rim:splash[src]"),
        imageArray = [];

    if (splashElements) {
        splashElements.each(function (element) {
            imageArray.push(element.src);
        });
    }
    return imageArray;
}

// Takes a Document and returns a JSON object
function processConfigXml(xmldoc, location) {
    // Messy parsing, can be improved
    var info = {},
        nameElement = xmldoc.find("name"),
        authorElement = xmldoc.find("author"),
        descriptionElement = xmldoc.find("description"),
        iconElement = xmldoc.find("icon"),
        splashScreenBackgroundElement = xmldoc.find("widget feature param[name=backgroundColor]"),
        licenseElement = xmldoc.find("license"),
        mainFileElement = xmldoc.find("content");

    info.location = location;
    info.name = nameElement.length > 0 ? nameElement[0].textContent : "";
    info.author = authorElement.length > 0 ? authorElement[0].textContent : "";
    info.description = descriptionElement.length > 0 ? descriptionElement[0].textContent : "";
    info.icon = iconElement.length > 0 ? iconElement[0].getAttribute("src") : "";
    info.splashScreenImages = processLoadingScreenImages(xmldoc);
    info.splashScreenBackgroundColor = splashScreenBackgroundElement.length > 0 ? splashScreenBackgroundElement[0].getAttribute("value") : "";
    info.license = licenseElement.length > 0 ? licenseElement[0].textContent : "";
    info.mainFile = mainFileElement.length > 0 ? mainFileElement[0].getAttribute("src") : "";

    return info;
}

ProjectInfoView = Backbone.View.extend({
    initialize: function () {
        // Find the template and save it
        $.get("pages/info.html", function (data) {
            projectInfoTemplate = data;
        });
    },
    render: function () {
        // Use the template to create the html to display
        var view = this;

        // Put the new html inside of the assigned element
        this.model.getConfigXml(function (xmldoc) {
            var template = _.template(projectInfoTemplate, {
                info: processConfigXml(xmldoc, view.model.get("location"))
            });
            view.$el.html(template);
        });
    },
    display: function (model) {
        this.model = model;
        this.render();
    }
});

module.exports = ProjectInfoView;
