import React from 'react';
import { View, StyleSheet } from 'react-native';
import AccountRowSkeleton from './AccountRowSkeleton';

export default function AccountCardSkeleton() {
  return (
    <View style={styles.card}>
      <AccountRowSkeleton />
      <View style={styles.divider} />
      <AccountRowSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: 'rgb(220, 223, 252)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginLeft: 20 + 44 + 8, // paddingLeft + avatar + gap
  },
});
