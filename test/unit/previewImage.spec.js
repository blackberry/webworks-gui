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

var root = __dirname + "/../../",
    fs = require("fs"),
    path = require("path"),
    project = require(root + "routes/previewImage"),
    apiUtil = require(root + "lib/util"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("previewImg", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("copy specified file to tmp folder for client side display", function () {
        var projectPath = "hellow1",
            filePath = "img/blah.png",
            destDir = "dest",
            resourcePath = path.join(projectPath, "www", filePath),
            newFileName;

        spyOn(apiUtil, "isValidProject").andReturn(true);
        spyOn(path, "resolve").andReturn(destDir);
        spyOn(fs, "existsSync").andReturn(true);
        spyOn(apiUtil, "hashCode").andCallThrough();
        spyOn(apiUtil, "copyFile");
        spyOn(fs, "unlinkSync");

        project.get({
            query: {
                path: projectPath,
                filePath: filePath
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith(projectPath);
        expect(apiUtil.hashCode).toHaveBeenCalledWith(projectPath + "-" + filePath);

        newFileName = apiUtil.hashCode(projectPath + "-" + filePath) + path.extname(filePath);
        expect(apiUtil.copyFile).toHaveBeenCalledWith(resourcePath, destDir, null, newFileName);

        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            resourcePath: resourcePath,
            previewPath: path.join(destDir, newFileName)
        });
    });

});
