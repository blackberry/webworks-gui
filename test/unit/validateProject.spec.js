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
    apiUtil = require(root + "lib/util"),
    validateProject = require(root + "routes/validateProject"),
    mockResponse = {
        send: jasmine.createSpy()
    };

describe("validateProject", function () {
    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("return true if project path, config.xml and cordova folders exist", function () {
        var projectPath = "hello1";

        spyOn(apiUtil, "isValidProject").andReturn(true);

        validateProject.get({
            query: {
                path: projectPath
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith(projectPath);
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            isValid: true
        });
    });

    it("return false if project path does not exist", function () {
        var projectPath = "hello1";

        spyOn(apiUtil, "isValidProject").andReturn(false);

        validateProject.get({
            query: {
                path: projectPath
            }
        }, mockResponse);

        expect(apiUtil.isValidProject).toHaveBeenCalledWith(projectPath);
        expect(mockResponse.send).toHaveBeenCalledWith(200, {
            isValid: false
        });
    });
});
