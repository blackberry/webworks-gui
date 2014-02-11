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
    wrench = require("wrench"),
    deleteAPI = require(root + "routes/delete"),
    mockResponse = {
        send: jasmine.createSpy(),
        header: jasmine.createSpy()
    };

describe("delete", function () {
    var pathToProject = "/path/to/project";

    beforeEach(function () {
        spyOn(console, "log");
    });

    afterEach(function () {
        mockResponse.send.reset();
    });

    it("deletes given project path if it is valid", function () {
        spyOn(fs, "existsSync").andReturn(true);
        spyOn(wrench, "rmdirSyncRecursive");

        deleteAPI.get({
            query: {
                projectPath: pathToProject
            }
        }, mockResponse);

        expect(fs.existsSync).toHaveBeenCalled();
        expect(wrench.rmdirSyncRecursive).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(200, jasmine.any(Object));
    });

    it("sends 500 if given project path is not valid", function () {
        spyOn(wrench, "rmdirSyncRecursive");
        spyOn(fs, "existsSync").andCallFake(function (path) {
            //only return true if checking for project existence
            return path === pathToProject;
        });

        deleteAPI.get({
            query: {
                projectPath: pathToProject
            }
        }, mockResponse);

        expect(fs.existsSync).toHaveBeenCalled();
        expect(wrench.rmdirSyncRecursive).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(500, jasmine.any(Object));
    });

    it("sends 410 if given project no longer exists", function () {
        spyOn(fs, "existsSync").andCallFake(function (path) {
            //return false when checking for project existence
            return path !== pathToProject;
        });

        deleteAPI.get({
            query: {
                projectPath: pathToProject
            }
        }, mockResponse);

        expect(fs.existsSync).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(410, jasmine.any(Object));
    });
});

