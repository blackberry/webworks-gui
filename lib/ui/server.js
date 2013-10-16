var server,
    baseUrl = "/";

function sendRequest(type, options, success, error) {
    var requestUrl = baseUrl + type + "?";

    requestUrl += $.param({
        path: options.path,
        cmd: options.cmd,
        args: options.args
    });

    $.get(requestUrl, function (result) {
        var value = typeof result === "string" ? result : JSON.stringify(result);
        console.log(value);
    });
}

server = {
    "create": sendRequest.bind(null, "create"),
    "delete": sendRequest.bind(null, "delete")
};

module.exports = server;
