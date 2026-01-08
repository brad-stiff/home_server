import { selectQuery } from "../util";
import type { UserLevel } from "../../types/user"

//getUser

//getUsers

//insertUser //idk how to do the autoincrement if i were to combine insert/update
///how do i handle password?

//updateUser
///how do i handle password




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
