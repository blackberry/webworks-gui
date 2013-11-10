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
var util = require("util"),
    path = require("path"),
    fs = require("fs"),
    wrench = require("wrench"),
    shell = require("shelljs"),
    testUtil = require("./testUtil"),
    config = require("../../config.json"),
    VALID_PROJECT_PATH = "test/integration/testp1",
    FULL_VALID_PROJECT_PATH = path.resolve(process.cwd(), VALID_PROJECT_PATH);

describe("plugin", function () {
    beforeEach(function () {
        if (!fs.existsSync(FULL_VALID_PROJECT_PATH)) {
            var cmd = "%s/webworks create %s";
            shell.exec(util.format(cmd, config.ww, FULL_VALID_PROJECT_PATH));
        }
    });

    afterEach(function () {
        if (fs.existsSync(FULL_VALID_PROJECT_PATH)) {
            wrench.rmdirSyncRecursive(FULL_VALID_PROJECT_PATH, true);
        }
    });

    it("adds plugin to project", function () {
        var cb = jasmine.createSpy().andCallFake(function (res, body) {
                var result = JSON.parse(body);
                expect(result.success).toBeTruthy();
                expect(result.code).toEqual(0);
                expect(result.path).toEqual(FULL_VALID_PROJECT_PATH);
                expect(result.cmd).toEqual("add");
                expect(result.args).toEqual("com.blackberry.app");
                expect(result.stdout).toEqual(jasmine.any(String));
                expect(result.stderr).toEqual(jasmine.any(String));
            });

        testUtil.httpGet(testUtil.getTestURL("plugin", {
            path: FULL_VALID_PROJECT_PATH,
            cmd: "add",
            args: "com.blackberry.app"
        }), cb);

        waitsFor(function () {
            return cb.wasCalled;
        }, "callback never called", 15000);
    });
});
