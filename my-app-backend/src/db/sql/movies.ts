import { selectQuery, modifyQuery } from "../util";
import { get } from "../../loaders/mysql";
import type { Movie } from "../../types/movie";

export interface MovieRequest {
  tmdb_id?: number;
  active?: number;
  exact_match?: number;
}

export interface MovieInsertRequest {
  tmdb_id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  added_at?: Date;
  genre_ids?: number[];
}

export async function getMovies() {
  const results = await selectQuery<Movie & { genre_ids?: number[] }>(`
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
    ORDER BY m.title ASC
  `);

  // Post-process to ensure genre_ids is always an array (JSON_ARRAYAGG returns null for no results)
  return results.map(movie => ({
    ...movie,
    genre_ids: movie.genre_ids || []
  }));
}

export async function insertMovie(movie: MovieInsertRequest) {
  const connection = await new Promise<any>((resolve, reject) => {
    get().getConnection((err, conn) => {
      if (err) reject(err);
      else resolve(conn);
    });
  });

  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // Insert movie
    const insertResult = await new Promise<any>((resolve, reject) => {
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
      ], (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
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
        `, values, (err: any) => {
          if (err) reject(err);
          else resolve(undefined);
        });
      });
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      connection.commit((err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // Return the inserted movie
    return await new Promise<Movie[]>((resolve, reject) => {
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
      `, [movieId], (err: any, results: any) => {
        if (err) reject(err);
        else resolve(results as Movie[]);
      });
    });

  } catch (error) {
    // Rollback on error
    await new Promise((resolve, reject) => {
      connection.rollback((err: any) => {
        connection.release();
        reject(error);
      });
    });
  } finally {
    connection.release();
  }
}

export async function deleteMovie(movie_id: number) {
  const connection = await new Promise<any>((resolve, reject) => {
    get().getConnection((err, conn) => {
      if (err) reject(err);
      else resolve(conn);
    });
  });

  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // First delete from movie_has_genre (since we can't rely on CASCADE for soft delete)
    await new Promise((resolve, reject) => {
      connection.execute(`
        DELETE FROM movie_has_genre
        WHERE movie_id = ?
      `, [movie_id], (err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // Then soft delete the movie
    await new Promise((resolve, reject) => {
      connection.execute(`
        UPDATE movie
        SET active = 0
        WHERE id = ?
      `, [movie_id], (err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // Commit transaction
    await new Promise((resolve, reject) => {
      connection.commit((err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

  } catch (error) {
    // Rollback on error
    await new Promise((resolve, reject) => {
      connection.rollback((err: any) => {
        connection.release();
        throw error;
      });
    });
  } finally {
    connection.release();
  }
}
