import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  TextInput,
  Platform
} from 'react-native';

import { useRouter } from 'expo-router';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const number_of_columns = 6;
const tile_size = width / number_of_columns - 32;

type Tile = { id: string; title: string };

const tiles: Tile[] = Array.from({ length: 12 }, (_, i) => ({
  id: i.toString(),
  title: `Tile ${i + 1}`,
}));

export default function GamesScreen() {
  const router = useRouter();
  const [search_query, setSearchQuery] = useState('');

  const filtered_tiles = tiles.filter((tile) =>
    tile.title.toLowerCase().includes(search_query.toLowerCase())
  );

  const handleTilePress = () => {
    // On web, blur any focused element before navigating to avoid aria-hidden warning
    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    router.push('/games/breakout');
  };

  const renderItem = ({ item }: { item: Tile }) => (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={handleTilePress}
    >
      <Text style={styles.tileText}>{item.title}</Text>
    </Pressable>
  );
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search games..."
        value={search_query}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filtered_tiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={number_of_columns}
        contentContainerStyle={styles.list}
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
  text: {
    color: '#fff',
  },
  list: {
    padding: 8,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  tile: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    height: tile_size,
    width: tile_size,
    margin: 8, //space between squares
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  tilePressed: {
    opacity: 0.7,
  },
  tileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
