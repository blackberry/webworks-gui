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
    cp = require("child_process"),
    os = require("os"),
    path = require("path"),
    config = require("../../config.json"),
    app = express(),
    port = config.port ? config.port : 3000,
    command = os.type().toLowerCase().indexOf("windows") >= 0 ? "start" : "open",
    api = require("./api");

cp.exec(command + " http://localhost:" + port);

app.use(express.static(path.resolve(__dirname, path.join("..", "..", "public"))));

app.get("/", function (req, res) {
    res.sendfile(path.resolve(__dirname, path.join("..", "..", "public", "index.html")));
});

Object.getOwnPropertyNames(api).forEach(function (cmd) {
    app.get("/" + cmd, api[cmd]);
});

app.listen(port);
console.log("Listening on port " + port);
