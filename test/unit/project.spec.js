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
    cp = require("child_process"),
    path = require("path"),
    project = require(root + "routes/project"),
    apiUtil = require(root + "lib/util"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("project", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("calls project command if it is a valid project", function () {
        var projectPath = "hellow1",
            cmd = "build";

        spyOn(apiUtil, "isValidProject").andReturn(true);
        spyOn(fs, "existsSync").andReturn(true);
        spyOn(cp, "exec").andCallFake(function (execStr, callback) {
            callback(undefined, "", "");
        });

        project.get({
            query: {
                path: projectPath,
                cmd: cmd,
                args: ""
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith(projectPath);
        expect(cp.exec).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            code: 0,
            path: projectPath,
            cmd: cmd,
            args: "",
            stdout: "",
            stderr: ""
        });
    });

    it("sends 500 if project is not valid", function () {
        var projectPath = "hellow1",
            cmd = "build";

        spyOn(apiUtil, "isValidProject").andReturn(false);
        spyOn(cp, "exec");

        project.get({
            query: {
                path: projectPath,
                cmd: cmd,
                args: ""
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith(projectPath);
        expect(cp.exec).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));
    });
});
