import { Router } from 'express';
import moviesController from '../../controllers/movies';

const router = Router();

// User movie library endpoints
router.get('/library', async (req, res) => {
  await moviesController.getUserLibrary(req, res);
});

router.post('/library', async (req, res) => {
  await moviesController.addToLibrary(req, res);
});

router.delete('/library/:id', async (req, res) => {
  await moviesController.removeFromLibrary(req, res);
});

// Search for movies
router.get('/search', async (req, res) => {
  await moviesController.searchMovies(req, res);
});

// Get popular movies
router.get('/popular', async (req, res) => {
  await moviesController.getPopularMovies(req, res);
});

// Get top rated movies
router.get('/top-rated', async (req, res) => {
  await moviesController.getTopRatedMovies(req, res);
});

// Get now playing movies
router.get('/now-playing', async (req, res) => {
  await moviesController.getNowPlayingMovies(req, res);
});

// Get upcoming movies
router.get('/upcoming', async (req, res) => {
  await moviesController.getUpcomingMovies(req, res);
});

// Get movie details by ID
router.get('/:id', async (req, res) => {
  await moviesController.getMovieDetails(req, res);
});

// Get movie images
router.get('/:id/images', async (req, res) => {
  await moviesController.getMovieImages(req, res);
});

// Get movie credits (cast and crew)
router.get('/:id/credits', async (req, res) => {
  await moviesController.getMovieCredits(req, res);
});

// Get similar movies
router.get('/:id/similar', async (req, res) => {
  await moviesController.getSimilarMovies(req, res);
});

// Get movie recommendations
router.get('/:id/recommendations', async (req, res) => {
  await moviesController.getMovieRecommendations(req, res);
});

// Get movie genres
router.get('/genres/list', async (req, res) => {
  await moviesController.getGenres(req, res);
});

export default router;
