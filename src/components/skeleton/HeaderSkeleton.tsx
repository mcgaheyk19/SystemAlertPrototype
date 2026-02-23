import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonBlock from './SkeletonBlock';

export default function HeaderSkeleton() {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <SkeletonBlock width={160} height={24} borderRadius={8} />
        <SkeletonBlock width={100} height={16} borderRadius={6} />
      </View>
      <SkeletonBlock width={90} height={32} borderRadius={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  left: {
    gap: 4,
  },
});
