"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
exports.createEmptyField = function () {
    return {
        value: null,
        originalValue: null,
        didBlur: false,
        touched: false
    };
};
exports.getInitialFieldState = function (value, copyFrom) {
    var field = copyFrom ? index_1.clone(copyFrom) : exports.createEmptyField();
    field.value = value ? index_1.clone(value) : null;
    field.originalValue = value ? index_1.clone(value) : null;
    return field;
};
function reinitializeState(val, formState) {
    return index_1.transform(val, function (ret, fieldValue, fieldName) {
        ret[fieldName] = exports.getInitialFieldState(fieldValue, formState[fieldName]);
        return ret;
    });
}
exports.reinitializeState = reinitializeState;
function initializeState(val) {
    return index_1.transform(val, function (ret, fieldValue, fieldName) {
        ret[fieldName] = exports.getInitialFieldState(fieldValue);
        return ret;
    });
}
exports.default = initializeState;
//# sourceMappingURL=getInitialState.js.map