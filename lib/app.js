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

var express = require("express"),
    fs = require("fs"),
    path = require("path"),
    app = express(),
    routePath = path.resolve(__dirname, path.join("..", "routes")),
    routes = fs.readdirSync(routePath);

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

// Add headers to all requests
app.all('/*', function (req, res, next){
    // Disable caching
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    next();
});

routes.forEach(function (file) {
    var route = require(path.resolve(routePath, file));
    Object.getOwnPropertyNames(route).forEach(function (cmd) {
        app[cmd]("/" + path.basename(file, '.js'), route[cmd]);
    });
});

module.exports = app;
