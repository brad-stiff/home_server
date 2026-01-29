import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet
} from 'react-native';
import { useState } from 'react';
import type { TMDBMovie } from '@/app/types/movie';

type Props = {
  visible: boolean;
  search_query: string;
  setSearchQuery: (text: string) => void;
  search_results: TMDBMovie[];
  search_loading: boolean;
  adding_movie: number | null;
  onSearch: (query: string) => void;
  onAddMovie: (movie: TMDBMovie) => void;
  onClose: () => void; // parent will also clear query + results
};

export default function AddMovieModal({
  visible,
  search_query: search_query,
  setSearchQuery,
  search_results: search_results,
  search_loading: search_loading,
  adding_movie: adding_movie,
  onSearch,
  onAddMovie,
  onClose
}: Props) {
  const [search_timeout, setSearchTimeout] =
    useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (search_timeout) {
      clearTimeout(search_timeout);
    }

    const newTimeout = setTimeout(() => {
      onSearch(text);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleClose = () => {
    if (search_timeout) {
      clearTimeout(search_timeout);
      setSearchTimeout(null);
    }
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Movie to Library</Text>

          {/* Search Bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies..."
            value={search_query}
            onChangeText={handleSearchChange}
            placeholderTextColor="#888"
          />

          {/* Loading */}
          {Boolean(search_loading) && (
            <Text style={styles.loadingText}>Searching...</Text>
          )}

          {/* Results */}
          {!Boolean(search_loading) && Boolean(search_results.length > 0) && (
            <FlatList
              data={search_results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <View style={styles.resultContent}>
                    {item.poster_path && (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        }}
                        style={styles.resultPoster}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.resultYear}>
                        {item.release_date
                          ? new Date(item.release_date)
                              .getFullYear()
                              .toString()
                          : 'Unknown'}
                      </Text>
                      <Text
                        style={styles.resultOverview}
                        numberOfLines={2}
                      >
                        {item.overview || 'No description available'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      adding_movie === item.id && styles.addButtonDisabled
                    ]}
                    onPress={() => onAddMovie(item)}
                    disabled={adding_movie === item.id}
                  >
                    <Text style={styles.addButtonText}>
                      {adding_movie === item.id ? 'Checking...' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* No results */}
          {!Boolean(search_loading) &&
            Boolean(search_query.trim()) &&
            Boolean(search_results.length === 0) && (
              <Text style={styles.noResultsText}>No movies found</Text>
            )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#25292e',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#444'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center'
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 12
  },
  loadingText: {
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 10
  },
  resultsList: {
    maxHeight: 350
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333'
  },
  resultContent: {
    flexDirection: 'row',
    flex: 1
  },
  resultPoster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 10
  },
  resultInfo: {
    flex: 1
  },
  resultTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  resultYear: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2
  },
  resultOverview: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4
  },
  addButton: {
    backgroundColor: '#198754',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'center'
  },
  addButtonDisabled: {
    backgroundColor: '#555'
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  noResultsText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20
  },
  closeButton: {
    backgroundColor: '#0D6EFD',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
