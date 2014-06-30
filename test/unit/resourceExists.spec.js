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
    project = require(root + "routes/resourceExists"),
    apiUtil = require(root + "lib/util"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("resourceExists", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("calls existsSync to test if resource exists", function () {
        var projectPath = "hellow1",
            filePath = "img/blah.png",
            resourcePath = path.join(projectPath, 'www', filePath);

        spyOn(apiUtil, "isValidProject").andReturn(true);
        spyOn(fs, "existsSync").andReturn(true);
        spyOn(fs, "readdirSync").andReturn(['foo']);
        spyOn(path, "basename").andReturn('foo');

        project.get({
            query: {
                path: projectPath,
                filePath: filePath
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith(projectPath);
        expect(fs.existsSync).toHaveBeenCalledWith(resourcePath);
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            exists: true,
            isMatched: true,
            normalizedPath: filePath,
            error: ""
        });
    });
});
