/*
 * Copyright 2014 BlackBerry Ltd.
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
    pretty = require("pretty-data").pd,
    DEFAULT_CONFIG_FILE = {
        targets: {}
    };

// Also creates .cordova folder if required
function getBB10ConfigPath () {
    return path.resolve(apiUtil.getCordovaDir() + "/blackberry10.json");
}

module.exports = {

    get: function (req, res) {
        var configPath = getBB10ConfigPath();
        // Create config file if required
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, pretty.json(DEFAULT_CONFIG_FILE), { encoding: "utf8" });
        }

        fs.readFile(configPath, { encoding: "utf8" }, function (error, data) {
            res.send(200, {
                success: !error,
                error: error,
                config: !error ? JSON.parse(data) : data
            });
        });
    },

    put: function (req, res) {
        var data = req.body,
            jsonData;

        data.targets = data.targets || {}; // Ensure "targets" always exists
        jsonData = pretty.json(JSON.stringify(data));

        fs.writeFile(getBB10ConfigPath(), jsonData, { encoding: "utf8" }, function (error) {
            res.send(200, {
                success: !error,
                error: error
            });
        });
    }

};
