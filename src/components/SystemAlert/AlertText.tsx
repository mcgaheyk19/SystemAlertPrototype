import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { AlertSegment } from '../../types/alerts';

interface Props {
  segments: AlertSegment[];
}

export default function AlertText({ segments }: Props) {
  return (
    <Text style={styles.base}>
      {segments.map((seg, i) =>
        seg.type === 'cta' ? (
          <Text key={i} style={styles.cta} onPress={seg.onPress}>
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#111827',
  },
  cta: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
