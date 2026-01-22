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

import { router } from 'expo-router';
import { useState } from 'react';
import GameBlitzball from '../games/blitzball';
import GameBreakout from '../games/breakout';

const { width } = Dimensions.get('window');
const number_of_columns = 6;
const tile_size = width / number_of_columns - 32;

type Tile = {
  id: string;
  title: string
  hex_color: string;
  onPress: () => void;
  component: React.ReactNode;
  icon: string;
  description: string;
};

const tiles = [
  {
    id: '1',
    title: 'Breakout',
    hex_color: '#4CAF50',
    onPress: () => router.push('/games/breakout'),
    component: <GameBreakout />,
    icon: 'game-controller',
    description: 'A simple breakout game',
  },
  {
    id: '2',
    title: 'Blitzball',
    hex_color: '#4E818E',
    onPress: () => router.push('/games/blitzball'),
    component: <GameBlitzball />,
    icon: 'game-controller',
    description: 'A simple blitzball game',
  },
].sort((a: Tile, b: Tile) => a.title.localeCompare(b.title));

export default function GamesScreen() {
  const [search_query, setSearchQuery] = useState('');

  const filtered_tiles = tiles.filter((tile) =>
    tile.title.toLowerCase().includes(search_query.toLowerCase())
  );

  const handleTilePress = (item: Tile) => {
    // On web, blur any focused element before navigating to avoid aria-hidden warning
    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    item.onPress();
  };

  const renderItem = ({ item }: { item: Tile }) => (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: item.hex_color },
        pressed && styles.tilePressed
      ]}
      onPress={() => handleTilePress(item)}
    >
      <Text style={[styles.tileText]}>{item.title}</Text>
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
