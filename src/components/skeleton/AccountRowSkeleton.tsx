import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonBlock from './SkeletonBlock';

export default function AccountRowSkeleton() {
  return (
    <View style={styles.row}>
      <SkeletonAvatar size={44} />
      <View style={styles.lines}>
        <SkeletonBlock width={120} height={10} borderRadius={5} />
        <SkeletonBlock width={80} height={8} borderRadius={4} />
      </View>
      <View style={styles.right}>
        <SkeletonBlock width={60} height={12} borderRadius={5} />
        <SkeletonBlock width={80} height={8} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 16,
    paddingVertical: 16,
    gap: 8,
  },
  lines: {
    flex: 1,
    gap: 6,
  },
  right: {
    width: 84,
    alignItems: 'flex-end',
    gap: 6,
  },
});
