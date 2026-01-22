import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  TextInput,
  Platform,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

// API Configuration - Consider moving to a separate config file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

const { width } = Dimensions.get('window');
const number_of_columns = 4;
const tile_size = width / number_of_columns - 32;

type MovieTile = {
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

type MovieDetails = {
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


type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
};

type SortOption = 'title' | 'release_date';
type SortDirection = 'asc' | 'desc' | null;

export default function MoviesScreen() {
  const [search_query, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [addMovieModalVisible, setAddMovieModalVisible] = useState(false);
  const [userMovies, setUserMovies] = useState<MovieTile[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  // Sort states - default is title ascending
  const [titleSort, setTitleSort] = useState<SortDirection>('asc');
  const [releaseDateSort, setReleaseDateSort] = useState<SortDirection>(null);

  // Load genres mapping
  const loadGenres = async (): Promise<Record<number, string>> => {
    try {
      const data = await ApiService.getGenres();
      if (data.success && data.data && data.data.genres) {
        const genreMapping: Record<number, string> = {};
        data.data.genres.forEach((genre: { id: number; name: string }) => {
          genreMapping[genre.id] = genre.name;
        });
        setGenreMap(genreMapping);
        return genreMapping;
      }
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
    return {};
  };

  // Add movie modal states
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingMovie, setAddingMovie] = useState<number | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Load genres and user's movie library on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load genres first and get the mapping directly
      const genreMapping = await loadGenres();

      try {
        const data = await ApiService.getMoviesLibrary();

        if (data.success && data.data) {
          // Convert database movies to MovieTile format
          const libraryMovies: MovieTile[] = data.data.map((movie: any) => {
            // Map genre_ids to genre names, fallback to 'Personal Collection'
            const genreNames = movie.genre_ids?.map((id: number) => genreMapping[id]).filter(Boolean) || [];
            const genre = genreNames.length > 0 ? genreNames.join(', ') : 'Personal Collection';

            return {
              id: `user-${movie.id}`,
              title: movie.title,
              year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : new Date().getFullYear().toString(),
              genre,
              hex_color: '#007AFF', // Different color for user movies
              onPress: () => {},
              poster_bg: '#1a4a8a',
              poster_path: movie.poster_path,
              tmdb_id: movie.tmdb_id,
            };
          });

          setUserMovies(libraryMovies);
        }
      } catch (error) {
        console.error('Error loading user library:', error);
      } finally {
        setLibraryLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      setLoading(true);
      const data = await ApiService.getMovieDetails(movieId);

      if (data.success && data.data) {
        setSelectedMovie(data.data);
        setModalVisible(true);
      } else {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchTMDBMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const data = await ApiService.searchMovies(query);
      const rawResults = data.success && data.data && data.data.results ? data.data.results : [];

      // Sanitize TMDB data to prevent React Native rendering errors
      const sanitizedResults = rawResults.map((movie: any) => ({
        id: Number(movie.id) || 0,
        title: String(movie.title || 'Unknown Title'),
        poster_path: movie.poster_path ? String(movie.poster_path) : null,
        backdrop_path: movie.backdrop_path ? String(movie.backdrop_path) : null,
        release_date: movie.release_date ? String(movie.release_date) : '',
        overview: String(movie.overview || ''),
        vote_average: Number(movie.vote_average) || 0,
      }));

      setSearchResults(sanitizedResults);
    } catch (error) {
      console.error('Error searching TMDB:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addMovieToLibrary = async (tmdbMovie: TMDBMovie) => {
    try {
      setAddingMovie(tmdbMovie.id);

      // First check if movie already exists in library
      const checkData = await ApiService.getMoviesLibrary();
      if (checkData.success && checkData.data) {
        const movieExists = checkData.data.some((movie: any) => movie.tmdb_id === tmdbMovie.id);
        if (movieExists) {
          alert(`"${tmdbMovie.title}" is already in your library!`);
          return;
        }
      }

      // Movie doesn't exist, proceed with adding it
      const data = await ApiService.addMovieToLibrary(tmdbMovie.id);

      if (data.success) {
        // Refresh the user's movie library with proper genre mapping
        const libraryData = await ApiService.getMoviesLibrary();
        if (libraryData.success && libraryData.data) {
            const libraryMovies: MovieTile[] = libraryData.data.map((movie: any) => {
              // Map genre_ids to genre names, fallback to 'Personal Collection'
              const genreNames = movie.genre_ids?.map((id: number) => genreMap[id]).filter(Boolean) || [];
              const genre = genreNames.length > 0 ? genreNames.join(', ') : 'Personal Collection';

              return {
                id: `user-${movie.id}`,
                title: movie.title,
                year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : new Date().getFullYear().toString(),
                genre,
                hex_color: '#007AFF',
                onPress: () => {},
                poster_bg: '#1a4a8a',
                poster_path: movie.poster_path,
                tmdb_id: movie.tmdb_id,
              };
            });
            setUserMovies(libraryMovies);
          }
        // Close the add movie modal
        setAddMovieModalVisible(false);
        setMovieSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie to library');
    } finally {
      setAddingMovie(null);
    }
  };

  // Use only movies from the database
  const allMovies = [...userMovies];

  const filtered_tiles = allMovies
    .filter((tile) =>
      tile.title.toLowerCase().includes(search_query.toLowerCase()) ||
      tile.genre.toLowerCase().includes(search_query.toLowerCase()) ||
      tile.year.includes(search_query)
    )
    .sort((a, b) => {
      // Apply sorting based on active sort option
      if (titleSort) {
        const comparison = a.title.localeCompare(b.title);
        return titleSort === 'asc' ? comparison : -comparison;
      } else if (releaseDateSort) {
        const aYear = parseInt(a.year) || 0;
        const bYear = parseInt(b.year) || 0;
        const comparison = aYear - bYear;
        return releaseDateSort === 'asc' ? comparison : -comparison;
      }
      // Default: no sorting (maintain current order)
      return 0;
    });

  const handleTilePress = (item: MovieTile) => {
    // On web, blur any focused element before navigating to avoid aria-hidden warning
    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    fetchMovieDetails(item.tmdb_id);
  };

  const renderItem = ({ item }: { item: MovieTile }) => (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        pressed && styles.tilePressed
      ]}
      onPress={() => handleTilePress(item)}
    >
      {item.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w342${item.poster_path}`
          }}
          style={styles.tileImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.tileFallback, { backgroundColor: item.poster_bg }]} />
      )}
      <View style={styles.posterOverlay}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>
        <Text style={styles.movieGenre}>{item.genre}</Text>
      </View>
    </Pressable>
  );

  // Sort button handlers
  const handleTitleSort = () => {
    if (titleSort === null) {
      // Activate title ascending, deactivate release date
      setTitleSort('asc');
      setReleaseDateSort(null);
    } else if (titleSort === 'asc') {
      // Toggle to descending
      setTitleSort('desc');
      setReleaseDateSort(null);
    } else if (titleSort === 'desc') {
      // If release date is active, can clear title (switch to release date only)
      if (releaseDateSort !== null) {
        setTitleSort(null);
        // Keep release date active
      } else {
        // If release date is not active, cycle back to ascending
        setTitleSort('asc');
        setReleaseDateSort(null);
      }
    }
  };

  const handleReleaseDateSort = () => {
    if (releaseDateSort === null) {
      // Activate release date ascending, deactivate title
      setReleaseDateSort('asc');
      setTitleSort(null);
    } else if (releaseDateSort === 'asc') {
      // Toggle to descending
      setReleaseDateSort('desc');
      setTitleSort(null);
    } else if (releaseDateSort === 'desc') {
      // If title is active, can clear release date (switch to title only)
      if (titleSort !== null) {
        setReleaseDateSort(null);
        // Keep title active
      } else {
        // If title is not active, cycle back to ascending
        setReleaseDateSort('asc');
        setTitleSort(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.sortButton, titleSort && styles.sortButtonActive]}
          onPress={handleTitleSort}
        >
          <Ionicons
            name={
              titleSort === 'asc' ? 'text' :
              titleSort === 'desc' ? 'text-outline' :
              'text'
            }
            size={16}
            color={titleSort ? '#fff' : '#666'}
          />
          {titleSort === 'asc' && <Ionicons name="arrow-down" size={12} color="#fff" />}
          {titleSort === 'desc' && <Ionicons name="arrow-up" size={12} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, releaseDateSort && styles.sortButtonActive]}
          onPress={handleReleaseDateSort}
        >
          <Ionicons
            name="calendar"
            size={16}
            color={releaseDateSort ? '#fff' : '#666'}
          />
          {releaseDateSort === 'asc' && <Ionicons name="arrow-down" size={12} color="#fff" />}
          {releaseDateSort === 'desc' && <Ionicons name="arrow-up" size={12} color="#fff" />}
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder="Search movies..."
          value={search_query}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddMovieModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {libraryLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your movie library...</Text>
        </View>
      ) : filtered_tiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="film" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No movies in your library</Text>
          <Text style={styles.emptyText}>Tap the + button to add your first movie!</Text>
        </View>
      ) : (
        <FlatList
          data={filtered_tiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={number_of_columns}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedMovie && (
                <>
                  {/* Movie Poster/Backdrop */}
                  {selectedMovie.backdrop_path && (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
                      }}
                      style={styles.movieBackdrop}
                      resizeMode="cover"
                    />
                  )}

                  {/* Movie Title and Basic Info */}
                  <View style={styles.movieHeader}>
                    <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                    {selectedMovie.tagline && (
                      <Text style={styles.movieTagline}>"{selectedMovie.tagline}"</Text>
                    )}
                    <View style={styles.movieMeta}>
                      <Text style={styles.movieYearModal}>
                        {new Date(selectedMovie.release_date).getFullYear()}
                      </Text>
                      {selectedMovie.runtime && (
                        <Text style={styles.movieRuntime}>
                          • {Math.floor(selectedMovie.runtime / 60)}h {selectedMovie.runtime % 60}m
                        </Text>
                      )}
                      <Text style={styles.movieRating}>
                        • ⭐ {selectedMovie.vote_average.toFixed(1)} ({selectedMovie.vote_count} votes)
                      </Text>
                    </View>
                    <Text style={styles.movieGenres}>
                      {selectedMovie.genres.map(genre => genre.name).join(', ')}
                    </Text>
                  </View>

                  {/* Movie Overview */}
                  <View style={styles.movieOverview}>
                    <Text style={styles.overviewTitle}>Overview</Text>
                    <Text style={styles.overviewText}>
                      {selectedMovie.overview || 'No overview available.'}
                    </Text>
                  </View>

                  {/* Additional Info */}
                  <View style={styles.movieDetails}>
                    <Text style={styles.detailsTitle}>Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text style={styles.detailValue}>{selectedMovie.status}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Release Date:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(selectedMovie.release_date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* Close Button */}
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={addMovieModalVisible}
        onRequestClose={() => {
          setAddMovieModalVisible(false);
          setMovieSearchQuery('');
          setSearchResults([]);
          if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(null);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addMovieModalContent}>
            <Text style={styles.addMovieModalTitle}>Add Movie to Library</Text>

            {/* Search Bar */}
            <TextInput
              style={styles.movieSearchInput}
              placeholder="Search for movies..."
              value={movieSearchQuery}
              onChangeText={(text) => {
                setMovieSearchQuery(text);

                // Clear existing timeout
                if (searchTimeout) {
                  clearTimeout(searchTimeout);
                }

                // Set new timeout for debounced search
                const newTimeout = setTimeout(() => {
                  searchTMDBMovies(text);
                }, 500);

                setSearchTimeout(newTimeout);
              }}
              placeholderTextColor="#888"
            />

            {/* Search Results */}
            {Boolean(searchLoading) && (
              <Text style={styles.searchLoadingText}>Searching...</Text>
            )}

            {!Boolean(searchLoading) && Boolean(searchResults.length > 0) && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.searchResultItem}>
                    <View style={styles.searchResultContent}>
                      {item.poster_path && (
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/w92${item.poster_path}`
                          }}
                          style={styles.searchResultPoster}
                          resizeMode="cover"
                        />
                      )}
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.searchResultYear}>
                          {item.release_date ? new Date(item.release_date).getFullYear().toString() : 'Unknown'}
                        </Text>
                        <Text style={styles.searchResultOverview} numberOfLines={2}>
                          {item.overview || 'No description available'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.addMovieButton,
                        addingMovie === item.id && styles.addMovieButtonDisabled
                      ]}
                      onPress={() => addMovieToLibrary(item)}
                      disabled={addingMovie === item.id}
                    >
                      <Text style={styles.addMovieButtonText}>
                        {addingMovie === item.id ? 'Checking...' : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.searchResultsList}
                showsVerticalScrollIndicator={false}
              />
            )}

            {!Boolean(searchLoading) && Boolean(movieSearchQuery.trim()) && Boolean(searchResults.length === 0) && (
              <Text style={styles.noResultsText}>No movies found</Text>
            )}

            <TouchableOpacity
              style={styles.addMovieCloseButton}
              onPress={() => {
                setAddMovieModalVisible(false);
                setMovieSearchQuery('');
                setSearchResults([]);
                if (searchTimeout) {
                  clearTimeout(searchTimeout);
                  setSearchTimeout(null);
                }
              }}
            >
              <Text style={styles.addMovieCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sortButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  list: {
    padding: 8,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    flex: 1,
    height: 44,
  },
  addButton: {
    backgroundColor: '#198754',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    height: tile_size * 1.5, // Taller for movie posters
    width: tile_size,
    margin: 8,
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  tilePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  tileFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  posterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    alignItems: 'center',
  },
  movieTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  movieYear: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },
  movieGenre: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#25292e',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#444',
  },
  modalScrollContent: {
    padding: 0,
  },
  movieBackdrop: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  movieHeader: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  movieTagline: {
    fontSize: 16,
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  movieMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  movieYearModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  movieRuntime: {
    color: '#ccc',
    fontSize: 16,
    marginLeft: 8,
  },
  movieRating: {
    color: '#ffd700',
    fontSize: 16,
    marginLeft: 8,
  },
  movieGenres: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  movieOverview: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overviewText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
  movieDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Add Movie Modal Styles
  addMovieModalContent: {
    backgroundColor: '#25292e',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  addMovieModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  addMovieModalText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  addMovieCloseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addMovieCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  movieSearchInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  searchLoadingText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 20,
  },
  searchResultsList: {
    maxHeight: 400,
    width: '100%',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchResultContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultPoster: {
    width: 50,
    height: 75,
    borderRadius: 4,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  searchResultYear: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  searchResultOverview: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  addMovieButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  addMovieButtonDisabled: {
    backgroundColor: '#666',
  },
  addMovieButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 20,
  },
});
