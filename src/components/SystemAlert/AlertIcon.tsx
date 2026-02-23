import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';

// Original path is drawn on a 20×20 grid; we center it inside the 28×28 SVG with translate(4,4)
const ICON_PATH =
  'M10.0174 12.2949C9.75 12.2949 9.5407 12.217 9.38954 12.0612C9.23837 11.9054 9.14535 11.6773 9.11047 11.3769L8.55233 5.66899C8.49419 5.16829 8.59302 4.76773 8.84884 4.46732C9.10465 4.15577 9.49419 4 10.0174 4C10.5174 4 10.8953 4.15577 11.1512 4.46732C11.407 4.76773 11.5058 5.16829 11.4477 5.66899L10.8895 11.3769C10.8547 11.6773 10.7616 11.9054 10.6105 12.0612C10.4709 12.217 10.2733 12.2949 10.0174 12.2949ZM10.0174 16C9.55233 16 9.18023 15.8665 8.90116 15.5994C8.63372 15.3324 8.5 14.9875 8.5 14.5647C8.5 14.153 8.63372 13.8192 8.90116 13.5633C9.18023 13.2962 9.55233 13.1627 10.0174 13.1627C10.4826 13.1627 10.843 13.2962 11.0988 13.5633C11.3663 13.8192 11.5 14.153 11.5 14.5647C11.5 14.9875 11.3663 15.3324 11.0988 15.5994C10.843 15.8665 10.4826 16 10.0174 16Z';

export default function AlertIcon() {
  return (
    <View
      style={{
        width: 28,
        height: 28,
        shadowColor: 'rgb(44, 59, 78)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      <Svg width={28} height={28} viewBox="0 0 28 28">
        <Defs>
          <LinearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FF3511" />
            <Stop offset="1" stopColor="#FF2358" />
          </LinearGradient>
        </Defs>
        {/* Circle with gradient fill and white stroke */}
        <Circle cx="14" cy="14" r="13" fill="url(#redGrad)" stroke="white" strokeWidth="1" />
        {/* Icon path centered: original 20×20 coords shifted by (4,4) to center in 28×28 */}
        <G transform="translate(4, 4)">
          <Path d={ICON_PATH} fill="white" />
        </G>
      </Svg>
    </View>
  );
}
