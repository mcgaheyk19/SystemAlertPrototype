import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function BannerSkeleton() {
  return (
    <View style={styles.banner}>
      {/* Right-aligned pill, 24px from right edge, centered vertically */}
      <View style={styles.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 108,
    backgroundColor: '#C2CBD2',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    shadowColor: 'rgb(101, 79, 226)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  pill: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.30)',
  },
});
