import axios, { AxiosResponse } from 'axios';
import config from '../config';

import type {
  TMDBMovieDetails,
  TMDBSearchResponse,
  TMDBGenreResponse,
  TMDBMovieCredits,
  TMDBMovieImages
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

  async getMovieDetails(movie_id: number): Promise<TMDBMovieDetails> {
    try {
      const response: AxiosResponse<TMDBMovieDetails> = await this.api.get(`/movie/${movie_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  async getMovieImages(movie_id: number): Promise<TMDBMovieImages> {
    try {
      const response = await this.api.get(`/movie/${movie_id}/images`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie images:', error);
      throw new Error('Failed to fetch movie images');
    }
  }

  async getMovieCredits(movie_id: number): Promise<TMDBMovieCredits> {
    try {
      const response = await this.api.get(`/movie/${movie_id}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw new Error('Failed to fetch movie credits');
    }
  }

  async getSimilarMovies(movie_id: number, page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get(`/movie/${movie_id}/similar`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw new Error('Failed to fetch similar movies');
    }
  }

  async getMovieRecommendations(movie_id: number, page: number = 1): Promise<TMDBSearchResponse> {
    try {
      const response: AxiosResponse<TMDBSearchResponse> = await this.api.get(`/movie/${movie_id}/recommendations`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      throw new Error('Failed to fetch movie recommendations');
    }
  }

  async getGenres(): Promise<TMDBGenreResponse> {
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
