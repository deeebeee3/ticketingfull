"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
var custom_error_1 = require("./custom-error");
var RequestValidationError = /** @class */ (function (_super) {
    __extends(RequestValidationError, _super);
    //private errs: ValidationError[];
    function RequestValidationError(errors, statusCode) {
        if (statusCode === void 0) { statusCode = 400; }
        var _this = _super.call(this, "Invalid request parameters") || this;
        _this.errors = errors;
        _this.statusCode = statusCode;
        //this.errs = errors;
        //Only because we are extencing a built in class
        Object.setPrototypeOf(_this, RequestValidationError.prototype);
        return _this;
    }
    RequestValidationError.prototype.serializeErrors = function () {
        return this.errors.map(function (err) {
            return { message: err.msg, field: err.param };
        });
    };
    return RequestValidationError;
}(custom_error_1.CustomError));
exports.RequestValidationError = RequestValidationError;
