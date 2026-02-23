import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonBlock from './SkeletonBlock';

const TILE_GAP = 12;
const SECTION_H_MARGIN = 16; // matches HomeScreen section marginHorizontal
const TILE_WIDTH =
  (Dimensions.get('window').width - SECTION_H_MARGIN * 2 - TILE_GAP) / 2;

interface Props {
  count?: number;
}

function QuickActionTile() {
  return (
    <View style={styles.tile}>
      <SkeletonAvatar size={48} />
      <SkeletonBlock width={60} height={8} borderRadius={4} />
    </View>
  );
}

export default function QuickActionGrid({ count = 4 }: Props) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.cell}>
          <QuickActionTile />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },
  cell: {
    width: TILE_WIDTH,
  },
  tile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgb(220, 223, 252)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 4,
  },
});
