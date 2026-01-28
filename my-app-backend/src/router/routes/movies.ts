import { Router } from 'express';
import moviesController from '../controllers/movies';

const router = Router();

// User movie library endpoints
router.get('/library', moviesController.getUserLibrary);

router.post('/library', moviesController.addToLibrary);

router.delete('/library/:id', moviesController.removeFromLibrary);

// Search for movies
router.get('/search', moviesController.searchMovies);

// Get popular movies
router.get('/popular', moviesController.getPopularMovies);

// Get top rated movies
router.get('/top-rated', moviesController.getTopRatedMovies);

// Get now playing movies
router.get('/now-playing', moviesController.getNowPlayingMovies);

// Get upcoming movies
router.get('/upcoming', moviesController.getUpcomingMovies);

// Get movie genres
router.get('/genres/list', moviesController.getGenres);

// Get movie details by ID
router.get('/:id', moviesController.getMovieDetails);

// Get movie images
router.get('/:id/images', moviesController.getMovieImages);

// Get movie credits (cast and crew)
router.get('/:id/credits', moviesController.getMovieCredits);

// Get similar movies
router.get('/:id/similar', moviesController.getSimilarMovies);

// Get movie recommendations
router.get('/:id/recommendations', moviesController.getMovieRecommendations);

export default router;
