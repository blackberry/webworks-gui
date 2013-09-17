#!/usr/bin/env node

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

var express = require("express"),
    fs = require("fs"),
    cp = require("child_process"),
    util = require("util"),
    path = require("path"),
    config = require("../../config.json"),
    app = express(),
    port = config.port ? config.port : 3000,
    isWindows = process.platform.match(/^win/);

function isValidProject(projectPath) {
    var cmdDir = path.join(projectPath, "platforms", "blackberry10", "cordova"),
        dotCordova = path.join(projectPath, ".cordova"),
        configXml = path.join(projectPath, "www", "config.xml");

    return (fs.existsSync(projectPath) &&
            fs.existsSync(cmdDir) &&
            fs.existsSync(dotCordova) &&
            fs.existsSync(configXml));
}

cp.spawn("open", ["http://localhost:" + port]);

app.get("/", function (req, res) {
    res.sendfile(path.resolve(__dirname, path.join("..", "..", "public", "index.html")));
});

app.get("/create", function (req, res) {
    var cmd = "create"+ (isWindows ? ".bat" : ""),
        args = req.query.args,
        cmdPath = path.resolve(__dirname, path.join("..", "..", "..", "webworks-cli", "bin", "webworks"));

    if (fs.existsSync(cmdPath)) {
        console.log("args=" + args);

        var execStr = util.format("%s %s %s", cmdPath, cmd, args),
            child;

        child = cp.exec(execStr, function (error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);

                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            });
    } else {
        res.send(500, { error: "'" + cmdPath + "' does not exist' " });
    }
});

app.get("/tools", function (req, res) {
    var cmd = "blackberry-" + req.query.cmd + (isWindows ? ".bat" : ""),
        args = req.query.args,
        cmdPath = path.resolve(__dirname, path.join("..", "..", "..", "cordova-blackberry", "bin", "dependencies", "bb-tools", "bin", cmd));

    if (fs.existsSync(cmdPath)) {
        console.log("cmdPath=" + cmdPath);
        console.log("args=" + args);

        var execStr = util.format("%s %s", cmdPath, args),
            child;

        child = cp.exec(execStr, function (error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);

                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            });
    } else {
        res.send(500, { error: "'" + cmdPath + "' does not exist' " });
    }
});

app.get("/validateProject", function (req, res) {
    var projectPath = req.query.path;

    res.send(200, {
        isValid: isValidProject(projectPath)
    });
});

app.get("/global", function (req, res) {
    var cmd = req.query.cmd + (isWindows ? ".bat" : ""),
        args = req.query.args,
        cmdPath = path.resolve(__dirname, path.join("..", "..", "..", "cordova-blackberry", "bin", cmd));

    if (fs.existsSync(cmdPath)) {
        console.log("cmd=" + cmd);
        console.log("args=" + args);

        var execStr = util.format("%s %s", cmdPath, args),
            child;

        child = cp.exec(execStr, function (error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);

                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            });
    } else {
        res.send(500, { error: "'" + cmd + "' does not exist' " });
    }
});

app.get("/project", function (req, res) {
    var projectPath = req.query.path,
        cmd = req.query.cmd + (isWindows ? ".bat" : ""),
        args = req.query.args,
        cmdDir = path.join(projectPath, "platforms", "blackberry10", "cordova"),
        cmdPath;

    if (isValidProject(projectPath)) {
        cmdPath = path.join(cmdDir, cmd);

        if (fs.existsSync(cmdPath)) {
            var execStr = util.format("%s %s", cmdPath, args),
                child;

            child = cp.exec(execStr, function (error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);

                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            });
        } else {
            res.send(500, { error: "'" + cmdPath + "' does not exist'" });
        }
    } else {
        res.send(500, { error: "'" + projectPath + "' does not exist or is missing .cordova or platforms/blackberry10/cordova" });
    }
});

app.get("/project_config", function (req, res) {
    var projectPath = req.query.path,
        configPath;

    if (fs.existsSync(projectPath)) {
        configPath = path.join(projectPath, "www", "config.xml");

        if (fs.existsSync(configPath)) {
            fs.readFile(configPath, { encoding: "utf8" },function (error, data) {
                res.send(200, {
                    success: !error,
                    configFile: data
                });
            });
        } else {
            res.send(500, { error: "'" + configPath + "' does not exist' " });
        }
    } else {
        res.send(500, { error: "'" + projectPath + "' does not exist' " });
    }
});

app.get("/config", function (req, res) {
    var cordovaDir = path.join(process.env.HOME, ".cordova"),
        configPath = path.join(cordovaDir, "blackberry10.json");

    if (fs.existsSync(cordovaDir)) {
        res.send(200, {
            config: require(configPath)
        });
    } else {
        res.send(500, { error: "'" + configPath + "' does not exist' " });
    }
});

app.listen(port);
console.log("Listening on port " + port);
