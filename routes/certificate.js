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
var fs = require("fs"),
    cp = require("child_process"),
    os = require("os"),
    util = require("util"),
    projectUtil = require("../lib/util"),
    path = require("path"),
    isWinXp = (os.platform() === "win32") && (os.release().split(".")[0] === "5"),
    winXpPath = process.env.USERPROFILE + "\\Local Settings\\Application Data\\Research In Motion",
    osPaths = {
        "win32": isWinXp ? path.resolve(winXpPath) : process.env.LOCALAPPDATA + "\\Research In Motion",
        "darwin": process.env.HOME + "/Library/Research\ In\ Motion",
        "linux": process.env.HOME + "/.rim"
    },
    osPath = path.normalize(osPaths[os.platform()]),
    bbtoolsPath = path.resolve(__dirname + "/../../cordova-blackberry/bin/dependencies/bb-tools/bin/"),
    keytoolCmd = "blackberry-keytool",
    signerCmd = "blackberry-signer";

function fileSuffix() {
    return projectUtil.isWindows() ? ".bat" : "";
}

function checkForBarSigner() {
    var filepath = path.join(osPath, "barsigner.csk");
    return fs.existsSync(filepath) ? filepath : undefined;
}

function checkForBBIDToken() {
    var filepath = path.join(osPath, "bbidtoken.csk");
    return fs.existsSync(filepath) ? filepath : undefined;
}

function checkForDevCert() {
    var filepath = path.join(osPath, "author.p12");
    return fs.existsSync(filepath) ? filepath : undefined;
}

function getState(callback) {
    var state = {
        bbidToken: checkForBBIDToken(),
        barSigner: checkForBarSigner(),
        devCert: checkForDevCert()
    };
    callback(undefined, state);
}

function addSigningKey(keyPath, callback) {
    // copy to OS location
    try {
        projectUtil.copyFile(path.resolve(keyPath), osPath);
    } catch (e) {
        callback(e, e.message);
    }
    callback();
}

/* params.js */
function getProperties() {
    var json = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.cordova', 'blackberry10.json');
    try {
        return require(json);
    } catch (e) {
        return null;
    }
}

function mixin(mixin, to) {
    Object.getOwnPropertyNames(mixin).forEach(function (prop) {
        if (Object.hasOwnProperty.call(mixin, prop)) {
            Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(mixin, prop));
        }
    });
    return to;
}

function getParams(toolName, cmdParams) {
    var properties = getProperties(),
        params = properties[toolName];

    if (cmdParams) {
        if (params) {
            params = mixin(cmdParams, params);
        } else {
            params = cmdParams;
        }
    }

    return params;
}


function createDevCertificate(keystorePass, companyName, callback) {
    // create author.p12, proper placement is done by keytool
    var params = {
            "-storepass": keystorePass,
            '-dname': '"cn=' + companyName + '"'
        },
        args = [
            keytoolCmd + fileSuffix(),
            "-genkeypair",
        ],
        execStr;
    params = getParams(keytoolCmd, params);
    Object.getOwnPropertyNames(params).forEach(function (prop) {
        args = args.concat([prop, params[prop]]);
    });
    execStr = args.join(" ");

    // run command
    cp.exec(execStr, {
        cwd: bbtoolsPath
    }, callback);
}

function linkSigningKeys(barSignerPass, bbidTokenPass, callback) {
    // link barsigner.csk to bbidtoken.csk
    var params = {
            "-oldcskpass": barSignerPass,
            "-bbidcskpass": bbidTokenPass
        },
        args = [
            signerCmd + fileSuffix(),
            "-linkcsk"
        ];
    params = getParams(signerCmd, params);
    Object.getOwnPropertyNames(params).forEach(function (prop) {
        args = args.concat([prop, params[prop]]);
    });
    execStr = args.join(" ");

    // run command
    cp.exec(execStr, {
        cwd: bbtoolsPath
    }, callback);
}

module.exports = {

    get: function (req, res) {
        var projectPath = req.query.path,
            cmd = req.query.cmd,
            args = req.query.args,
            callback = function (error, stdout, stderr) {
                res.send(200, {
                    success: !error,
                    code: error ? error.code : 0,
                    cmd: cmd,
                    args: args,
                    stdout: stdout,
                    stderr: stderr
                });
            };

            if (cmd === "state") {
                getState(callback);
            } else if (cmd === "add") {
                addSigningKey(req.query.path, callback);
            } else if (cmd === "createDevCert") {
                createDevCertificate(req.query.keystorePass, req.query.companyName, callback);
            } else if (cmd === "linkSigningKeys") {
                addSigningKey(req.query.path, function () {
                    linkSigningKeys(req.query.barSignerPass, req.query.bbidTokenPass, callback);
                });
            } else {
                // Unsupported
                callback({code: -1}, "", "Unsupported command");
            }
    }
};
