var Validators;

function register() {

    window.ParsleyValidator
    .addValidator("accessentry", function (value, requirement) {
        var isValid = false,
            protocolRegex = /^(https?:\/\/.+)|(file:\/\/\/.*)/g;

        if (protocolRegex.test(value)) {
            isValid = true;
        } else if (value === "*") {
            isValid = true;
        }

        return isValid;
    }, 32)
    .addMessage("en", "accessentry", "This value must be a valid URL or *.");

    window.ParsleyValidator
    .addValidator("imagefile", function (value, requirement) {
        var extensionRegex = /\.(png|jpg|jpeg|gif)$/g;

        return extensionRegex.test($.trim(value));
    }, 32)
    .addMessage("en", "imagefile", "This value must have a valid image file extension: png, jpg, jpeg, gif.");

    window.ParsleyValidator
    .addValidator("forwardslash", function (value, requirement) {
        var extensionRegex = /\\/g;

        return !extensionRegex.test($.trim(value));
    }, 32)
    .addMessage("en", "forwardslash", "This value must use forward slashes to be part of a valid url.");

    window.ParsleyValidator
    .addValidator("plugin", function (value, requirement) {
        var spaceRegex = /\s/,
            urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        value = $.trim(value);

        if (urlRegex.test(value)) {
            return true;
        } else if (!spaceRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    }, 32)
    .addMessage("en", "plugin", "This value must be a valid plugin name or URL.");

    window.ParsleyValidator
    .addValidator("ipaddress", function (value, requirement) {
        var ipAddressRegex = /^((([2][5][0-5]|([2][0-4]|[1][0-9]|[0-9])?[0-9])\.){3})([2][5][0-5]|([2][0-4]|[1][0-9]|[0-9])?[0-9])$/;

        return ipAddressRegex.test($.trim(value));
    }, 32)
    .addMessage("en", "ipaddress", "This value must be a valid IP address.");

    window.ParsleyValidator
    .addValidator("devicepin", function (value, requirement) {
        var devicePinRegex = /^[a-zA-Z0-9]{8}$/;

        return devicePinRegex.test($.trim(value));
    }, 32)
    .addMessage("en", "devicepin", "This value must be a valid device PIN.");

    window.ParsleyValidator
    .addValidator("targetname", function (value, requirement) {
        var spaceRegex = /\s/;

        //more checks will be required here
        return !spaceRegex.test(value);
    }, 32)
    .addMessage("en", "targetname", "This value cannot have spaces.");

    window.ParsleyValidator
    .addValidator("devicepassword", function (value, requirement) {
        var fourLimitRegex = /^.{4,}$/;

        return fourLimitRegex.test($.trim(value));
    }, 32)
    .addMessage("en", "devicepassword", "This value must have at least 4 characters.");
}

Validators = {
    register: register
};

module.exports = Validators;
