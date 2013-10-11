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
    config = require(root + "routes/config"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("config", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("returns blackberry10.json content if it exists", function () {
        spyOn(fs, "existsSync").andReturn(true);

        config.get({}, mockResponse);

        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            config: require(path.join(process.env.HOME, ".cordova", "blackberry10.json"))
        });
    });

    it("sends 500 if blackberry10.json does not exist", function () {
        spyOn(fs, "existsSync").andReturn(false);

        config.get({}, mockResponse);

        expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));
    });
});

