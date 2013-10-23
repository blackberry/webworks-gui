var server,
    baseUrl = "/";

function sendRequest(type, options, success, error) {
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

    $.get(requestUrl, function (result) {
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
    "create": sendRequest.bind(null, "create"),
    "delete": sendRequest.bind(null, "delete")
};

module.exports = server;
