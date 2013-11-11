var ProjectListView = require("./views/projectList"),
    ProjectCreateView = require("./views/projectCreate"),
    ProjectInfoView = require("./views/projectInfo"),
    ProjectBuildView = require("./views/projectBuild"),
    DialogBoxView = require("./views/dialogBox"),
    ProjectListCollection = require("./collections/projectList"),
    Project = require("./models/project"),
    DialogBox = require("./models/dialogBox"),
    storage = require("./storage");

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

    window.views.dialogBox = new DialogBoxView({
        el: $("#dialogBox"),
        model: new DialogBox()
    });

    // First load
    window.views.projectCreate.render();
}

// init
$(document).ready(onDocumentReady);
