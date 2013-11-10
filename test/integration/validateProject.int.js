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
var cp = require("child_process"),
    util = require("util"),
    path = require("path"),
    fs = require("fs"),
    wrench = require("wrench"),
    testUtil = require("./testUtil"),
    config = require("../../config.json"),
    VALID_PROJECT_PATH = "test/integration/testp1",
    FULL_VALID_PROJECT_PATH = path.resolve(process.cwd(), VALID_PROJECT_PATH);

describe("validateProject", function () {
    afterEach(function () {
        if (fs.existsSync(FULL_VALID_PROJECT_PATH)) {
            wrench.rmdirSyncRecursive(FULL_VALID_PROJECT_PATH, true);
        }
    });

    it("return isValid=false for non-existent project", function () {
        var cb = jasmine.createSpy().andCallFake(function (res, body) {
                var result = JSON.parse(body);
                expect(result.isValid).toBeFalsy();
            });

        testUtil.httpGet(testUtil.getTestURL("validateProject", {
            path: "blah"
        }), cb);

        waitsFor(function () {
            return cb.wasCalled;
        }, "callback never called", 15000);
    });

    it("return isValid=true for a project that exists", function () {
        var cmd = "%s/webworks create %s",
            cb2 = jasmine.createSpy().andCallFake(function (res, body) {
                    var result = JSON.parse(body);
                    expect(result.isValid).toBeTruthy();
                }),
            cb = jasmine.createSpy().andCallFake(function (err, stdout, stderr) {
                    if (!err) {
                        testUtil.httpGet(testUtil.getTestURL("validateProject", {
                            path: FULL_VALID_PROJECT_PATH
                        }), cb2);
                    } else {
                        console.log("error create project");
                    }
                });

        cp.exec(util.format(cmd, config.ww, FULL_VALID_PROJECT_PATH), cb);

        waitsFor(function () {
            return cb.wasCalled;
        }, "webworks create callback never called", 15000);

        waitsFor(function () {
            return cb2.wasCalled;
        }, "callback never called", 15000);
    });
});
