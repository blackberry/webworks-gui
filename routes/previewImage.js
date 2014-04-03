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
    apiUtil = require("../lib/util");

module.exports = {

    get: function (req, res) {
        var projectPath = req.query.path,
            filePath = req.query.filePath,
            resourcePath,
            exists,
            destDir,
            newFileName,
            previewPath;

        if (apiUtil.isValidProject(projectPath)) {
            resourcePath = path.join(projectPath, "www", filePath);
            exists = fs.existsSync(resourcePath);

            if (exists) {
                destDir = apiUtil.getImagePreviewPath();

                if (!fs.existsSync(destDir)) {
                    wrench.mkdirSyncRecursive(destDir, "0755");
                }

                // compute hash based on project path and image file path within project
                // client side will use this hash to display image on GUI
                newFileName = apiUtil.hashCode(projectPath + "-" + filePath) + path.extname(filePath);
                previewPath = path.join(destDir, newFileName);

                if (fs.existsSync(previewPath)) {
                    fs.unlinkSync(previewPath);
                }

                apiUtil.copyFile(resourcePath, destDir, null, newFileName);
                res.send(200, {
                    success: true,
                    resourcePath: resourcePath,
                    previewPath: previewPath
                });
            } else {
                res.send(200, {
                    error: filePath + " does not exist in project"
                });
            }
        } else {
            res.send(500, { error: "'" + projectPath + "' does not exist' " });
        }
    }

};
