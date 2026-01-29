import {
    View,
    Text,
    Image,
    Modal,
    ScrollView,
    Pressable,
    StyleSheet
  } from 'react-native';
import { MovieDetails } from '@/app/types/movie';

type Props = {
  visible: boolean;
  movie: MovieDetails | null;
  onClose: () => void;
};

export default function MovieDetailsModal({ visible, movie, onClose }: Props) {
  if (!movie) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {/* Backdrop */}
            {movie.backdrop_path && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                }}
                style={styles.movieBackdrop}
                resizeMode="cover"
              />
            )}

            {/* Header */}
            <View style={styles.movieHeader}>
              <Text style={styles.modalTitle}>{movie.title}</Text>

              {movie.tagline && (
                <Text style={styles.movieTagline}>"{movie.tagline}"</Text>
              )}

              <View style={styles.movieMeta}>
                <Text style={styles.movieYearModal}>
                  {new Date(movie.release_date).getFullYear()}
                </Text>

                {movie.runtime && (
                  <Text style={styles.movieRuntime}>
                    • {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </Text>
                )}

                <Text style={styles.movieRating}>
                  • ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                </Text>
              </View>

              <Text style={styles.movieGenres}>
                {movie.genres.map(g => g.name).join(', ')}
              </Text>
            </View>

            {/* Overview */}
            <View style={styles.movieOverview}>
              <Text style={styles.overviewTitle}>Overview</Text>
              <Text style={styles.overviewText}>
                {movie.overview || 'No overview available.'}
              </Text>
            </View>

            {/* Details */}
            <View style={styles.movieDetails}>
              <Text style={styles.detailsTitle}>Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{movie.status}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Release Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(movie.release_date).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* Close */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overviewText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  movieDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#ccc',
    fontWeight: '600',
    width: 120,
  },
  detailValue: {
    color: '#fff',
    flexShrink: 1,
  },
  closeButton: {
    backgroundColor: '#0D6EFD',
    padding: 12,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
