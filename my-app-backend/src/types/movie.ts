export type Movie = {
  id: number;
  tmdb_id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string | null;
  added_at: Date;
  active?: number;
  genre_ids?: number[];
}

export type MovieRequest = {
  tmdb_id?: number;
  active?: number;
  exact_match?: number;
}

export type MovieInsertRequest = {
  tmdb_id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  added_at?: Date;
  genre_ids?: number[];
}

export type TMDBMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export type TMDBMovieDetails = TMDBMovie & {
  genres: Array<{ id: number; name: string }>;
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
}

export type TMDBSearchResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}
