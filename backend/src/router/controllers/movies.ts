import { Request, Response, NextFunction } from 'express';
import TMDBService from '../../services/tmdb';
import db from '../../db';
import type { MovieInsertRequest } from '../../types/movie';
import {
  validateAddToLibrary,
  validateRemoveFromLibrary,
  validateGetPopularMovies,
  validateSearchMovies,
  validateGetTopRatedMovies,
  validateGetNowPlayingMovies,
  validateGetUpcomingMovies,
  validateGetMovieDetails,
  validateGetMovieImages,
  validateGetMovieCredits,
  validateGetSimilarMovies,
  validateGetMovieRecommendations
} from '../validators/movies';

export class MoviesController {

  async getUserLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const movies = await db.movies.getMovies();

      res.json({
        success: true,
        data: movies
      });
    } catch (error) {
      console.error('Error in getUserLibrary:', error);
      next(error)
    }
  }

  async addToLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateAddToLibrary(req.body);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { tmdb_id } = validation.data;

      // Get movie details from TMDB
      const movie_details = await TMDBService.getMovieDetails(tmdb_id);

      const movie_data: MovieInsertRequest = {
        tmdb_id,
        title: movie_details.title,
        release_date: movie_details.release_date,
        poster_path: movie_details.poster_path,
        backdrop_path: movie_details.backdrop_path,
        overview: movie_details.overview,
        genre_ids: movie_details.genres?.map(genre => genre.id),
      };

      const result = await db.movies.insertMovie(movie_data);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in addToLibrary:', error);
      next(error);
    }
  }

  // TODO - add authentication (admin user only)
  async removeFromLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateRemoveFromLibrary(req.params);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { id } = validation.data;

      await db.movies.deleteMovie(id);

      res.json({
        success: true,
        message: 'Movie removed from library'
      });
    } catch (error) {
      console.error('Error in removeFromLibrary:', error);
      next(error);
    }
  }

  async searchMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateSearchMovies(req.query);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { q: query, page } = validation.data;

      const results = await TMDBService.searchMovies(query, page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in searchMovies:', error);
      next(error);
    }
  }

  async getPopularMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetPopularMovies(req.query);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { page } = validation.data;

      const results = await TMDBService.getPopularMovies(page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getPopularMovies:', error);
      next(error);
    }
  }

  async getTopRatedMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetTopRatedMovies(req.query);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { page } = validation.data;

      const results = await TMDBService.getTopRatedMovies(page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getTopRatedMovies:', error);
      next(error);
    }
  }

  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetNowPlayingMovies(req.query);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { page } = validation.data;

      const results = await TMDBService.getNowPlayingMovies(page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getNowPlayingMovies:', error);
      next(error);
    }
  }

  async getUpcomingMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetUpcomingMovies(req.query);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { page } = validation.data;

      const results = await TMDBService.getUpcomingMovies(page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getUpcomingMovies:', error);
      next(error);
    }
  }

  async getMovieDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetMovieDetails(req.params);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { id } = validation.data;

      const movie = await TMDBService.getMovieDetails(id);

      res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      console.error('Error in getMovieDetails:', error);
      next(error);
    }
  }

  async getMovieImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetMovieImages(req.params);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { id } = validation.data;

      const images = await TMDBService.getMovieImages(id);

      res.json({
        success: true,
        data: images
      });
    } catch (error) {
      console.error('Error in getMovieImages:', error);
      next(error);
    }
  }

  async getMovieCredits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetMovieCredits(req.params);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { id } = validation.data;

      const credits = await TMDBService.getMovieCredits(id);

      res.json({
        success: true,
        data: credits
      });
    } catch (error) {
      console.error('Error in getMovieCredits:', error);
      next(error);
    }
  }

  async getSimilarMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetSimilarMovies({ ...req.params, ...req.query });
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { id, page } = validation.data;

      const results = await TMDBService.getSimilarMovies(id, page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getSimilarMovies:', error);
      next(error);
    }
  }

  async getMovieRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateGetMovieRecommendations({ ...req.params, ...req.query });
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { id, page } = validation.data;

      const results = await TMDBService.getMovieRecommendations(id, page);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getMovieRecommendations:', error);
      next(error);
    }
  }

  async getGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const genres = await TMDBService.getGenres();

      res.json({
        success: true,
        data: genres
      });
    } catch (error) {
      console.error('Error in getGenres:', error);
      next(error);
    }
  }
}

export default new MoviesController();
