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
    wrench = require("wrench");

module.exports = {
    isValidProject: function (projectPath) {
        var isValid = true,
            cmdDir = path.join("platforms", "blackberry10", "cordova"),
            dotCordova = path.join(".cordova"),
            configXml = path.join("www", "config.xml"),
            fileList = [
                "merges",
                "platforms",
                "plugins",
                "www",
                cmdDir,
                dotCordova,
                configXml
            ];

        fileList.forEach(function (filepath) {
            isValid &= fs.existsSync(path.normalize(path.join(projectPath, filepath)));
        });

        return isValid;
    },

    getUserHome: function () {
        return process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"];
    },

    isWindows: function () {
        return process.platform.match(/^win/);
    },

    copyFile: function (srcFile, destDir, baseDir, newFileName) {
        var filename = newFileName ? newFileName : path.basename(srcFile),
            fileBuffer = fs.readFileSync(srcFile),
            fileLocation;

        //if a base directory was provided, determine
        //folder structure from the relative path of the base folder
        if (baseDir && srcFile.indexOf(baseDir) === 0) {
            fileLocation = srcFile.replace(baseDir, destDir);
            wrench.mkdirSyncRecursive(path.dirname(fileLocation), "0755");
            fs.writeFileSync(fileLocation, fileBuffer);
        } else {
            fs.writeFileSync(path.join(destDir, filename), fileBuffer);
        }
    },

    hashCode: function (str) {
        var hash = 0, i, char;
        if (str.length === 0) return hash;
        var l = str.length;
        for (i = 0; i < l; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
};
