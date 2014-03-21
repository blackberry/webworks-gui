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
    cp = require("child_process"),
    util = require("util"),
    path = require("path"),
    apiUtil = require("../lib/util"),
    guiUtil = require("./../lib/util");

module.exports = {

    get: function (req, res) {
        var cmd = "create",
            location = guiUtil.getSafePath(req.query.location),
            projectId = "\"" + req.query.projectId + "\"",
            name = "\"" + req.query.name + "\"",
            cmdPath = path.resolve(__dirname, path.join("..", "..", "webworks")),
            execStr,
            child;

            execStr = util.format('"%s" "%s" %s "%s"', apiUtil.getNode(), apiUtil.getWebworksCli(), cmd, location, projectId, name); //quoted placeholders are not defined for projectId and name as they are optional
            child = cp.exec(execStr, function (error, stdout, stderr) {
                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    cmd: cmd,
                    location: location,
                    projectId: projectId,
                    name: name,
                    stdout: stdout,
                    stderr: stderr
                });
            });
    }

};
