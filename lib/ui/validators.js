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

}



Validators = {
    register: register
};

module.exports = Validators;
