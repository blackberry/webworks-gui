var Project,
    server = require("../server"),
    storage = require("../storage");

Project = Backbone.Model.extend({
    initialize: function () {
        this.on("change:buildSettings", this.saveChanges);
    },
    saveChanges: function () {
        this.sync("update");
    },
    sync: function (method, model, options) {
        var projects = storage.readProjects(),
            id = this.get("location");

        switch (method) {
        case "update":
            projects[id] = this.toJSON();
            break;
        case "create":
            projects[id] = this.toJSON();
            break;
        case "delete":
            delete projects[id];
            break;
        }

        storage.saveProjects(projects);
    },
    getConfigXml: function (callback) {
        var model = this;
        server.getProjectConfig({
            path: this.get("location")
        }, function (response) {
            model.set("config", response.configFile);
            callback(response.configFile);
        }, callback);
    },
    setConfigXml: function (callback) {
        server.setProjectConfig({
            path: this.get("location"),
            data: this.get("config")
        }, callback, callback);
    },
    getPlugins: function (callback) {
        server.plugins({
            cmd: "list",
            path: this.get("location")
        }, function (response) {
            callback(response.stdout);
        }, function (response) {
            alert("Error code: " + response.code);
        });
    },
    addPlugin: function (options, callback) {
        server.plugins({
            cmd: "add",
            path: this.get("location"),
            args: options.name
        }, callback, callback);
    },
    removePlugin: function (options, callback) {
        server.plugins({
            cmd: "remove",
            path: this.get("location"),
            args: options.name
        }, callback, callback);
    },
    install: function (options, callback) {
        server.project({
            cmd: "run",
            path: this.get("location"),
            args: [
                options.device ? "--device" : "--emulator",
                options.devicePassword ? "--devicepass" : "",
                options.devicePassword || "",
                options.keystorePassword ? "--keystorepass" : "",
                options.keystorePassword || ""
            ].join(" ")
        }, callback, callback);
    },
    build: function (options, callback) {
        server.project({
            cmd: "build",
            path: this.get("location"),
            args: [
                options.debug ? "--debug" : "--release",
                options.keystorePassword ? "--keystorepass" : "",
                options.keystorePassword || ""
            ].join(" ")
        }, callback, callback);
    }
});

module.exports = Project;
// Sample usage:
// var p = new Project({
//        name: "Project Name",
//        location: "/path/to/place"
//      });
