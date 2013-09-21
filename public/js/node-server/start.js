#!/usr/bin/env node

/*
 *  Copyright 2013 Research In Motion Limited.
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
    config = require("../config.json"),
    app = express(),
    port = config.port ? config.port : 3000,
    isWindows = process.platform.match(/^win/);

//cp.spawn("open", ["http://localhost:" + port]);

app.use(express.static(path.normalize(path.join(__dirname,'../public/img'))));
app.use(express.static(path.normalize(path.join(__dirname,'../public/css'))));
app.use(express.static(path.normalize(path.join(__dirname,'../public/js'))));
app.use(express.static(path.normalize(path.join(__dirname,'../public/fonts'))));
app.use(express.static(path.normalize(path.join(__dirname,'../public/pages'))));

function createXMLFiles(){
    if (fs.existsSync(path.join("public/xml/projects.xml"))) {
    }else {
         fs.writeFile('public/xml/projects.xml', '<projects> </projects>', function (err) {
    if (err) throw err;
         })
    }

        if (fs.existsSync(path.join("public/xml/certificates.xml"))) {
    }else {
         fs.writeFile('public/xml/certificates.xml', '<certificates> </certificates>', function (err) {
    if (err) throw err;
         })
  }
}

createXMLFiles()

app.get("/", function (req, res) {
    res.sendfile("public/welcome.html");
});

app.get("/index", function (req, res) {
    res.sendfile("public/index.html");
});

app.get("/public/xml/projects.xml", function (req, res) {
    res.sendfile("public/xml/projects.xml");
});

app.get("/public/xml/certificates.xml", function (req, res) {
    res.sendfile("public/xml/certificates.xml");
});


app.get("/xmlManager", function (req, res) {
    var cmd = req.query.cmd ,
        args = req.query.args;

    if((cmd=="addProject")||(cmd=="removeProject")||(cmd=="setActiveProject")) {
        fs.writeFile('public/xml/projects.xml', args, function (err) {
            if (err) throw err;
         });
    }
    
    if((cmd=="addCertificate")||(cmd=="removeCertificate")||(cmd=="setActiveCertificate")) {
        fs.writeFile('public/xml/certificates.xml', args, function (err) {
            if (err) throw err;
         });
    }

});

app.get("/global", function (req, res) {
    var cmd = req.query.cmd + (isWindows ? ".bat" : ""),
        args = req.query.args,
        cmdPath = path.join("bin/", cmd);

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
        cmdPath;

    if (fs.existsSync(projectPath)) {
        cmdPath = path.join(projectPath, "/cordova/", cmd);

        if (fs.existsSync(cmdPath)) {
            var execStr = util.format("%s %s", cmdPath, args),
                child;

            child = cp.exec(execStr, function (error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);

                res.send(200, {
                    success: !error,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            });
        } else {
            res.send(500, { error: "'" + cmdPath + "' does not exist' " });
        }
    } else {
        res.send(500, { error: "'" + path + "' does not exist' " });
    }
});

app.get("/project_config", function (req, res) {
    var projectPath = req.query.path,
        configPath;

    if (fs.existsSync(projectPath)) {
        configPath = path.join(projectPath, "/www/config.xml");

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
        res.send(500, { error: "'" + path + "' does not exist' " });
    }
});

app.get("/config", function (req, res) {
    var cordovaDir = path.join(process.env.HOME, "/.cordova"),
        configPath = path.join(cordovaDir, "/blackberry10.json");

    if (fs.existsSync(cordovaDir)) {
        res.send(200, {
            config: require(configPath)
        });
    } else {
        res.send(500, { error: "'" + path + "' does not exist' " });
    }
});

app.listen(port);
console.log("Listening on port " + port);
