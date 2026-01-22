"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const express_1 = __importDefault(require("./express"));
const mysql_1 = __importDefault(require("./mysql"));
async function default_1({ app }) {
    await (0, mysql_1.default)();
    console.log('mysql loaded');
    await (0, express_1.default)({ app });
    console.log('express loaded');
}
//# sourceMappingURL=index.js.map