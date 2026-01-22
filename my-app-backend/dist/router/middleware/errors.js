"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.globalErrorHandler = globalErrorHandler;
function notFoundHandler(req, res, next) {
    const error = new Error(`path ${req.originalUrl} not found`);
    error['status'] = 404;
    next(error);
}
function globalErrorHandler(error, req, res, next) {
    console.log(error.message);
    res.status(error['status'] || 500);
    res.json({ error: { message: error.message } });
}
//# sourceMappingURL=errors.js.map