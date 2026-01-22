"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectQuery = selectQuery;
exports.modifyQuery = modifyQuery;
const mysql_1 = require("../loaders/mysql");
//get
async function selectQuery(query_string, params) {
    //const [results] = await pool.execute(query_string);
    //return results as T[];
    return new Promise((resolve, reject) => {
        (0, mysql_1.get)().query(query_string, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}
//update/delete/insert
async function modifyQuery(query_string, params) {
    //const [results] = await pool.execute(query_string);
    //return results as ResultSetHeader;
    return new Promise((resolve, reject) => {
        (0, mysql_1.get)().execute(query_string, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}
//# sourceMappingURL=util.js.map