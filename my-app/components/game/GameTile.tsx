import { Pressable, Text, Dimensions, Platform, StyleSheet } from 'react-native';
import type { GameTile } from '@/types/game/game';

const { width } = Dimensions.get('window');
const number_of_columns = 6;
const tile_size = width / number_of_columns - 32;

type Props = {
  item: GameTile;
  onPress: (item: GameTile) => void;
};

export default function GameTile({ item, onPress }: Props) {
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
        { backgroundColor: item.hex_color, width: tile_size, height: tile_size },
        pressed && styles.tilePressed
      ]}
      onPress={handlePress}
    >
      <Text style={styles.tileText}>{item.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  tilePressed: {
    opacity: 0.7,
  },
  tileText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
