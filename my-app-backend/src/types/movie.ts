export interface Movie {
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
