import { Pressable, View, Text, Image, Platform, StyleSheet, Dimensions } from 'react-native';
import { MovieTile } from '../../app/types/movie';

const { width } = Dimensions.get('window');
const number_of_columns = 4;
const tile_size = width / number_of_columns - 32;

type Props = {
  item: MovieTile;
  onPress: (movie: MovieTile) => void;
};

export default function MovieTileComponent({ item, onPress }: Props) {
  const handlePress = () => {
    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onPress(item);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        pressed && styles.tilePressed
      ]}
      onPress={handlePress}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }}
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
}

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    height: tile_size * 1.5, // Taller for movie posters
    width: tile_size,
    margin: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  }, tilePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  }, tileFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  }, posterOverlay: {
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
});
