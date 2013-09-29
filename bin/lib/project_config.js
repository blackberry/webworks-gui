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
    apiUtil = require("./util");

module.exports = function (req, res) {
    var projectPath = req.query.path,
        configPath;

    if (apiUtil.isValidProject(projectPath)) {
        configPath = path.join(projectPath, "www", "config.xml");

        fs.readFile(configPath, { encoding: "utf8" }, function (error, data) {
            res.send(200, {
                success: !error,
                configFile: data
            });
        });
    } else {
        res.send(500, { error: "'" + projectPath + "' does not exist' " });
    }
};
