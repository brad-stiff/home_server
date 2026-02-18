import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SortDirection = 'asc' | 'desc' | null;

type Props = {
  search_query: string;
  setSearchQuery: (text: string) => void;

  title_sort: SortDirection;
  release_date_sort: SortDirection;

  onTitleSort: () => void;
  onReleaseDateSort: () => void;

  onAddMovie: () => void;
  onOpenAnalytics: () => void;
  onExport: () => void;
};

export default function HeaderControls({
  search_query: search_query,
  setSearchQuery,
  title_sort: title_sort,
  release_date_sort: release_date_sort,
  onTitleSort,
  onReleaseDateSort,
  onAddMovie,
  onOpenAnalytics,
  onExport
}: Props) {
  return (
    <View style={styles.header}>
      {/* Title Sort */}
      <TouchableOpacity
        style={[styles.sortButton, title_sort && styles.sortButtonActive]}
        onPress={onTitleSort}
      >
        <Ionicons
          name={
            title_sort === 'asc'
              ? 'text'
              : title_sort === 'desc'
              ? 'text-outline'
              : 'text'
          }
          size={16}
          color={title_sort ? '#fff' : '#666'}
        />
        {title_sort === 'asc' && <Ionicons name="arrow-down" size={12} color="#fff" />}
        {title_sort === 'desc' && <Ionicons name="arrow-up" size={12} color="#fff" />}
      </TouchableOpacity>

      {/* Release Date Sort */}
      <TouchableOpacity
        style={[styles.sortButton, release_date_sort && styles.sortButtonActive]}
        onPress={onReleaseDateSort}
      >
        <Ionicons
          name="calendar"
          size={16}
          color={release_date_sort ? '#fff' : '#666'}
        />
        {release_date_sort === 'asc' && <Ionicons name="arrow-down" size={12} color="#fff" />}
        {release_date_sort === 'desc' && <Ionicons name="arrow-up" size={12} color="#fff" />}
      </TouchableOpacity>

      {/* Search */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search movies..."
        value={search_query}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />

      {/* Add Movie */}
      <TouchableOpacity style={styles.addButton} onPress={onAddMovie}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Analytics */}
      <TouchableOpacity style={styles.analyticsButton} onPress={onOpenAnalytics}>
        <Ionicons name="bar-chart" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Export */}
      <TouchableOpacity style={styles.exportButton} onPress={onExport}>
        <Ionicons name="download" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#0D6EFD',
    borderColor: '#0D6EFD',
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
  analyticsButton: {
    backgroundColor: '#0D6EFD',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  exportButton: {
    backgroundColor: '#198754',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
});
