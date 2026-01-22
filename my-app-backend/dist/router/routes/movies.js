"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_1 = __importDefault(require("../../controllers/movies"));
const router = (0, express_1.Router)();
// User movie library endpoints
router.get('/library', async (req, res) => {
    await movies_1.default.getUserLibrary(req, res);
});
router.post('/library', async (req, res) => {
    await movies_1.default.addToLibrary(req, res);
});
router.delete('/library/:id', async (req, res) => {
    await movies_1.default.removeFromLibrary(req, res);
});
// Search for movies
router.get('/search', async (req, res) => {
    await movies_1.default.searchMovies(req, res);
});
// Get popular movies
router.get('/popular', async (req, res) => {
    await movies_1.default.getPopularMovies(req, res);
});
// Get top rated movies
router.get('/top-rated', async (req, res) => {
    await movies_1.default.getTopRatedMovies(req, res);
});
// Get now playing movies
router.get('/now-playing', async (req, res) => {
    await movies_1.default.getNowPlayingMovies(req, res);
});
// Get upcoming movies
router.get('/upcoming', async (req, res) => {
    await movies_1.default.getUpcomingMovies(req, res);
});
// Get movie details by ID
router.get('/:id', async (req, res) => {
    await movies_1.default.getMovieDetails(req, res);
});
// Get movie images
router.get('/:id/images', async (req, res) => {
    await movies_1.default.getMovieImages(req, res);
});
// Get movie credits (cast and crew)
router.get('/:id/credits', async (req, res) => {
    await movies_1.default.getMovieCredits(req, res);
});
// Get similar movies
router.get('/:id/similar', async (req, res) => {
    await movies_1.default.getSimilarMovies(req, res);
});
// Get movie recommendations
router.get('/:id/recommendations', async (req, res) => {
    await movies_1.default.getMovieRecommendations(req, res);
});
// Get movie genres
router.get('/genres/list', async (req, res) => {
    await movies_1.default.getGenres(req, res);
});
exports.default = router;
//# sourceMappingURL=movies.js.map