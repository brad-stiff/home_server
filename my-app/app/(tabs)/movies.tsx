import {
  View,
  Text,
  FlatList,
  Platform,
  Alert,
  Share,
  StyleSheet
} from 'react-native';
import { useState, useEffect } from 'react';
import ApiService from '@/services/api';
import HeaderControls from '@/components/movie/HeaderControls';
import MovieTileComponent from '@/components/movie/MovieTile';
import MovieDetailsModal from '@/components/movie/MovieDetailsModal';
import AddMovieModal from '@/components/movie/AddMovieModal';
import AnalyticsModal from '@/components/movie/AnalyticsModal';
import { MovieTile, MovieDetails, TMDBMovie, SortDirection } from '@/types/movie';

export default function MoviesScreen() {
  // Search + sorting
  const [search_query, setSearchQuery] = useState('');
  const [title_sort, setTitleSort] = useState<SortDirection>('asc');
  const [release_date_sort, setReleaseDateSort] = useState<SortDirection>(null);

  // Modals
  const [modal_visible, setModalVisible] = useState(false);
  const [add_movie_modal_visible, setAddMovieModalVisible] = useState(false);
  const [analytics_modal_visible, setAnalyticsModalVisible] = useState(false);

  // Movie data
  const [selected_movie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [user_movies, setUserMovies] = useState<MovieTile[]>([]);
  const [library_loading, setLibraryLoading] = useState(true);
  const [genre_map, setGenreMap] = useState<Record<number, string>>({});

  // Add movie modal state
  const [movie_search_query, setMovieSearchQuery] = useState('');
  const [search_results, setSearchResults] = useState<TMDBMovie[]>([]);
  const [search_loading, setSearchLoading] = useState(false);
  const [adding_movie, setAddingMovie] = useState<number | null>(null);

  // Load genres
  const loadGenres = async () => {
    try {
      const data = await ApiService.getGenres();
      if (data.success && data.data?.genres) {
        const map: Record<number, string> = {};
        data.data.genres.forEach((g: any) => (map[g.id] = g.name));
        setGenreMap(map);
        return map;
      }
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
    return {};
  };

  // Load library
  useEffect(() => {
    const loadData = async () => {
      const genre_mapping = await loadGenres();

      try {
        const data = await ApiService.getMoviesLibrary();
        if (data.success && data.data) {
          const mapped = data.data.map((movie: any) => {
            const genre_names =
              movie.genre_ids?.map((id: number) => genre_mapping[id]).filter(Boolean) || [];
            const genre = genre_names.length ? genre_names.join(', ') : 'Personal Collection';

            return {
              id: `user-${movie.id}`,
              title: movie.title,
              year: movie.release_date
                ? new Date(movie.release_date).getFullYear().toString()
                : new Date().getFullYear().toString(),
              genre,
              hex_color: '#007AFF',
              onPress: () => {},
              poster_bg: '#1a4a8a',
              poster_path: movie.poster_path,
              tmdb_id: movie.tmdb_id
            };
          });

          setUserMovies(mapped);
        }
      } catch (err) {
        console.error('Error loading library:', err);
      } finally {
        setLibraryLoading(false);
      }
    };

    loadData();
  }, []);

  // Fetch movie details
  const fetchMovieDetails = async (movie_id: number) => {
    try {
      const data = await ApiService.getMovieDetails(movie_id);
      if (data.success && data.data) {
        setSelectedMovie(data.data);
        setModalVisible(true);
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
    }
  };

  // TMDB search
  const searchTMDBMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const data = await ApiService.searchMovies(query);
      const raw = data.success && data.data?.results ? data.data.results : [];

      const sanitized = raw.map((movie: any) => ({
        id: Number(movie.id) || 0,
        title: String(movie.title || 'Unknown Title'),
        poster_path: movie.poster_path ? String(movie.poster_path) : null,
        backdrop_path: movie.backdrop_path ? String(movie.backdrop_path) : null,
        release_date: movie.release_date ? String(movie.release_date) : '',
        overview: String(movie.overview || ''),
        vote_average: Number(movie.vote_average) || 0
      }));

      setSearchResults(sanitized);
    } catch (err) {
      console.error('Error searching TMDB:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Add movie
  const addMovieToLibrary = async (tmdb_movie: TMDBMovie) => {
    try {
      setAddingMovie(tmdb_movie.id);

      const check = await ApiService.getMoviesLibrary();
      if (check.success && check.data) {
        const exists = check.data.some((m: any) => m.tmdb_id === tmdb_movie.id);
        if (exists) {
          alert(`"${tmdb_movie.title}" is already in your library!`);
          return;
        }
      }

      const data = await ApiService.addMovieToLibrary(tmdb_movie.id);

      if (data.success) {
        const library_data = await ApiService.getMoviesLibrary();
        if (library_data.success && library_data.data) {
          const mapped = library_data.data.map((movie: any) => {
            const genre_names =
              movie.genre_ids?.map((id: number) => genre_map[id]).filter(Boolean) || [];
            const genre = genre_names.length ? genre_names.join(', ') : 'Personal Collection';

            return {
              id: `user-${movie.id}`,
              title: movie.title,
              year: movie.release_date
                ? new Date(movie.release_date).getFullYear().toString()
                : new Date().getFullYear().toString(),
              genre,
              hex_color: '#007AFF',
              onPress: () => {},
              poster_bg: '#1a4a8a',
              poster_path: movie.poster_path,
              tmdb_id: movie.tmdb_id
            };
          });

          setUserMovies(mapped);
        }

        setAddMovieModalVisible(false);
        setMovieSearchQuery('');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error adding movie:', err);
      Alert.alert('Error', 'Failed to add movie.');
    } finally {
      setAddingMovie(null);
    }
  };

  // Sorting
  const handleTitleSort = () => {
    if (title_sort === null) setTitleSort('asc');
    else if (title_sort === 'asc') setTitleSort('desc');
    else setTitleSort('asc');

    setReleaseDateSort(null);
  };

  const handleReleaseDateSort = () => {
    if (release_date_sort === null) setReleaseDateSort('asc');
    else if (release_date_sort === 'asc') setReleaseDateSort('desc');
    else setReleaseDateSort('asc');

    setTitleSort(null);
  };

  // Export CSV
  const exportMovieLibrary = async () => {
    try {
      const sorted = [...user_movies].sort((a, b) => a.title.localeCompare(b.title));
      const csv_header = 'Title,Release Year\n';
      const csv_rows = sorted
        .map((m) => `"${m.title.replace(/"/g, '""')}",${m.year}`)
        .join('\n');
      const csv_content = csv_header + csv_rows;

      if (Platform.OS === 'web') {
        const blob = new Blob([csv_content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `movie_library_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        await Share.share({
          title: 'Movie Library Export',
          message: csv_content
        });
      }
    } catch (err) {
      console.error('Export failed:', err);
      Alert.alert('Export Failed', 'Unable to export movie library.');
    }
  };

  // Filter + sort
  const filtered_movies = [...user_movies]
    .filter((m) =>
      m.title.toLowerCase().includes(search_query.toLowerCase()) ||
      m.genre.toLowerCase().includes(search_query.toLowerCase()) ||
      m.year.includes(search_query)
    )
    .sort((a, b) => {
      if (title_sort) {
        const cmp = a.title.localeCompare(b.title);
        return title_sort === 'asc' ? cmp : -cmp;
      }
      if (release_date_sort) {
        const cmp = parseInt(a.year) - parseInt(b.year);
        return release_date_sort === 'asc' ? cmp : -cmp;
      }
      return 0;
    });

  const renderItem = ({ item }: { item: MovieTile }) => (
    <MovieTileComponent item={item} onPress={() => fetchMovieDetails(item.tmdb_id)} />
  );

  return (
    <View style={styles.container}>
      <HeaderControls
        search_query={search_query}
        setSearchQuery={setSearchQuery}
        title_sort={title_sort}
        release_date_sort={release_date_sort}
        onTitleSort={handleTitleSort}
        onReleaseDateSort={handleReleaseDateSort}
        onAddMovie={() => setAddMovieModalVisible(true)}
        onOpenAnalytics={() => setAnalyticsModalVisible(true)}
        onExport={exportMovieLibrary}
      />

      {library_loading ? (
        <Text style={styles.loadingText}>Loading your movie library...</Text>
      ) : filtered_movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No movies in your library</Text>
          <Text style={styles.emptyText}>Tap + to add your first movie</Text>
        </View>
      ) : (
        <FlatList
          data={filtered_movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          contentContainerStyle={styles.list}
        />
      )}

      <MovieDetailsModal
        visible={modal_visible}
        movie={selected_movie}
        onClose={() => setModalVisible(false)}
      />

      <AddMovieModal
        visible={add_movie_modal_visible}
        search_query={movie_search_query}
        setSearchQuery={setMovieSearchQuery}
        search_results={search_results}
        search_loading={search_loading}
        adding_movie={adding_movie}
        onSearch={searchTMDBMovies}
        onAddMovie={addMovieToLibrary}
        onClose={() => {
          setAddMovieModalVisible(false);
          setMovieSearchQuery('');
          setSearchResults([]);
        }}
      />

      <AnalyticsModal
        visible={analytics_modal_visible}
        movies={user_movies}
        onClose={() => setAnalyticsModalVisible(false)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
