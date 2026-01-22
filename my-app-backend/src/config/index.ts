import dotenv from 'dotenv';

const env_found = dotenv.config();

if (env_found.error) {
  throw new Error('no .env file found')
}
export default {
  app: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    the_movie_db_api_key: process.env.TMDB_API_KEY
  },
  db: {
    host: process.env.MYSQL_HOST,
    schema: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    pass: process.env.MYSQL_PASS
  }
}
