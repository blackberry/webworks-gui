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
    globalFunc = require(root + "bin/lib/global"),
    apiUtil = require(root + "bin/lib/util"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("global", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("calls specified command if it exists", function () {
        var cmdRE = new RegExp("cordova-blackberry[\\\/]bin[\\\/]build" + (apiUtil.isWindows() ? ".bat" : ""));

        spyOn(apiUtil, "isWindows").andCallThrough();
        spyOn(fs, "existsSync").andReturn(true);
        spyOn(cp, "exec").andCallFake(function (execStr, callback) {
            callback(undefined, "", "");
        });

        globalFunc({
            query: {
                cmd: "build",
                args: ""
            }
        }, mockResponse);

        expect(apiUtil.isWindows).toHaveBeenCalled();
        expect(fs.existsSync).toHaveBeenCalled();
        expect(cp.exec).toHaveBeenCalled();
        expect(cp.exec.mostRecentCall.args[0]).toMatch(cmdRE);
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            code: 0,
            cmd: "build",
            args: "",
            stdout: "",
            stderr: ""
        });
    });

    it("sends 500 if cmd does not exist", function () {
        spyOn(fs, "existsSync").andReturn(false);
        spyOn(cp, "exec");

        globalFunc({
            query: {
                cmd: "build",
                args: ""
            }
        }, mockResponse);

        expect(fs.existsSync).toHaveBeenCalled();
        expect(cp.exec).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));
    });
});

