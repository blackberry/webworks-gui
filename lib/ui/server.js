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

    $[requestType](requestUrl, function (result) {
        var value = typeof result === "string" ? result : JSON.stringify(result);
        console.log(value);
        if (result.success && success) {
            success(result);
        } else if (error) {
            error(result);
        }
    });
}

server = {
    "create": sendRequest.bind(null, "create", "get"),
    "delete": sendRequest.bind(null, "delete", "get"),
    "getProjectConfig": sendRequest.bind(null, "project_config", "get"),
    "setProjectConfig": sendRequest.bind(null, "project_config", "put")
};

module.exports = server;
