import { View, Text, StyleSheet } from 'react-native';
import type { MovieTile } from '@/app/types/movie';

type Props = {
  movies: MovieTile[];
};

export default function AnalyticsChart({ movies }: Props) {
  // Count movies by release year
  const year_counts: Record<number, number> = {};
  movies.forEach(movie => {
    const year = parseInt(movie.year);
    if (!isNaN(year)) {
      year_counts[year] = (year_counts[year] || 0) + 1;
    }
  });

  // Sort years
  const sorted_years = Object.keys(year_counts)
    .map(Number)
    .sort((a, b) => a - b);

  const max_count = Math.max(...Object.values(year_counts), 1);

  if (sorted_years.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No movie data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartWrapper}>
      {sorted_years.map(year => {
        const count = year_counts[year];
        const barHeight = (count / max_count) * 150; // Max height of 150

        return (
          <View key={year} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View style={[styles.bar, { height: barHeight }]} />
              <Text style={styles.barValue}>{count}</Text>
            </View>
            <Text style={styles.barLabel}>{year}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 20,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: '#0D6EFD',
    borderRadius: 4,
  },
  barValue: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  barLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 6,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#ccc',
    fontSize: 14,
  },
});
