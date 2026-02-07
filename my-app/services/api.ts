// API Configuration
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.api_url;

const API_ENDPOINTS = {
  MOVIES: {
    LIBRARY: `${API_BASE_URL}/movies/library`,
    SEARCH: `${API_BASE_URL}/movies/search`,
    DETAILS: (id: number) => `${API_BASE_URL}/movies/${id}`,
    GENRES: `${API_BASE_URL}/movies/genres/list`,
  },
  USERS: {
    ME: `${API_BASE_URL}/users/me`,
    REGISTER: ``,
    LOGIN: `${API_BASE_URL}/users/login`,
    LOGOUT: ``
  },
  MTG_CARDS: {
    SETS: `${API_BASE_URL}/mtg-cards/sets`,
    SEARCH: `${API_BASE_URL}/mtg-cards/search`,
    CARDS_BY_SET: (setCode: string) => `${API_BASE_URL}/mtg-cards/sets/${setCode}/cards`,
  }
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// API Service
class ApiService {
  private static async request<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  //movies
  static async getMoviesLibrary(): Promise<ApiResponse<any[]>> {
    return this.request(API_ENDPOINTS.MOVIES.LIBRARY);
  }

  static async searchMovies(query: string): Promise<ApiResponse<{ results: any[] }>> {
    return this.request(`${API_ENDPOINTS.MOVIES.SEARCH}?q=${encodeURIComponent(query)}`);
  }

  static async getMovieDetails(id: number): Promise<ApiResponse<MovieDetails>> {
    return this.request(API_ENDPOINTS.MOVIES.DETAILS(id));
  }

  static async getGenres(): Promise<ApiResponse<{ genres: { id: number; name: string }[] }>> {
    return this.request(API_ENDPOINTS.MOVIES.GENRES);
  }

  static async addMovieToLibrary(tmdbId: number): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.MOVIES.LIBRARY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tmdb_id: tmdbId }),
    });
  }

  //user
  static async login(email: string, password: string): Promise<ApiResponse<{messages: string[]}>> {
    return this.request(API_ENDPOINTS.USERS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password})
    });
  }

  //mtg cards
  static async getSets(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.MTG_CARDS.SETS);
  }

  static async searchCards(query: string, page: number = 1): Promise<ApiResponse<any>> {
    return this.request(`${API_ENDPOINTS.MTG_CARDS.SEARCH}?q=${encodeURIComponent(query)}&page=${page}`);
  }

  static async getCardsBySet(setCode: string, page: number = 1): Promise<ApiResponse<any>> {
    return this.request(`${API_ENDPOINTS.MTG_CARDS.CARDS_BY_SET(setCode)}?page=${page}`);
  }
}

export default ApiService;
