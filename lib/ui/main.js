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
    DialogBoxView = require("./views/dialogBox"),
    ProjectOpenView = require("./views/projectOpen"),
    TargetListView = require("./views/targets"),
    ProxyView = require("./views/proxies"),
    ProjectListCollection = require("./collections/projectList"),
    Project = require("./models/project"),
    DialogBox = require("./models/dialogBox"),
    SigningConfig = require("./models/signingConfig"),
    BB10Config = require("./models/bb10config"),
    storage = require("./storage"),
    validators = require("./validators"),
    currentProjectId;

function onDocumentReady() {

    validators.register();
    window.views = {};

    window.views.projectList = new ProjectListView({
        el: $("#list-projects"),
        collection: new ProjectListCollection()
    });

    window.views.projectOpen = new ProjectOpenView({
        el: $("#content"),
        collection: window.views.projectList.collection // same collection as project list
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

    window.views.targets = new TargetListView({
        el: $("#content"),
        model: new BB10Config()
    });

    window.views.proxies = new ProxyView({
        el: $("#content"),
        model: new BB10Config()
    });

    window.views.dialogBox = new DialogBoxView({
        el: $("#dialogBox"),
        model: new DialogBox()
    });

    window.views.projectCreate.render();
}

// init
$(document).ready(onDocumentReady);
