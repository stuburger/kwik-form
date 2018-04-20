"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateField(fieldName, form, validators) {
    if (validators === void 0) { validators = []; }
    var messages = [];
    var value = form[fieldName];
    for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
        var validate = validators_1[_i];
        var message = validate(value, form, fieldName);
        if (message) {
            messages.push(message);
        }
    }
    return messages;
}
exports.default = validateField;
//# sourceMappingURL=validateField.js.map