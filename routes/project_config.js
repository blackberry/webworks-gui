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
var fs = require("fs"),
    path = require("path"),
    apiUtil = require("../lib/util"),
    xm = require("xml-mapping"),
    pretty = require("pretty-data").pd;

module.exports = {

    get: function (req, res) {
        var projectPath = req.query.path,
            configPath;

        if (apiUtil.isValidProject(projectPath)) {
            configPath = path.join(projectPath, "www", "config.xml");
            fs.readFile(configPath, { encoding: "utf8" }, function (error, data) {
                res.send(200, {
                    success: !error,
                    configFile: xm.load(data, {
                        arrays: [
                            "/widget/access",
                            "/widget/preference",
                            "/widget/icon",
                            "/widget/rim:splash",
                            "/widget/rim:permissions/rim:permit"
                        ]
                    })
                });
            });
        } else {
            res.send(500, { error: "'" + projectPath + "' does not exist' " });
        }
    },

    put: function (req, res) {
        var projectPath = req.body.path,
            data = req.body.data,
            xmlData = xm.dump(data),
            configPath;

        if (apiUtil.isValidProject(projectPath)) {
            configPath = path.join(projectPath, "www", "config.xml");
            fs.writeFile(configPath, pretty.xml(xmlData), { encoding: "utf8" }, function (error) {
                res.send(200, {
                    success: !error,
                    error: error
                });
            });
        } else {
            res.send(500, { error: "'" + projectPath + "' does not exist' " });
        }
    }

};
