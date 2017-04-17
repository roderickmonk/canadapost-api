'use strict';
class ApiError extends Error {
    constructor(message, code = 503) {
        super();
        this.message = message;
        this.code = code;
    }
}
exports.ApiError = ApiError;
