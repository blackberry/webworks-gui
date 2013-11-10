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
    http = require("http"),
    querystring = require("querystring"),
    config = require("../../config.json"),
    port = config.port;

module.exports = {
    getTestURL: function (route, query) {
        var url = "http://localhost:%s/%s";

        url = util.format(url, port, route);

        if (query) {
            url += "?" + querystring.stringify(query);
        }

        return url;
    },
    httpGet: function (url, callback, error) {
        var req = http.get(url, function (res) {
            var body = "";

            res.on("data", function (chunk) {
                body += chunk;
            }).on("end", function () {
                callback(res, body);
            });
        });

        if (error) {
            req.on("error", error);
        }

        req.end();
    },
    httpPost: function (options, postData, callback, error) {
        options.port = port;

        var req = http.request(options, function (res) {
            var body = "";
            res.on("data", function (chunk) {
                body += chunk;
            }).on("end", function () {
                callback(res, body);
            });
        });

        if (error) {
            req.on("error", error);
        }

        req.write(postData);
        req.end();
    }
};