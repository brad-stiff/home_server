import { Request, Response } from 'express';
import TMDBService from '../services/tmdb';
import db from '../db';
import type { MovieInsertRequest } from '../db/sql/movies';

export class MoviesController {
  /**
   * Get user's movie library
   */
  async getUserLibrary(req: Request, res: Response): Promise<void> {
    try {
      // Movies are now global - not tied to specific users
      const movies = await db.movies.getMovies();

      res.json({
        success: true,
        data: movies
      });
    } catch (error) {
      console.error('Error in getUserLibrary:', error);
      res.status(500).json({
        error: 'Failed to fetch user movie library'
      });
    }
  }

  /**
   * Add movie to user's library
   */
  async addToLibrary(req: Request, res: Response): Promise<void> {
    try {
      const { tmdb_id } = req.body;

      if (!tmdb_id) {
        res.status(400).json({
          error: 'TMDB movie ID is required'
        });
        return;
      }

      // TODO: Get user_id from JWT token
      const user_id = 1; // This should come from authenticated user

      // Get movie details from TMDB
      const movieDetails = await TMDBService.getMovieDetails(tmdb_id);

      const movieData: MovieInsertRequest = {
        tmdb_id,
        title: movieDetails.title,
        release_date: movieDetails.release_date,
        poster_path: movieDetails.poster_path,
        backdrop_path: movieDetails.backdrop_path,
        overview: movieDetails.overview,
        genre_ids: movieDetails.genres?.map(genre => genre.id),
      };

      const result = await db.movies.insertMovie(movieData);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in addToLibrary:', error);
      res.status(500).json({
        error: 'Failed to add movie to library'
      });
    }
  }

  /**
   * Remove movie from user's library
   */
  async removeFromLibrary(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Movie ID is required'
        });
        return;
      }

      // TODO: Get user_id from JWT token
      const movieId = parseInt(id, 10);
      if (isNaN(movieId)) {
        res.status(400).json({
          error: 'Invalid movie ID'
        });
        return;
      }

      await db.movies.deleteMovie(movieId);

      res.json({
        success: true,
        message: 'Movie removed from library'
      });
    } catch (error) {
      console.error('Error in removeFromLibrary:', error);
      res.status(500).json({
        error: 'Failed to remove movie from library'
      });
    }
  }

  /**
   * Search for movies
   */
  async searchMovies(req: Request, res: Response): Promise<void> {
    try {
      const { q: query, page = 1 } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          error: 'Query parameter is required'
        });
        return;
      }

      const pageNumber = parseInt(page as string, 10) || 1;
      const results = await TMDBService.searchMovies(query, pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in searchMovies:', error);
      res.status(500).json({
        error: 'Failed to search movies'
      });
    }
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1 } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;

      const results = await TMDBService.getPopularMovies(pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getPopularMovies:', error);
      res.status(500).json({
        error: 'Failed to fetch popular movies'
      });
    }
  }

  /**
   * Get top rated movies
   */
  async getTopRatedMovies(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1 } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;

      const results = await TMDBService.getTopRatedMovies(pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getTopRatedMovies:', error);
      res.status(500).json({
        error: 'Failed to fetch top rated movies'
      });
    }
  }

  /**
   * Get now playing movies
   */
  async getNowPlayingMovies(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1 } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;

      const results = await TMDBService.getNowPlayingMovies(pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getNowPlayingMovies:', error);
      res.status(500).json({
        error: 'Failed to fetch now playing movies'
      });
    }
  }

  /**
   * Get upcoming movies
   */
  async getUpcomingMovies(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1 } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;

      const results = await TMDBService.getUpcomingMovies(pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getUpcomingMovies:', error);
      res.status(500).json({
        error: 'Failed to fetch upcoming movies'
      });
    }
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Movie ID is required'
        });
        return;
      }

      const movieId = parseInt(id, 10);
      if (isNaN(movieId)) {
        res.status(400).json({
          error: 'Invalid movie ID'
        });
        return;
      }

      const movie = await TMDBService.getMovieDetails(movieId);

      res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      console.error('Error in getMovieDetails:', error);
      res.status(500).json({
        error: 'Failed to fetch movie details'
      });
    }
  }

  /**
   * Get movie images
   */
  async getMovieImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Movie ID is required'
        });
        return;
      }

      const movieId = parseInt(id, 10);
      if (isNaN(movieId)) {
        res.status(400).json({
          error: 'Invalid movie ID'
        });
        return;
      }

      const images = await TMDBService.getMovieImages(movieId);

      res.json({
        success: true,
        data: images
      });
    } catch (error) {
      console.error('Error in getMovieImages:', error);
      res.status(500).json({
        error: 'Failed to fetch movie images'
      });
    }
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getMovieCredits(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Movie ID is required'
        });
        return;
      }

      const movieId = parseInt(id, 10);
      if (isNaN(movieId)) {
        res.status(400).json({
          error: 'Invalid movie ID'
        });
        return;
      }

      const credits = await TMDBService.getMovieCredits(movieId);

      res.json({
        success: true,
        data: credits
      });
    } catch (error) {
      console.error('Error in getMovieCredits:', error);
      res.status(500).json({
        error: 'Failed to fetch movie credits'
      });
    }
  }

  /**
   * Get similar movies
   */
  async getSimilarMovies(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1 } = req.query;

      if (!id) {
        res.status(400).json({
          error: 'Movie ID is required'
        });
        return;
      }

      const movieId = parseInt(id, 10);
      if (isNaN(movieId)) {
        res.status(400).json({
          error: 'Invalid movie ID'
        });
        return;
      }

      const pageNumber = parseInt(page as string, 10) || 1;
      const results = await TMDBService.getSimilarMovies(movieId, pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getSimilarMovies:', error);
      res.status(500).json({
        error: 'Failed to fetch similar movies'
      });
    }
  }

  /**
   * Get movie recommendations
   */
  async getMovieRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1 } = req.query;

      if (!id) {
        res.status(400).json({
          error: 'Movie ID is required'
        });
        return;
      }

      const movieId = parseInt(id, 10);
      if (isNaN(movieId)) {
        res.status(400).json({
          error: 'Invalid movie ID'
        });
        return;
      }

      const pageNumber = parseInt(page as string, 10) || 1;
      const results = await TMDBService.getMovieRecommendations(movieId, pageNumber);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getMovieRecommendations:', error);
      res.status(500).json({
        error: 'Failed to fetch movie recommendations'
      });
    }
  }

  /**
   * Get movie genres
   */
  async getGenres(req: Request, res: Response): Promise<void> {
    try {
      const genres = await TMDBService.getGenres();

      res.json({
        success: true,
        data: genres
      });
    } catch (error) {
      console.error('Error in getGenres:', error);
      res.status(500).json({
        error: 'Failed to fetch genres'
      });
    }
  }
}

export default new MoviesController();
