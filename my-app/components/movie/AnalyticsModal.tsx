import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import type { MovieTile } from '@/app/types/movie';
import AnalyticsChart from './AnalyticsChart';

type Props = {
  visible: boolean;
  movies: MovieTile[];
  onClose: () => void;
};

export default function AnalyticsModal({ visible, movies, onClose }: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Movie Analytics</Text>
          <Text style={styles.subtitle}>Movies by Release Year</Text>

          <ScrollView
            style={styles.chartContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={true}
          >
            <AnalyticsChart movies={movies} />
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
    textAlign: 'center'
  },
  chartContainer: {
    marginBottom: 20
  },
  closeButton: {
    backgroundColor: '#0D6EFD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
