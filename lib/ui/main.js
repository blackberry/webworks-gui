/*
 * Copyright 2013 BlackBerry Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ProjectListView = require("./views/projectList"),
    ProjectCreateView = require("./views/projectCreate"),
    ProjectInfoView = require("./views/projectInfo"),
    ProjectBuildView = require("./views/projectBuild"),
    ProjectPluginsView = require("./views/projectPlugins"),
    CertificatesView = require("./views/certificates"),
    TargetsView = require("./views/targets"),
    DialogBoxView = require("./views/dialogBox"),
    ProjectListCollection = require("./collections/projectList"),
    Project = require("./models/project"),
    DialogBox = require("./models/dialogBox"),
    SigningConfig = require("./models/signingConfig"),
    Targets = require("./models/targets"),
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

    window.views.certificates = new CertificatesView({
        el: $("#content"),
        model: new SigningConfig()
    });

    window.views.targets = new TargetsView({
        el: $("#content"),
        model: new Targets()
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
