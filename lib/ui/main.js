var ProjectListView = require("./views/projectList"),
    ProjectCreateView = require("./views/projectCreate"),
    ProjectInfoView = require("./views/projectInfo"),
    ProjectListCollection = require("./collections/projectList"),
    Project = require("./models/project"),
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
}

// init
$(document).ready(onDocumentReady);
