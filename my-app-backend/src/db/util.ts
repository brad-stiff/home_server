import type { ResultSetHeader } from 'mysql2/promise'

import { get } from '../loaders/mysql'

//get
export async function selectQuery<T>(query_string: string) {
  //const [results] = await pool.execute(query_string);
  //return results as T[];
  return new Promise<T[]>((resolve, reject) => {
    get().query(query_string, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results as T[]);
    });
  });
}

//update/delete/insert
export async function modifyQuery<T>(query_string: string): Promise<ResultSetHeader> {
  //const [results] = await pool.execute(query_string);
  //return results as ResultSetHeader;

  return new Promise<ResultSetHeader>((resolve, reject) => {
    get().execute(query_string, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results as ResultSetHeader);
    });
  });
}
