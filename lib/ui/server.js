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
var server,
    baseUrl = "/";

function sendRequest(type, requestType, options, success, error) {
    options = options || {};
    var requestUrl = baseUrl + type + "?",
        queryStringParams = {},
        option;

    for (option in options) {
        if (options.hasOwnProperty(option)) {
            queryStringParams[option] = options[option];
        }
    }
    requestUrl += $.param(queryStringParams);

    $.ajax({
        url: requestUrl,
        type: requestType,
        data: requestType === "put" ? options : undefined,
        success: function (result, textStatus, jqXHR) {
            var value = typeof result === "string" ? result : JSON.stringify(result);
            console.log(value);
            if (result.success && success) {
                success(result);
            } else if (error) {
                error(result);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (error) {
                error({status: jqXHR.status, error: jqXHR.responseJSON.error});
            }
        }
    });
}

server = {
    "create": sendRequest.bind(null, "create", "get"),
    "delete": sendRequest.bind(null, "delete", "get"),
    "project": sendRequest.bind(null, "project", "get"),
    "getProjectConfig": sendRequest.bind(null, "project_config", "get"),
    "setProjectConfig": sendRequest.bind(null, "project_config", "put"),
    "defaultProjectPath": sendRequest.bind(null, "defaultProjectPath", "get"),
    "resourceExists": sendRequest.bind(null, "resourceExists", "get"),
    "previewImage": sendRequest.bind(null, "previewImage", "get"),
    "plugins": sendRequest.bind(null, "plugin", "get"),
    "certificate": sendRequest.bind(null, "certificate", "get")
};

module.exports = server;
