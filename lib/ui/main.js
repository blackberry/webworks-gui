var ProjectListView = require("./views/projectList"),
    ProjectCreateView = require("./views/projectCreate"),
    ProjectListCollection = require("./collections/projectList"),
    Project = require("./models/project");

function onDocumentReady() {

    window.views = {};

    window.views.projectList = new ProjectListView({
        el: $("#list-projects"),
        model: new ProjectListCollection()
    });

    window.views.projectCreate = new ProjectCreateView({
        el: $("#content"),
        model: window.views.projectList.model // same model as project list
    });

}

// init
$(document).ready(onDocumentReady);
