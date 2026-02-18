export type MovieTile = {
  id: string;
  title: string;
  year: string;
  genre: string;
  hex_color: string;
  onPress: () => void;
  poster_bg: string; // Fallback background color
  poster_path: string | null; // TMDB poster path
  tmdb_id: number; // TMDB movie ID for API calls
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  runtime: number | null;
  status: string;
  tagline: string | null;
};


export type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
};

export type SortDirection = 'asc' | 'desc' | null;
