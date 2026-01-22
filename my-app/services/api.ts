// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

const API_ENDPOINTS = {
  MOVIES: {
    LIBRARY: `${API_BASE_URL}/movies/library`,
    SEARCH: `${API_BASE_URL}/movies/search`,
    DETAILS: (id: number) => `${API_BASE_URL}/movies/${id}`,
    GENRES: `${API_BASE_URL}/movies/genres/list`,
  },
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
}

export default ApiService;
