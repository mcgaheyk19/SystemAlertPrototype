import React from 'react';
import { View } from 'react-native';

interface Props {
  size?: number;
}

export default function SkeletonAvatar({ size = 40 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#DAE0E4',
      }}
    />
  );
}
