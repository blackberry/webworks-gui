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
        spyOn(cp, "exec").andCallFake(function (execStr, callback, callback2) {
            if (typeof callback === "function") {
                callback(undefined, "", "");
            } else if (typeof callback2 === "function") {
                callback2(undefined, "", "");
            }
        });

        project.get({
            connection: {
                setTimeout: jasmine.createSpy()
            },
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
            cmd: projectPath + "/platforms/blackberry10/cordova/" + cmd,
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
            connection: {
                setTimeout: jasmine.createSpy()
            },
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

    it("sends 500 if prepare fails", function () {
        var projectPath = "hellow1",
            cmd = "build";

        spyOn(apiUtil, "isValidProject").andReturn(false);
        spyOn(cp, "exec").andCallFake(function (execString, args, callback) {
            callback("BAD TIMES");
        });

        project.get({
            connection: {
                setTimeout: jasmine.createSpy()
            },
            query: {
                path: projectPath,
                cmd: cmd,
                args: ""
            }
        }, mockResponse);

        expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));

    });
});
