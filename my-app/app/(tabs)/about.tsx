import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import ApiService from '@/services/api';

const CARD_COLUMNS = 3;
const CARD_SPACING = 8;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - (CARD_SPACING * (CARD_COLUMNS + 1))) / CARD_COLUMNS;
const cardHeight = cardWidth * 1.4; // MTG card aspect ratio

interface MtgSet {
  id: string;
  code: string;
  name: string;
  icon_svg_uri: string;
  released_at: string;
}

interface MtgCard {
  id: string;
  name: string;
  image_uris?: {
    small: string;
    normal: string;
  };
  collector_number: string;
  set: string;
}

export default function MtgCardBinderScreen() {
  const [sets, setSets] = useState<MtgSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<MtgSet | null>(null);
  const [cards, setCards] = useState<MtgCard[]>([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [userCollection, setUserCollection] = useState<Set<string>>(new Set()); // Will be populated from DB later
  const scrollViewRef = useRef<ScrollView>(null);

  // Load sets on mount
  useEffect(() => {
    const loadSets = async () => {
      try {
        setLoadingSets(true);
        const response = await ApiService.getSets();
        console.log('Sets response:', response);
        if (response.success && response.data?.data) {
          // Sort by release date (newest first)
          const sortedSets = response.data.data
            .filter((set: any) => set.icon_svg_uri) // Only sets with icons
            .sort((a: any, b: any) => {
              const dateA = new Date(a.released_at || 0).getTime();
              const dateB = new Date(b.released_at || 0).getTime();
              return dateB - dateA; // Newest first
            });
          console.log('Sorted sets:', sortedSets.length);
          setSets(sortedSets);
        } else {
          console.log('No sets in response:', response);
        }
      } catch (error) {
        console.error('Error loading sets:', error);
      } finally {
        setLoadingSets(false);
      }
    };

    loadSets();
  }, []);

  // Load cards when set is selected
  useEffect(() => {
    if (!selectedSet) {
      setCards([]);
      return;
    }

    const loadCards = async () => {
      try {
        setLoadingCards(true);
        const response = await ApiService.getCardsBySet(selectedSet.code);
        console.log('Cards response:', response);
        if (response.success && response.data?.data) {
          // Cards are already sorted by collector_number from backend
          console.log('Setting cards:', response.data.data.length);
          setCards(response.data.data);
        } else {
          console.log('No cards in response:', response);
          setCards([]);
        }
      } catch (error) {
        console.error('Error loading cards:', error);
        setCards([]);
      } finally {
        setLoadingCards(false);
      }
    };

    loadCards();
  }, [selectedSet]);

  const renderSetIcon = ({ item }: { item: MtgSet }) => (
    <TouchableOpacity
      onPress={() => setSelectedSet(item)}
      style={[
        styles.setIconContainer,
        selectedSet?.id === item.id && styles.setIconSelected,
      ]}
    >
      <Image
        source={{ uri: item.icon_svg_uri }}
        style={styles.setIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderCard = ({ item, index }: { item: MtgCard; index: number }) => {
    const isInCollection = userCollection.has(item.id);
    const imageUri = item.image_uris?.normal || item.image_uris?.small;

    return (
      <View style={styles.cardContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.cardImage,
              !isInCollection && styles.cardImageTransparent,
            ]}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.cardPlaceholder, !isInCollection && styles.cardImageTransparent]}>
            <Text style={styles.cardPlaceholderText}>{item.name}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Set Icons Horizontal Scroll */}
      <View style={styles.setsContainer}>
        {loadingSets ? (
          <ActivityIndicator size="small" color="#ffd33d" style={styles.loading} />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.setsScrollContent}
            style={styles.setsScrollView}
            nestedScrollEnabled={true}
          >
            {sets.map((set) => (
              <TouchableOpacity
                key={set.id}
                onPress={() => setSelectedSet(set)}
                style={[
                  styles.setIconContainer,
                  selectedSet?.id === set.id && styles.setIconSelected,
                ]}
              >
                <Image
                  source={{ uri: set.icon_svg_uri }}
                  style={styles.setIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Card Binder Grid */}
      {selectedSet && (
        <View style={styles.binderContainer}>
          {loadingCards ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffd33d" />
              <Text style={styles.loadingText}>Loading cards...</Text>
            </View>
          ) : cards.length > 0 ? (
            <FlatList
              data={cards}
              renderItem={renderCard}
              numColumns={CARD_COLUMNS}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.cardsGrid}
              columnWrapperStyle={CARD_COLUMNS > 1 ? styles.cardRow : undefined}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No cards found</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No cards found for this set</Text>
            </View>
          )}
        </View>
      )}

      {/* Empty State */}
      {!selectedSet && !loadingSets && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Select a set to view cards</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  setsContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    maxHeight: 84,
  },
  setsScrollView: {
    flexGrow: 0,
  },
  setsScrollContent: {
    paddingHorizontal: CARD_SPACING,
    alignItems: 'center',
    paddingRight: 20,
  },
  setIconContainer: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  setIconSelected: {
    borderColor: '#ffd33d',
    backgroundColor: '#444',
  },
  setIcon: {
    width: 50,
    height: 50,
  },
  binderContainer: {
    flex: 1,
    padding: CARD_SPACING,
  },
  cardsGrid: {
    paddingBottom: CARD_SPACING,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: CARD_SPACING,
  },
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageTransparent: {
    opacity: 0.3,
  },
  cardPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  cardPlaceholderText: {
    color: '#888',
    fontSize: 10,
    textAlign: 'center',
    padding: 4,
  },
  loading: {
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
  },
});
