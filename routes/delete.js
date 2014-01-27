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
    wrench = require("wrench"),
    utils = require("../lib/util");

module.exports = {
    get: function (req, res) {

        var projectPath = path.resolve(req.query.projectPath);
        if (!fs.existsSync(projectPath)) {
            //project no longer exists on file system, throw http 410 status [Gone]
            res.send(410, {
                success: true
            });
        } else if (utils.isValidProject(projectPath)) {
            //project found, delete files
            var httpCode = 200,
                response = {
                    success: true
                };

            try {
                wrench.rmdirSyncRecursive(projectPath, false);
            } catch (e) {
                httpCode = 500;
                response = {
                    success: false,
                    error: e.message
                };
            }

            res.send(httpCode, response);
        } else {
            //something went wrong, return 500 [Internal server error]
            res.send(500, { error: "'" + projectPath + "' is not a valid project folder' " });
        }
    }
};
