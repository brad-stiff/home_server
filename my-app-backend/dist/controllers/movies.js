"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesController = void 0;
const tmdb_1 = __importDefault(require("../services/tmdb"));
const db_1 = __importDefault(require("../db"));
class MoviesController {
    /**
     * Get user's movie library
     */
    async getUserLibrary(req, res) {
        try {
            // Movies are now global - not tied to specific users
            const movies = await db_1.default.movies.getMovies();
            res.json({
                success: true,
                data: movies
            });
        }
        catch (error) {
            console.error('Error in getUserLibrary:', error);
            res.status(500).json({
                error: 'Failed to fetch user movie library'
            });
        }
    }
    /**
     * Add movie to user's library
     */
    async addToLibrary(req, res) {
        var _a;
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
            const movieDetails = await tmdb_1.default.getMovieDetails(tmdb_id);
            const movieData = {
                tmdb_id,
                title: movieDetails.title,
                release_date: movieDetails.release_date,
                poster_path: movieDetails.poster_path,
                backdrop_path: movieDetails.backdrop_path,
                overview: movieDetails.overview,
                genre_ids: (_a = movieDetails.genres) === null || _a === void 0 ? void 0 : _a.map(genre => genre.id),
            };
            const result = await db_1.default.movies.insertMovie(movieData);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error('Error in addToLibrary:', error);
            res.status(500).json({
                error: 'Failed to add movie to library'
            });
        }
    }
    /**
     * Remove movie from user's library
     */
    async removeFromLibrary(req, res) {
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
            await db_1.default.movies.deleteMovie(movieId);
            res.json({
                success: true,
                message: 'Movie removed from library'
            });
        }
        catch (error) {
            console.error('Error in removeFromLibrary:', error);
            res.status(500).json({
                error: 'Failed to remove movie from library'
            });
        }
    }
    /**
     * Search for movies
     */
    async searchMovies(req, res) {
        try {
            const { q: query, page = 1 } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({
                    error: 'Query parameter is required'
                });
                return;
            }
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.searchMovies(query, pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in searchMovies:', error);
            res.status(500).json({
                error: 'Failed to search movies'
            });
        }
    }
    /**
     * Get popular movies
     */
    async getPopularMovies(req, res) {
        try {
            const { page = 1 } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.getPopularMovies(pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in getPopularMovies:', error);
            res.status(500).json({
                error: 'Failed to fetch popular movies'
            });
        }
    }
    /**
     * Get top rated movies
     */
    async getTopRatedMovies(req, res) {
        try {
            const { page = 1 } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.getTopRatedMovies(pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in getTopRatedMovies:', error);
            res.status(500).json({
                error: 'Failed to fetch top rated movies'
            });
        }
    }
    /**
     * Get now playing movies
     */
    async getNowPlayingMovies(req, res) {
        try {
            const { page = 1 } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.getNowPlayingMovies(pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in getNowPlayingMovies:', error);
            res.status(500).json({
                error: 'Failed to fetch now playing movies'
            });
        }
    }
    /**
     * Get upcoming movies
     */
    async getUpcomingMovies(req, res) {
        try {
            const { page = 1 } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.getUpcomingMovies(pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in getUpcomingMovies:', error);
            res.status(500).json({
                error: 'Failed to fetch upcoming movies'
            });
        }
    }
    /**
     * Get movie details by ID
     */
    async getMovieDetails(req, res) {
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
            const movie = await tmdb_1.default.getMovieDetails(movieId);
            res.json({
                success: true,
                data: movie
            });
        }
        catch (error) {
            console.error('Error in getMovieDetails:', error);
            res.status(500).json({
                error: 'Failed to fetch movie details'
            });
        }
    }
    /**
     * Get movie images
     */
    async getMovieImages(req, res) {
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
            const images = await tmdb_1.default.getMovieImages(movieId);
            res.json({
                success: true,
                data: images
            });
        }
        catch (error) {
            console.error('Error in getMovieImages:', error);
            res.status(500).json({
                error: 'Failed to fetch movie images'
            });
        }
    }
    /**
     * Get movie credits (cast and crew)
     */
    async getMovieCredits(req, res) {
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
            const credits = await tmdb_1.default.getMovieCredits(movieId);
            res.json({
                success: true,
                data: credits
            });
        }
        catch (error) {
            console.error('Error in getMovieCredits:', error);
            res.status(500).json({
                error: 'Failed to fetch movie credits'
            });
        }
    }
    /**
     * Get similar movies
     */
    async getSimilarMovies(req, res) {
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
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.getSimilarMovies(movieId, pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in getSimilarMovies:', error);
            res.status(500).json({
                error: 'Failed to fetch similar movies'
            });
        }
    }
    /**
     * Get movie recommendations
     */
    async getMovieRecommendations(req, res) {
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
            const pageNumber = parseInt(page, 10) || 1;
            const results = await tmdb_1.default.getMovieRecommendations(movieId, pageNumber);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Error in getMovieRecommendations:', error);
            res.status(500).json({
                error: 'Failed to fetch movie recommendations'
            });
        }
    }
    /**
     * Get movie genres
     */
    async getGenres(req, res) {
        try {
            const genres = await tmdb_1.default.getGenres();
            res.json({
                success: true,
                data: genres
            });
        }
        catch (error) {
            console.error('Error in getGenres:', error);
            res.status(500).json({
                error: 'Failed to fetch genres'
            });
        }
    }
}
exports.MoviesController = MoviesController;
exports.default = new MoviesController();
//# sourceMappingURL=movies.js.map