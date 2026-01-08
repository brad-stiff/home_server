//import mysql from 'mysql2/promise'
import config from '../config'
import { createPool } from 'mysql2'
import type { PoolConnection, Pool } from 'mysql2';

const state: { pool: Pool } = {
  pool: null
};

export function get(): Pool {
  return state.pool
}

export default async function () {
  state.pool = createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.pass,
    database: config.db.schema,
    connectionLimit: 10,
    maxIdle: 10
  });
}
