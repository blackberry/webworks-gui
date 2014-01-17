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

    describe("get", function () {
        it("return config.xml content if it exists", function () {
            var configPathRE = /hellow1[\\\/]config.xml/;

            spyOn(apiUtil, "isValidProject").andReturn(true);
            spyOn(fs, "readFile").andCallFake(function (filePath, options, callback) {
                callback(undefined, "<widget id=\"Project 1\"></widget>");
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
                configFile: {
                    widget: {
                        id: "Project 1"
                    }
                }
            });
        });

        it("return www/config.xml content if it exists", function () {
            var configPathRE = /hellow1[\\\/]www[\\\/]config.xml/;

            spyOn(apiUtil, "isValidProject").andReturn(true);
            spyOn(apiUtil, "getProjectConfigPath").andReturn("/hellow1/www/config.xml");
            spyOn(fs, "readFile").andCallFake(function (filePath, options, callback) {
                callback(undefined, "<widget id=\"Project 1\"></widget>");
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
                configFile: {
                    widget: {
                        id: "Project 1"
                    }
                }
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

    describe("put", function () {
        it("calls writeFile to config.xml if project path is valid", function () {
            var configPathRE = /hellow1[\\\/]config.xml/;

            spyOn(apiUtil, "isValidProject").andReturn(true);
            spyOn(fs, "writeFile").andCallFake(function (filePath, data, options, callback) {
                callback(undefined);
            });

            project_config.put({
                body: {
                    path: "hellow1",
                    data: "<hello><world id=\"1\" /></hello>"
                }
            }, mockResponse);

            expect(apiUtil.isValidProject).toHaveBeenCalledWith("hellow1");
            expect(fs.writeFile).toHaveBeenCalled();
            expect(fs.writeFile.mostRecentCall.args[0]).toMatch(configPathRE);
            expect(mockResponse.send).toHaveBeenCalledWith(200, {
                success: true,
                error: undefined
            });
        });

        it("calls writeFile to www/config.xml if project path is valid", function () {
            var configPathRE = /hellow1[\\\/]www[\\\/]config.xml/;

            spyOn(apiUtil, "isValidProject").andReturn(true);
            spyOn(apiUtil, "getProjectConfigPath").andReturn("/hellow1/www/config.xml");
            spyOn(fs, "writeFile").andCallFake(function (filePath, data, options, callback) {
                callback(undefined);
            });

            project_config.put({
                body: {
                    path: "hellow1",
                    data: "<hello><world id=\"1\" /></hello>"
                }
            }, mockResponse);

            expect(apiUtil.isValidProject).toHaveBeenCalledWith("hellow1");
            expect(fs.writeFile).toHaveBeenCalled();
            expect(fs.writeFile.mostRecentCall.args[0]).toMatch(configPathRE);
            expect(mockResponse.send).toHaveBeenCalledWith(200, {
                success: true,
                error: undefined
            });
        });
        it("sends 500 if project is invalid", function () {
            spyOn(apiUtil, "isValidProject").andReturn(false);
            spyOn(fs, "writeFile");

            project_config.put({
                body: {
                    path: "hellow1",
                    xmlContent: "<hello><world id=\"1\" /></hello>"
                }
            }, mockResponse);

            expect(apiUtil.isValidProject).toHaveBeenCalledWith("hellow1");
            expect(fs.writeFile).not.toHaveBeenCalled();
            expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));
        });
    });
});

