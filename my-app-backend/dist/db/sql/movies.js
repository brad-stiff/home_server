"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovies = getMovies;
exports.insertMovie = insertMovie;
exports.deleteMovie = deleteMovie;
const util_1 = require("../util");
const mysql_1 = require("../../loaders/mysql");
async function getMovies() {
    const results = await (0, util_1.selectQuery)(`
    WITH movie_genres AS (
      SELECT
        movie_id,
        JSON_ARRAYAGG(genre_id) as genre_ids
      FROM movie_has_genre
      GROUP BY movie_id
    )
    SELECT
      m.id,
      m.tmdb_id,
      m.title,
      m.release_date,
      m.poster_path,
      m.backdrop_path,
      m.overview,
      m.added_at,
      mg.genre_ids
    FROM
      movie m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    WHERE
      m.active = 1
    ORDER BY m.added_at DESC
  `);
    // Post-process to ensure genre_ids is always an array (JSON_ARRAYAGG returns null for no results)
    return results.map(movie => (Object.assign(Object.assign({}, movie), { genre_ids: movie.genre_ids || [] })));
}
async function insertMovie(movie) {
    const connection = await new Promise((resolve, reject) => {
        (0, mysql_1.get)().getConnection((err, conn) => {
            if (err)
                reject(err);
            else
                resolve(conn);
        });
    });
    try {
        await new Promise((resolve, reject) => {
            connection.beginTransaction((err) => {
                if (err)
                    reject(err);
                else
                    resolve(undefined);
            });
        });
        // Insert movie
        const insertResult = await new Promise((resolve, reject) => {
            connection.execute(`
        INSERT INTO movie (
          tmdb_id,
          title,
          release_date,
          poster_path,
          backdrop_path,
          overview,
          added_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                movie.tmdb_id,
                movie.title,
                movie.release_date || null,
                movie.poster_path || null,
                movie.backdrop_path || null,
                movie.overview || null,
                movie.added_at || new Date()
            ], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
        const movieId = insertResult.insertId;
        // Insert genres if provided
        if (movie.genre_ids && movie.genre_ids.length > 0) {
            // Build dynamic SQL with multiple value placeholders
            const placeholders = movie.genre_ids.map(() => '(?, ?)').join(', ');
            const values = movie.genre_ids.flatMap(genreId => [movieId, genreId]);
            await new Promise((resolve, reject) => {
                connection.execute(`
          INSERT INTO movie_has_genre (movie_id, genre_id) VALUES ${placeholders}
        `, values, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(undefined);
                });
            });
        }
        // Commit transaction
        await new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err)
                    reject(err);
                else
                    resolve(undefined);
            });
        });
        // Return the inserted movie
        return await new Promise((resolve, reject) => {
            connection.query(`
        SELECT
          m.id,
          m.tmdb_id,
          m.title,
          m.release_date,
          m.poster_path,
          m.backdrop_path,
          m.overview,
          m.added_at
        FROM movie m
        WHERE m.id = ?
      `, [movieId], (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        // Rollback on error
        await new Promise((resolve, reject) => {
            connection.rollback((err) => {
                connection.release();
                reject(error);
            });
        });
    }
    finally {
        connection.release();
    }
}
async function deleteMovie(movie_id) {
    const connection = await new Promise((resolve, reject) => {
        (0, mysql_1.get)().getConnection((err, conn) => {
            if (err)
                reject(err);
            else
                resolve(conn);
        });
    });
    try {
        await new Promise((resolve, reject) => {
            connection.beginTransaction((err) => {
                if (err)
                    reject(err);
                else
                    resolve(undefined);
            });
        });
        // First delete from movie_has_genre (since we can't rely on CASCADE for soft delete)
        await new Promise((resolve, reject) => {
            connection.execute(`
        DELETE FROM movie_has_genre
        WHERE movie_id = ?
      `, [movie_id], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(undefined);
            });
        });
        // Then soft delete the movie
        await new Promise((resolve, reject) => {
            connection.execute(`
        UPDATE movie
        SET active = 0
        WHERE id = ?
      `, [movie_id], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(undefined);
            });
        });
        // Commit transaction
        await new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err)
                    reject(err);
                else
                    resolve(undefined);
            });
        });
    }
    catch (error) {
        // Rollback on error
        await new Promise((resolve, reject) => {
            connection.rollback((err) => {
                connection.release();
                throw error;
            });
        });
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=movies.js.map