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
    plugin = require(root + "routes/plugin"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("plugin", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("calls webworks-cli plugin", function () {
        spyOn(fs, "existsSync").andReturn(true);
        spyOn(cp, "exec").andCallFake(function (execStr, options, callback) {
            callback(undefined, "", "");
        });

        plugin.get({
            query: {
                path: "hellow1",
                cmd: "add",
                args: "com.blackberry.app"
            }
        }, mockResponse);

        expect(fs.existsSync).toHaveBeenCalled();
        expect(cp.exec).toHaveBeenCalled();
        expect(cp.exec.mostRecentCall.args[0]).toMatch(/webworks\splugin\sadd\scom.blackberry.app/);
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            code: 0,
            path: "hellow1",
            cmd: "add",
            args: "com.blackberry.app",
            stdout: "",
            stderr: ""
        });
    });
});

