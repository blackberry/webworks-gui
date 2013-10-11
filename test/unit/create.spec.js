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
    cp = require("child_process"),
    path = require("path"),
    create = require(root + "routes/create"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("create", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("calls webworks-cli create", function () {
        spyOn(cp, "exec").andCallFake(function (execStr, callback) {
            callback();
        });

        create.get({
            query: {
                args: "hellow1"
            },
        }, mockResponse);

        expect(cp.exec).toHaveBeenCalled();
        console.log(cp.exec.mostRecentCall.args);
        expect(cp.exec.mostRecentCall.args[0]).toMatch(/webworks"\screate\shellow1/);
        expect(mockResponse.send).toHaveBeenCalledWith(200, jasmine.any(Object));
    });

});

