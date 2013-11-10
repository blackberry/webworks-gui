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
    testUtil = require("./testUtil");

describe("config", function () {
    it("returns content of blackberry10.json", function () {
        var cb = jasmine.createSpy().andCallFake(function (res, body) {
                var result = JSON.parse(body);
                expect(result.config).toBeDefined();
            });

        testUtil.httpGet(testUtil.getTestURL("config", {}), cb);

        waitsFor(function () {
            return cb.wasCalled;
        }, "callback never called", 15000);
    });
});
