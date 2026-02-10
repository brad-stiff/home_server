import { Router } from 'express';
import moviesController from '../controllers/movies';

const router = Router();

// User movie library endpoints
router.get('/library', moviesController.getUserLibrary);
router.post('/library', moviesController.addToLibrary);
router.delete('/library/:id', moviesController.removeFromLibrary);

router.get('/search', moviesController.searchMovies);

router.get('/popular', moviesController.getPopularMovies);

router.get('/top-rated', moviesController.getTopRatedMovies);

router.get('/now-playing', moviesController.getNowPlayingMovies);

router.get('/upcoming', moviesController.getUpcomingMovies);

router.get('/genres/list', moviesController.getGenres);

router.get('/:id', moviesController.getMovieDetails);
router.get('/:id/images', moviesController.getMovieImages);
router.get('/:id/credits', moviesController.getMovieCredits);
router.get('/:id/similar', moviesController.getSimilarMovies);
router.get('/:id/recommendations', moviesController.getMovieRecommendations);

export default router;
