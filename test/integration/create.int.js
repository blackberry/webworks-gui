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
var fs = require("fs"),
    path = require("path"),
    util = require("util"),
    wrench = require("wrench"),
    testUtil = require("./testUtil"),
    PROJECT_PATH = "test/integration/testp1",
    FULL_PROJECT_PATH = path.resolve(process.cwd(), PROJECT_PATH);

describe("create", function () {
    afterEach(function () {
        if (fs.existsSync(FULL_PROJECT_PATH)) {
            wrench.rmdirSyncRecursive(FULL_PROJECT_PATH, true);
        }
    });

    it("creates webworks project", function () {
        var args = FULL_PROJECT_PATH,
            cb = jasmine.createSpy().andCallFake(function (res, body) {
                var result = JSON.parse(body);
                expect(fs.existsSync(FULL_PROJECT_PATH)).toBeTruthy();
                expect(result.success).toBeTruthy();
                expect(result.code).toEqual(0);
                expect(result.cmd).toEqual("create");
                expect(result.args).toEqual(args);
                expect(result.stdout).toEqual(jasmine.any(String));
                expect(result.stderr).toEqual(jasmine.any(String));
            });

        testUtil.httpGet(testUtil.getTestURL("create", {
            args: args
        }), cb);

        waitsFor(function () {
            return cb.wasCalled;
        }, "callback never called", 30000);
    });
});