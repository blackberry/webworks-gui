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
    wrench = require("wrench"),
    defaultProjectPath = require(root + "routes/defaultProjectPath"),
    apiUtil = require(root + "lib/util"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("defaultProjectPath", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("returns the first non-existent project folder", function () {
        spyOn(fs, "existsSync").andCallFake(function (p) {
            if (/WebWorks Projects$/.test(p)) {
                return false;
            } else if (/2$/.test(p)) {
                return false;
            } else if (/1$/.test(p)) {
                return true;
            }
        });
        spyOn(wrench, "mkdirSyncRecursive");
        spyOn(apiUtil, "getUserHome").andCallThrough();

        defaultProjectPath.get(undefined, mockResponse);

        expect(apiUtil.getUserHome).toHaveBeenCalled();
        expect(wrench.mkdirSyncRecursive).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            success: true,
            path: path.join(apiUtil.getUserHome(), "WebWorks Projects", "Project2"),
            name: "Project2"
        });
    });
});

