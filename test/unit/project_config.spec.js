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
    project_config = require(root + "routes/project_config"),
    apiUtil = require(root + "lib/util"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("project_config", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("return config.xml content if it exists", function () {
        var configPathRE = /hellow1[\\\/]www[\\\/]config.xml/;

        spyOn(apiUtil, "isValidProject").andReturn(true);
        spyOn(fs, "readFile").andCallFake(function (filePath, options, callback) {
            callback(undefined, "abcde1234");
        });

        project_config.get({
            query: {
                path: "hellow1"
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith("hellow1");
        expect(fs.readFile).toHaveBeenCalled();
        expect(fs.readFile.mostRecentCall.args[0]).toMatch(configPathRE);
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            configFile: "abcde1234"
        });
    });

    it("sends 500 if project is invalid", function () {
        spyOn(apiUtil, "isValidProject").andReturn(false);
        spyOn(fs, "readFile");

        project_config.get({
            query: {
                path: "hellow1"
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith("hellow1");
        expect(fs.readFile).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));
    });
});

