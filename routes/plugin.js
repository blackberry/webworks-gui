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
var cp = require("child_process"),
    util = require("util"),
    path = require("path"),
    apiUtil = require("../lib/util");

module.exports = {

    get: function (req, res) {
        var projectPath = req.query.path,
            cmd = req.query.cmd,
            args = req.query.args,
            cmdPath,
            execStr,
            child;

        if (apiUtil.isValidProject(projectPath)) {
            cmdPath = path.resolve(__dirname, path.join("..", "..", "webworks"));
            execStr = util.format("%s %s %s %s", cmdPath, "plugin", cmd, args);
            child = cp.exec(execStr, {
                cwd: projectPath
            },
            function (error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);

                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    path: projectPath,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            });
        } else {
            res.send(500, { error: "'" + projectPath + "' does not exist or is missing .cordova or platforms/blackberry10/cordova" });
        }
    }
};
