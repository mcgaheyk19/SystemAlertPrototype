import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AlertData } from '../../types/alerts';
import AlertIcon from './AlertIcon';
import AlertText from './AlertText';

interface Props {
  alert: AlertData;
  width: number;
  leftGap?: number;
  onDismiss: (id: string) => void;
  fixedHeight?: number;
  onHeightMeasured?: (height: number) => void;
}

const DISMISS_ICON_PATH =
  'M3.41482 12.5851C3.54336 12.7145 3.71842 12.7874 3.90081 12.7874C4.0832 12.7874 4.25825 12.7145 4.38656 12.5851L7.99995 8.97166L11.6268 12.5985C11.8951 12.8671 12.3303 12.8671 12.5985 12.5985C12.8671 12.3302 12.8671 11.8951 12.5985 11.6268L8.97166 7.99995L12.5985 4.37307C12.8671 4.10476 12.8671 3.66965 12.5985 3.40135C12.3302 3.13282 11.8951 3.13282 11.6268 3.40135L7.99995 7.02824L4.37307 3.41485C4.10476 3.14654 3.66965 3.14654 3.40135 3.41485C3.13282 3.68315 3.13282 4.11826 3.40135 4.38656L7.02824 7.99995L3.41485 11.6268C3.1541 11.8931 3.1541 12.3188 3.41485 12.5851H3.41482Z';

function DismissIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d={DISMISS_ICON_PATH} fill="#0F1419" />
    </Svg>
  );
}

export default function AlertCard({ alert, width, leftGap = 0, onDismiss, fixedHeight, onHeightMeasured }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const animWidth = useRef(new Animated.Value(width + leftGap)).current;

  const handleDismissPress = () => {
    // Phase 1: scale down + fade out (native driver, 140ms ease-in)
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: collapse layout width so remaining cards slide over (JS driver, 110ms ease-out)
      Animated.timing(animWidth, {
        toValue: 0,
        duration: 110,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        onDismiss(alert.id);
      });
    });
  };

  return (
    // Outer wrapper: animated width collapses to close the gap (JS driver)
    // No overflow:hidden needed — card is already invisible before width collapses
    <Animated.View style={{ width: animWidth }}>
      <Animated.View
        style={[
          styles.outer,
          { width, marginLeft: leftGap },
          fixedHeight ? { height: fixedHeight } : undefined,
          { opacity, transform: [{ scale }] },
        ]}
        onLayout={
          fixedHeight === undefined
            ? ({ nativeEvent }) => onHeightMeasured?.(nativeEvent.layout.height)
            : undefined
        }
      >
        <View style={[styles.inner, alert.dismissible && styles.innerDismissible]}>
          <View style={styles.row}>
            <AlertIcon />
            <View style={styles.textWrap}>
              <AlertText segments={alert.segments} />
            </View>
          </View>

          {alert.dismissible && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismissPress}
              accessibilityLabel="Dismiss alert"
            >
              <DismissIcon />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inner: {
    flex: 1,
    backgroundColor: '#F2F5F8',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'center',
  },
  innerDismissible: {
    paddingRight: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    marginLeft: 8,
  },
  dismissButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
