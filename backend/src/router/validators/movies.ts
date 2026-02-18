import { z } from 'zod';

const addToLibrarySchema = z.object({
  tmdb_id: z.number().int().positive(),
});

const removeFromLibrarySchema = z.object({
  id: z.coerce.number().int().positive(),
});

const searchMoviesSchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().int().positive().default(1),
});

const getMovieDetailsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const getMovieImagesSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const getMovieCreditsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const getSimilarMoviesSchema = z.object({
  id: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().default(1),
});

const getMovieRecommendationsSchema = z.object({
  id: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().default(1),
});

const getPopularMoviesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

const getTopRatedMoviesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

const getNowPlayingMoviesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

const getUpcomingMoviesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

export function validateAddToLibrary(body: unknown): { data: { tmdb_id: number } } | { errors: string[] } {
  const result = addToLibrarySchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateRemoveFromLibrary(params: unknown): { data: { id: number } } | { errors: string[] } {
  const result = removeFromLibrarySchema.safeParse(params);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateSearchMovies(query: unknown): { data: { q: string, page: number } } | { errors: string[] } {
  const result = searchMoviesSchema.safeParse(query);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetMovieDetails(body: unknown): { data: { id: number } } | { errors: string[] } {
  const result = getMovieDetailsSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetMovieImages(body: unknown): { data: { id: number } } | { errors: string[] } {
  const result = getMovieImagesSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetMovieCredits(body: unknown): { data: { id: number } } | { errors: string[] } {
  const result = getMovieCreditsSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetSimilarMovies(body: unknown): { data: { id: number, page: number } } | { errors: string[] } {
  const result = getSimilarMoviesSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetMovieRecommendations(body: unknown): { data: { id: number, page: number } } | { errors: string[] } {
  const result = getMovieRecommendationsSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetPopularMovies(query: unknown): { data: { page: number } } | { errors: string[] } {
  const result = getPopularMoviesSchema.safeParse(query);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetTopRatedMovies(query: unknown): { data: { page: number } } | { errors: string[] } {
  const result = getTopRatedMoviesSchema.safeParse(query);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetNowPlayingMovies(query: unknown): { data: { page: number } } | { errors: string[] } {
  const result = getNowPlayingMoviesSchema.safeParse(query);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateGetUpcomingMovies(query: unknown): { data: { page: number } } | { errors: string[] } {
  const result = getUpcomingMoviesSchema.safeParse(query);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
}
