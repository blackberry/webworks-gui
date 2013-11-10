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

var app = require("./app"),
    express = require("express"),
    cp = require("child_process"),
    os = require("os"),
    path = require("path"),
    config = require("../config.json"),
    text = require("./ui/text"),
    server,
    port = config.port ? config.port : 3000,
    command = os.type().toLowerCase().indexOf("windows") >= 0 ? "start" : "open";

app.use(express.static(path.resolve(__dirname, path.join("..", "public"))));

app.get("/", function (req, res) {
    res.sendfile(path.resolve(__dirname, path.join("..", "public", "index.html")));
});

server = app.listen(port);
server.on('listening',function(){
    console.log(text.SERVER_STARTUP + port);
});
server.on('error',function(err){
    if (err.code == 'EADDRINUSE') {
        console.log(text.SERVER_ERROR_PORT_TAKEN + port);
    } else {
        console.log(text.SERVER_ERROR_GENERIC + err.code);
    }
});

cp.exec(command + " http://localhost:" + port);
