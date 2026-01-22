"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("../router"));
const errors_1 = require("../router/middleware/errors");
async function default_1({ app }) {
    app.get('/status', (req, res) => res.sendStatus(200).end());
    app.head('/status', (req, res) => res.sendStatus(200).end());
    app.enable('trust proxy');
    //middlewares
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    //routes
    app.use('/api', router_1.default);
    //error handlers
    app.use(errors_1.notFoundHandler);
    app.use(errors_1.globalErrorHandler);
}
//# sourceMappingURL=express.js.map