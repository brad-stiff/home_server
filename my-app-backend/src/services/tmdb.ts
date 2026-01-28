import axios, { AxiosResponse } from 'axios';
import config from '../config';

import type {
  TMDBMovieDetails,
  TMDBSearchResponse
} from '../types/movie'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = config.app.the_movie_db_api_key;

class TMDBService {
  private api = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  /**
   * Search for movies by query
   */
  async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get('/search/movie', {
        params: {
          query,
          page,
          include_adult: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to fetch popular movies');
    }
  }

  /**
   * Get top rated movies
   */
  async getTopRatedMovies(page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get('/movie/top_rated', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw new Error('Failed to fetch top rated movies');
    }
  }

  /**
   * Get now playing movies
   */
  async getNowPlayingMovies(page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get('/movie/now_playing', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw new Error('Failed to fetch now playing movies');
    }
  }

  /**
   * Get upcoming movies
   */
  async getUpcomingMovies(page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get('/movie/upcoming', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw new Error('Failed to fetch upcoming movies');
    }
  }

  /**
   * Get detailed movie information by ID
   */
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    try {
      const response: AxiosResponse<TMDBMovieDetails> = await this.api.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  /**
   * Get movie images (posters, backdrops)
   */
  async getMovieImages(movieId: number): Promise<any> {
    try {
      const response = await this.api.get(`/movie/${movieId}/images`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie images:', error);
      throw new Error('Failed to fetch movie images');
    }
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getMovieCredits(movieId: number): Promise<any> {
    try {
      const response = await this.api.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw new Error('Failed to fetch movie credits');
    }
  }

  /**
   * Get similar movies
   */
  async getSimilarMovies(movieId: number, page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get(`/movie/${movieId}/similar`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw new Error('Failed to fetch similar movies');
    }
  }

  /**
   * Get movie recommendations
   */
  async getMovieRecommendations(movieId: number, page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get(`/movie/${movieId}/recommendations`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      throw new Error('Failed to fetch movie recommendations');
    }
  }

  /**
   * Get movie genres
   */
  async getGenres(): Promise<any> {
    try {
      const response = await this.api.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw new Error('Failed to fetch genres');
    }
  }
}

export default new TMDBService();
