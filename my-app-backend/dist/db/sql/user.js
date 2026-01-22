"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.insertUser = insertUser;
exports.getUserPasswordHash = getUserPasswordHash;
exports.getUserLevels = getUserLevels;
const util_1 = require("../util");
//getUser
//getUsers
function getUsers(users_request) {
    const params = [];
    const wheres = [];
    const active = users_request.active !== undefined ? users_request.active > 0 : true;
    const exact_match = users_request.exact_match !== undefined ? users_request.exact_match > 0 : false;
    if (users_request.id) {
        const ids = Array.isArray(users_request.id) ? users_request.id : [users_request.id];
        wheres.push(`u.id IN (?)`);
        params.push(ids);
    }
    if (users_request.email_search_str) {
        wheres.push(`u.email ${exact_match ? '=' : 'ILIKE'} ?`);
        params.push(users_request.email_search_str);
    }
    if (users_request.name_search_str) {
        console.log('unimplemented');
    }
    wheres.push(`active = ${active ? '1' : '0'}`);
    let where_clause = '';
    if (wheres.length > 0) {
        where_clause = 'WHERE ' + wheres.join(' AND ');
    }
    return (0, util_1.selectQuery)(`
    SELECT
      u.id,
      u.active,
      u.user_level,
      u.email,
      u.first_name,
      u.last_name,
      u.avatar_img_data,
      u.created_at,
      u.updated_at
    FROM
      user u
    ${where_clause}
  `, params);
}
function insertUser(new_user) {
    return (0, util_1.selectQuery)(`
    INSERT INTO user (
      email,
      password_hash
    ) VALUES (
      ?,
      ?
    )
  `, [
        new_user.email,
        new_user.password_hash
    ]);
}
//updateUser
///how do i handle password
function getUserPasswordHash(email) {
    return (0, util_1.selectQuery)(`
      SELECT
        u.password_hash
      FROM
        user u
      WHERE
        u.email = ?;
    `, [email]);
}
function getUserLevels() {
    return (0, util_1.selectQuery)(`
    SELECT
      ul.id,
      ul.display_name,
      ul.active
    FROM
      user_level ul;
  `);
}
//# sourceMappingURL=user.js.map