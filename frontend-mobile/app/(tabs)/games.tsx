import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Platform
} from 'react-native';

import { router } from 'expo-router';
import { useState } from 'react';
import type { GameTile } from '@/types/game/game';
import GameTileComponent from '@/components/game/GameTile';
import GameBlitzball from '../games/blitzball';
import GameBreakout from '../games/breakout';

const number_of_columns = 6;

const tiles: GameTile[] = [
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
].sort((a: GameTile, b: GameTile) => a.title.localeCompare(b.title));

export default function GamesScreen() {
  const [search_query, setSearchQuery] = useState('');

  const filtered_tiles = tiles.filter((tile) =>
    tile.title.toLowerCase().includes(search_query.toLowerCase())
  );

  const handleTilePress = (item: GameTile) => {
    // On web, blur any focused element before navigating to avoid aria-hidden warning
    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    item.onPress();
  };

  const renderItem = ({ item }: { item: GameTile }) => (
    <GameTileComponent item={item} onPress={handleTilePress} />
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
});
