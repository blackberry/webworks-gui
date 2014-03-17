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
}



Validators = {
    register: register
};

module.exports = Validators;
