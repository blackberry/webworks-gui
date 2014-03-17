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
    .addMessage("en", "accessentry", "This value must be a valid URL or *");

    window.ParsleyValidator
    .addValidator("imagefile", function (value, requirement) {
        var extensionRegex = /\.(png|jpg|jpeg|gif)$/g;

        return extensionRegex.test(value.trim());
    }, 32)
    .addMessage("en", "imagefile", "This value must have a valid image file extension: png, jpg, jpeg, gif");

    window.ParsleyValidator
    .addValidator("plugin", function (value, requirement) {
        var spaceRegex = /\s/g,
            urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        value = value.trim();

        if (urlRegex.test(value)) {
            return true;
        } else if (!spaceRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    }, 32)
    .addMessage("en", "plugin", "This value must be a valid plugin name or URL");
}

Validators = {
    register: register
};

module.exports = Validators;
