import { selectQuery, modifyQuery } from "../util";
import type {
  User,
  UserRequest,
  UserLevel,
  UserRegisterRequest
} from "../../types/user"

export function getUser(id: number) {
  return selectQuery<User>(`
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
    WHERE
      u.id = ?;
  `, [id]);
}

export function getUsers(users_request: UserRequest) {
  const params = [];
  const wheres: string[] = [];

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

  let where_clause = ''
  if (wheres.length > 0) {
    where_clause = 'WHERE ' + wheres.join(' AND ')
  }
  return selectQuery<User>(`
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
  `, params)
}

export function insertUser(new_user: UserRegisterRequest) {
  return selectQuery<User>(`
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

//update password
export function updateUserPassword(update_password_request: { user_id: number, password_hash: string }) {
  return modifyQuery(`
    UPDATE user
    SET
      password_hash = ?,
      updated_at = NOW()
    WHERE
      id = ?
  `, [
    update_password_request.password_hash,
    update_password_request.user_id
  ]);
}

//update first name
export function updateUserFirstName(update_first_name_request: { user_id: number, name: string }) {
  return modifyQuery(`
    UPDATE user
    SET
      first_name = ?,
      updated_at = NOW()
    WHERE
      id = ?
  `, [
    update_first_name_request.name,
    update_first_name_request.user_id
  ]);
}

//update last name
export function updateUserLastName(update_last_name_request: { user_id: number, name: string }) {
  return modifyQuery(`
    UPDATE user
    SET
      last_name = ?,
      updated_at = NOW()
    WHERE
      id = ?
  `, [
    update_last_name_request.name,
    update_last_name_request.user_id,
  ]);
}

//update avatar img data
export function updateUserAvatar(update_avatar_request: { user_id: number, image_buffer: Buffer }) {
  return modifyQuery(`
    UPDATE user
    SET
      avatar_img_data = ?,
      updated_at = NOW()
    WHERE
      id = ?
  `, [
    update_avatar_request.image_buffer,
    update_avatar_request.user_id
  ]);
}

export function getUserPasswordHash(email: string) {
    return selectQuery<{password_hash:string}>(`
      SELECT
        u.password_hash
      FROM
        user u
      WHERE
        u.email = ?;
    `, [email])
}


export function getUserLevels() {
  return selectQuery<UserLevel>(`
    SELECT
      ul.id,
      ul.display_name,
      ul.active
    FROM
      user_level ul;
  `);
}
