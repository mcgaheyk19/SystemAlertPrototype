import React from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function SkeletonBlock({ width, height, borderRadius = 6, style }: Props) {
  return (
    <View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: '#DAE0E4',
        },
        style,
      ]}
    />
  );
}
