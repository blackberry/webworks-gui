var ProjectListView = require("./views/projectList"),
    ProjectCreateView = require("./views/projectCreate"),
    ProjectInfoView = require("./views/projectInfo"),
    ProjectBuildView = require("./views/projectBuild"),
    ProjectPluginsView = require("./views/projectPlugins"),
    DialogBoxView = require("./views/dialogBox"),
    ProjectListCollection = require("./collections/projectList"),
    Project = require("./models/project"),
    DialogBox = require("./models/dialogBox"),
    storage = require("./storage");

String.prototype.hashCode = function () {
    var hash = 0, i, l, char;
    if (this.length === 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function onDocumentReady() {

    window.views = {};

    window.views.projectList = new ProjectListView({
        el: $("#list-projects"),
        collection: new ProjectListCollection()
    });

    window.views.projectCreate = new ProjectCreateView({
        el: $("#content"),
        collection: window.views.projectList.collection // same collection as project list
    });

    window.views.projectInfo = new ProjectInfoView({
        el: $("#content")
    });

    window.views.projectBuild = new ProjectBuildView({
        el: $("#content")
    });

    window.views.projectPlugins = new ProjectPluginsView({
        el: $("#content")
    });

    window.views.dialogBox = new DialogBoxView({
        el: $("#dialogBox"),
        model: new DialogBox()
    });

    // First load
    window.views.projectCreate.render();
}

// init
$(document).ready(onDocumentReady);
