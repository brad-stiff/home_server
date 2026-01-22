"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = get;
exports.default = default_1;
//import mysql from 'mysql2/promise'
const config_1 = __importDefault(require("../config"));
const mysql2_1 = require("mysql2");
const state = {
    pool: null
};
function get() {
    return state.pool;
}
async function default_1() {
    state.pool = (0, mysql2_1.createPool)({
        host: config_1.default.db.host,
        user: config_1.default.db.user,
        password: config_1.default.db.pass,
        database: config_1.default.db.schema,
        connectionLimit: 10,
        maxIdle: 10
    });
}
//# sourceMappingURL=mysql.js.map