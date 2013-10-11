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
    apiUtil = require("../lib/util");

module.exports = {

    get: function (req, res) {
        var cmd = "blackberry-" + req.query.cmd + (apiUtil.isWindows() ? ".bat" : ""),
            args = req.query.args,
            cmdPath = path.resolve(__dirname, path.join("..", "..", "cordova-blackberry", "bin", "dependencies", "bb-tools", "bin", cmd)),
            execStr,
            child;

        if (fs.existsSync(cmdPath)) {
            console.log("cmdPath=" + cmdPath);
            console.log("args=" + args);

            execStr = util.format("%s %s", cmdPath, args);
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
    }

};
